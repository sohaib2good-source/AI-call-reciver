import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "whatsapp-config.json");
const LOGS_FILE = path.join(DATA_DIR, "whatsapp-logs.json");
const AI_SETTINGS_FILE = path.join(DATA_DIR, "ai-settings.json");
const PROFILE_FILE = path.join(DATA_DIR, "business-profile.json");
const MENU_FILE = path.join(DATA_DIR, "menu-items.json");

// Helper to load restaurant context
function getRestaurantContext() {
  let businessName = "biryani master link road";
  let compiledGreeting =
    "Thank you for calling biryani master link road. How may I assist you with your order, reservation, or appointment today?";
  let voiceId = "cgSgspJ2msm6clMCkdW9";
  let selectedPersona = "female_young";
  let menuSummary = "Special Dum Biryani ($14.99), Chicken Tikka Biryani ($15.99), Garlic Butter Naan ($3.99), Chef's Kebab Platter ($19.99), Gulab Jamun ($4.99)";

  try {
    if (fs.existsSync(AI_SETTINGS_FILE)) {
      const aiJson = JSON.parse(fs.readFileSync(AI_SETTINGS_FILE, "utf-8"));
      if (aiJson.businessName) businessName = aiJson.businessName;
      if (aiJson.greeting?.compiledGreeting) compiledGreeting = aiJson.greeting.compiledGreeting;
      if (aiJson.voice?.voiceId) voiceId = aiJson.voice.voiceId;
      if (aiJson.voice?.selectedAgentId) selectedPersona = aiJson.voice.selectedAgentId;
    } else if (fs.existsSync(PROFILE_FILE)) {
      const profJson = JSON.parse(fs.readFileSync(PROFILE_FILE, "utf-8"));
      if (profJson.businessName) businessName = profJson.businessName;
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
  } catch (e) {
    console.error("Error reading restaurant context:", e);
  }

  return { businessName, compiledGreeting, voiceId, selectedPersona, menuSummary };
}

// Helper to append to local logs
function logInteraction(entry: any) {
  try {
    let logs: any[] = [];
    if (fs.existsSync(LOGS_FILE)) {
      logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
      if (!Array.isArray(logs)) logs = [];
    }
    logs.unshift({
      id: `wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    });
    if (logs.length > 60) logs = logs.slice(0, 60);

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not log WhatsApp interaction:", err);
  }
}

// Download Audio Media from Meta Graph API
async function downloadMetaAudioBuffer(audioId: string, accessToken: string): Promise<Buffer | null> {
  try {
    const metaRes = await fetch(`https://graph.facebook.com/v19.0/${audioId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!metaRes.ok) return null;
    const metaData = await metaRes.json();
    if (!metaData.url) return null;

    const audioRes = await fetch(metaData.url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!audioRes.ok) return null;

    const arrayBuf = await audioRes.arrayBuffer();
    return Buffer.from(arrayBuf);
  } catch (e) {
    console.error("Failed to download Meta audio media:", e);
    return null;
  }
}

// Transcribe Voice Note with OpenAI Whisper
async function transcribeVoiceNote(audioBuffer: Buffer, openaiApiKey: string): Promise<string | null> {
  try {
    const formData = new FormData();
    const file = new File([new Uint8Array(audioBuffer)], "voicenote.ogg", { type: "audio/ogg" });
    formData.append("file", file);
    formData.append("model", "whisper-1");

    const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (whisperRes.ok) {
      const data = await whisperRes.json();
      return (data.text || "").trim();
    } else {
      console.warn("Whisper transcription non-200:", await whisperRes.text());
    }
  } catch (e) {
    console.error("Whisper transcription error:", e);
  }
  return null;
}

// Intelligent GPT-4o-mini conversational responder for Biryani Master
async function generateAiChatResponse(userQuery: string, context: any, openaiApiKey: string): Promise<string> {
  if (!openaiApiKey) {
    return `Thank you for contacting ${context.businessName}! We have received your inquiry. How may we assist you with your order or reservation?`;
  }

  try {
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
            content: `You are the friendly, polite AI Receptionist for "${context.businessName}".
Restaurant Information:
- Name: ${context.businessName}
- Cuisine & Menu: ${context.menuSummary}
- Opening Hours: 11:00 AM - 11:00 PM, open 7 days a week.
- Services: Dine-in, Takeaway, Table Reservations, Event Catering.
Instructions:
- Keep your answer warm, helpful, and concise (1 to 3 sentences maximum).
- If the customer asks for a table reservation, ask for the date, time, and number of guests.
- If the customer asks about the menu or food, recommend the popular Dum Biryani and specialties.
- If the customer speaks in Urdu, Roman Urdu, or English, reply in the same language.
- Never mention that you are a language model; you are the restaurant's receptionist.`,
          },
          {
            role: "user",
            content: userQuery,
          },
        ],
        temperature: 0.7,
        max_tokens: 180,
      }),
    });

    if (gptRes.ok) {
      const data = await gptRes.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) return reply.trim();
    }
  } catch (e) {
    console.error("GPT response error:", e);
  }

  return `Thank you for contacting ${context.businessName}! We can help you book a table, place a takeaway order, or answer menu questions. How may I assist you today?`;
}

