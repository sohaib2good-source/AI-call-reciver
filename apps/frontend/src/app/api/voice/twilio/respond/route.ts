import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const AI_SETTINGS_FILE = path.join(DATA_DIR, "ai-settings.json");
const PROFILE_FILE = path.join(DATA_DIR, "business-profile.json");
const MENU_FILE = path.join(DATA_DIR, "menu-items.json");
const LOGS_FILE = path.join(DATA_DIR, "whatsapp-logs.json");

function getRestaurantContext() {
  let businessName = "biryani master link road";
  let menuSummary = "Special Dum Biryani ($14.99), Chicken Tikka Biryani ($15.99), Garlic Butter Naan ($3.99), Chef's Kebab Platter ($19.99), Gulab Jamun ($4.99)";
  let transferNumber = "+15550001111";

  try {
    if (fs.existsSync(AI_SETTINGS_FILE)) {
      const ai = JSON.parse(fs.readFileSync(AI_SETTINGS_FILE, "utf-8"));
      if (ai.businessName) businessName = ai.businessName;
      if (ai.transferPhoneNumber) transferNumber = ai.transferPhoneNumber;
    }
    if (fs.existsSync(MENU_FILE)) {
      const items = JSON.parse(fs.readFileSync(MENU_FILE, "utf-8"));
      if (Array.isArray(items) && items.length > 0) {
        menuSummary = items
          .filter((i) => i.status === "Active")
          .map((i) => `${i.name} ($${i.price})`)
          .join(", ");
      }
    }
  } catch {}

  return { businessName, menuSummary, transferNumber };
}

async function generateAiVoiceReply(userSpeech: string, context: any, openaiApiKey: string): Promise<string> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are the friendly, professional phone receptionist answering calls for "${context.businessName}".
Menu & Offerings: ${context.menuSummary}
Opening Hours: 11:00 AM - 11:00 PM, 7 days a week.
Location: Link Road.
Guidelines:
- Keep responses short, concise, and natural for telephone speech (1 to 2 sentences max).
- If the customer wants to reserve a table, politely ask for the date, time, and number of guests.
- If the customer asks about food or recommendations, recommend our special Dum Biryani and Kebab Platter.
- If the customer asks to speak to the manager or a human, say "Please hold while I transfer you to the manager."`,
          },
          {
            role: "user",
            content: userSpeech,
          },
        ],
        temperature: 0.6,
        max_tokens: 120,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) return reply.trim();
    }
  } catch (e) {
    console.error("AI phone reply error:", e);
  }
  return `At ${context.businessName}, we have our famous Dum Biryani and Kebab Platter available for pickup and delivery. Would you like to reserve a table or place an order?`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData().catch(() => null);
    const speechResult = formData?.get("SpeechResult")?.toString() || "";
    const from = formData?.get("From")?.toString() || "Customer";
    const callSid = formData?.get("CallSid")?.toString() || `call_${Date.now()}`;

    const host = req.headers.get("host") || "localhost:3090";
    const protocol = host.includes("trycloudflare.com") || host.includes("https") ? "https" : "http";
    const actionUrl = `${protocol}://${host}/api/voice/twilio/respond`;

    const context = getRestaurantContext();
    const openaiApiKey = process.env.OPENAI_API_KEY || "";

    // Handle Transfer to human if requested
    const lower = speechResult.toLowerCase();
    if (lower.includes("human") || lower.includes("manager") || lower.includes("person") || lower.includes("staff")) {
      const transferTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">Please hold while I connect you to our restaurant manager.</Say>
  <Dial>${context.transferNumber}</Dial>
</Response>`;
      return new Response(transferTwiml, { status: 200, headers: { "Content-Type": "text/xml" } });
    }

    // Handle Goodbye
    if (lower.includes("bye") || lower.includes("goodbye") || lower.includes("that is all") || lower.includes("no thanks")) {
      const byeTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">Thank you for calling biryani master link road. Have a wonderful day!</Say>
  <Hangup/>
</Response>`;
      return new Response(byeTwiml, { status: 200, headers: { "Content-Type": "text/xml" } });
    }

    let agentResponse = "Thank you. How else can I assist you today?";
    if (speechResult) {
      agentResponse = await generateAiVoiceReply(speechResult, context, openaiApiKey);
    }

    // Log the turn
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
        status: "COMPLETED",
        durationSeconds: 22,
        callerInput: `🗣️ [Spoken into Phone]: "${speechResult}"`,
        agentResponse,
        outcome: "CONVERSED_WITH_CALLER",
        voiceName: "Polly.Joanna-Neural",
      });
      if (logs.length > 60) logs = logs.slice(0, 60);
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
    } catch {}

    // Continue conversation with another Gather
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="${actionUrl}" method="POST" speechTimeout="auto" timeout="6">
    <Say voice="Polly.Joanna-Neural">${agentResponse}</Say>
  </Gather>
  <Say voice="Polly.Joanna-Neural">Thank you for calling biryani master link road. Have a great day. Goodbye!</Say>
  <Hangup/>
</Response>`;

    return new Response(twiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err: any) {
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">Thank you for calling biryani master link road. Goodbye!</Say>
  <Hangup/>
</Response>`;
    return new Response(errorTwiml, {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
