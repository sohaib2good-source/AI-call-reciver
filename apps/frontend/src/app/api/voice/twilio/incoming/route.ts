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

function getRetellApiKey(): string | undefined {
  if (process.env.RETELL_API_KEY && process.env.RETELL_API_KEY.trim() !== "") {
    return process.env.RETELL_API_KEY.trim();
  }

  const candidates = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../../.env"),
    path.resolve(process.cwd(), "../.env"),
  ];

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const match = content.match(/^RETELL_API_KEY=["']?([^"'\r\n]+)["']?/m);
        if (match && match[1] && match[1].trim() !== "") {
          return match[1].trim();
        }
      }
    } catch {}
  }
  return undefined;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData().catch(() => null);
    const from = formData?.get("From")?.toString() || "Unknown Caller";
    const to = formData?.get("To")?.toString() || "";
    const callSid = formData?.get("CallSid")?.toString() || `call_${Date.now()}`;

    const greeting = getGreeting();
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "aireceiver.vortexlabsworld.com";
    const proto = req.headers.get("x-forwarded-proto");
    const protocol = proto || (host.includes("localhost") ? "http" : "https");
    const actionUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/twilio/respond`
      : `${protocol}://${host}/api/voice/twilio/respond`;

    // 1. Connect Twilio call directly to ElevenLabs Conversational AI Stream
    const elevenLabsAgentId =
      process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ||
      process.env.ELEVENLABS_AGENT_ID ||
      "agent_2001m4ha09d9e88bn4c0vmjzh0rw";

    if (elevenLabsAgentId) {
      const streamUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${elevenLabsAgentId}`;
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${streamUrl}" />
  </Connect>
</Response>`;

      // Log call
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
          to: to,
          type: "CELLULAR_CALL",
          provider: "TWILIO",
          aiEngine: "ELEVENLABS_CONVAI",
          agentId: elevenLabsAgentId,
          direction: "INBOUND",
          status: "CONNECTED_TO_ELEVENLABS",
          outcome: "BRIDGED_TO_ELEVENLABS_VOICE_AGENT",
        });
        if (logs.length > 60) logs = logs.slice(0, 60);
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
      } catch {}

      return new Response(twiml, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }

    // 2. Fallback if Retell key not configured
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
        provider: "TWILIO",
        direction: "INBOUND",
        status: "ANSWERED",
        callerInput: "Inbound Cellular Phone Call",
        agentResponse: greeting,
        outcome: "CALL_PICKED_UP_AND_GREETED",
      });
      if (logs.length > 60) logs = logs.slice(0, 60);
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
    } catch {}

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
