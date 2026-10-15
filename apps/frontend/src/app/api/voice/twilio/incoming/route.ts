import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const AI_SETTINGS_FILE = path.join(DATA_DIR, "ai-settings.json");
const PROFILE_FILE = path.join(DATA_DIR, "business-profile.json");
const LOGS_FILE = path.join(DATA_DIR, "whatsapp-logs.json");

function getGreeting() {
  let greeting =
    "Thank you for calling biryani master link road. How may I assist you with your order, reservation, or appointment today?";
  try {
    if (fs.existsSync(AI_SETTINGS_FILE)) {
      const ai = JSON.parse(fs.readFileSync(AI_SETTINGS_FILE, "utf-8"));
      if (ai.greeting?.compiledGreeting) greeting = ai.greeting.compiledGreeting;
    }
  } catch {}
  return greeting;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData().catch(() => null);
    const from = formData?.get("From")?.toString() || "Unknown Caller";
    const callSid = formData?.get("CallSid")?.toString() || `call_${Date.now()}`;

    const greeting = getGreeting();
    const host = req.headers.get("host") || "localhost:3090";
    const protocol = host.includes("trycloudflare.com") || host.includes("https") ? "https" : "http";
    const actionUrl = `${protocol}://${host}/api/voice/twilio/respond`;

    // Log call start
    try {
      let logs: any[] = [];
      if (fs.existsSync(LOGS_FILE)) {
        logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
        if (!Array.isArray(logs)) logs = [];
      }
      logs.unshift({
        id: `call_${Date.now()}`,
        timestamp: new Date().toISOString(),
        callId: callSid,
        callerNumber: from,
        type: "CELLULAR_CALL",
        direction: "INBOUND",
        status: "ANSWERED",
        durationSeconds: 15,
        callerInput: "Inbound Cellular Phone Call",
        agentResponse: greeting,
        outcome: "CALL_PICKED_UP_AND_GREETED",
        voiceName: "Polly.Joanna-Neural",
      });
      if (logs.length > 60) logs = logs.slice(0, 60);
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
    } catch {}

    // Return TwiML with Speech Gather
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${actionUrl}" method="POST" speechTimeout="auto" timeout="6">
    <Say voice="Polly.Joanna-Neural">${greeting}</Say>
  </Gather>
  <Say voice="Polly.Joanna-Neural">I did not hear your response. You can call back anytime at biryani master link road. Goodbye!</Say>
  <Hangup/>
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err: any) {
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling biryani master link road. We are currently experiencing high call volume. Please call again soon.</Say>
  <Hangup/>
</Response>`;
    return new Response(fallback, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