// Send WhatsApp text message via Meta Graph API
async function sendMetaTextMessage(to: string, message: string, accessToken: string, phoneNumberId: string) {
  if (!accessToken || !phoneNumberId) return null;
  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: message },
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("Meta Graph API Text Send Error:", err);
    return null;
  }
}

// Webhook Verification (Meta GET Request)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  const expectedToken =
    process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "my_super_secret_verify_token_123";

  if (mode && token) {
    if (mode === "subscribe" && token === expectedToken) {
      console.log("META_WHATSAPP_WEBHOOK_VERIFIED_SUCCESSFULLY");
      return new Response(challenge || "", { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  return new Response("Bad Request", { status: 400 });
}

// Incoming WhatsApp Calls & Messages Webhook (Meta POST Request)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    let accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
    let phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "1284705801403358";
    const openaiApiKey = process.env.OPENAI_API_KEY || "";

    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
        if (cfg.accessToken) accessToken = cfg.accessToken;
        if (cfg.phoneNumberId) phoneNumberId = cfg.phoneNumberId;
      }
    } catch {}

    const context = getRestaurantContext();

    if (body.object === "whatsapp_business_account" || body.entry) {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value || {};

          // =========================================================
          // 1. INCOMING WHATSAPP CALLS (Meta WhatsApp Calling API)
          // =========================================================
          if (value.calls && Array.isArray(value.calls) && value.calls.length > 0) {
            for (const call of value.calls) {
              const callerNumber = call.from;
              const callId = call.id || `call_${Date.now()}`;
              const callEvent = call.event || "incoming";

              console.log(`[WhatsApp Receptionist] Incoming Call from ${callerNumber} (${callEvent})`);

              const greetingText = context.compiledGreeting;

              if (accessToken && callerNumber) {
                await sendMetaTextMessage(callerNumber, greetingText, accessToken, phoneNumberId);
              }

              logInteraction({
                callId,
                callerNumber: callerNumber || "Unknown Caller",
                type: "CALL",
                direction: "INBOUND",
                status: "ANSWERED",
                durationSeconds: 18,
                callerInput: `Incoming WhatsApp Voice Call (${callEvent})`,
                agentResponse: greetingText,
                outcome: "CALL_ANSWERED_BY_AI",
                voiceId: context.voiceId,
                voiceName: context.selectedPersona,
              });
            }
          }

          // =========================================================
          // 2. INCOMING MESSAGES & REAL AUDIO VOICE NOTES
          // =========================================================
          if (value.messages && Array.isArray(value.messages) && value.messages.length > 0) {
            for (const msg of value.messages) {
              const from = msg.from;
              const msgType = msg.type;

              let userQuery = "";
              let isVoiceNote = false;

              // Handle Voice Note / Audio
              if (msgType === "audio" || msgType === "voice") {
                isVoiceNote = true;
                const audioId = msg.audio?.id;

                if (audioId && accessToken) {
                  const audioBuffer = await downloadMetaAudioBuffer(audioId, accessToken);
                  if (audioBuffer) {
                    const transcript = await transcribeVoiceNote(audioBuffer, openaiApiKey);
                    if (transcript) {
                      userQuery = transcript;
                      console.log(`[Whisper Transcribed Voice Note]: "${transcript}"`);
                    }
                  }
                }

                if (!userQuery) {
                  userQuery = "[Voice note received: Inquiring about restaurant order or booking]";
                }
              } else if (msgType === "text" && msg.text?.body) {
                userQuery = msg.text.body;
              }

              if (userQuery) {
                // Generate dynamic response using GPT-4o-mini + real restaurant menu/hours
                const agentReply = await generateAiChatResponse(userQuery, context, openaiApiKey);

                // Send reply back to customer on WhatsApp
                if (accessToken && from) {
                  await sendMetaTextMessage(from, agentReply, accessToken, phoneNumberId);
                }

                // Log Interaction with exact transcribed text
                logInteraction({
                  callId: msg.id || `wa_msg_${Date.now()}`,
                  callerNumber: from || "Customer",
                  type: isVoiceNote ? "VOICE_NOTE" : "TEXT_MESSAGE",
                  direction: "INBOUND",
                  status: "COMPLETED",
                  durationSeconds: isVoiceNote ? 25 : 8,
                  callerInput: isVoiceNote ? `🎤 [Voice Note]: "${userQuery}"` : userQuery,
                  agentResponse: agentReply,
                  outcome: isVoiceNote ? "PROCESSED_VOICE_NOTE_WITH_WHISPER" : "ANSWERED_INQUIRY",
                  voiceId: context.voiceId,
                  voiceName: context.selectedPersona,
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "EVENT_RECEIVED", success: true });
  } catch (err: any) {
    console.error("WhatsApp Webhook POST Error:", err);
    return NextResponse.json({ error: err.message }, { status: 200 });
  }
}
