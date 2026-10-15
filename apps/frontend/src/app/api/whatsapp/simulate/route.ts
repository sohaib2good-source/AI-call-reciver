import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const AI_SETTINGS_FILE = path.join(DATA_DIR, "ai-settings.json");
const PROFILE_FILE = path.join(DATA_DIR, "business-profile.json");
const LOGS_FILE = path.join(DATA_DIR, "whatsapp-logs.json");

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }
    const { action = "incoming_call", callerNumber = "+1 (555) 321-9876", userInput = "" } = body;

    let businessName = "biryani master link road";
    let compiledGreeting =
      "Thank you for calling biryani master link road. How may I assist you with your order, reservation, or appointment today?";
    let personaId = "female_young";
    let voiceId = "cgSgspJ2msm6clMCkdW9"; // Jessica default matching active voice

    if (fs.existsSync(AI_SETTINGS_FILE)) {
      try {
        const aiJson = JSON.parse(fs.readFileSync(AI_SETTINGS_FILE, "utf-8"));
        if (aiJson.businessName) businessName = aiJson.businessName;
        if (aiJson.greeting?.compiledGreeting) compiledGreeting = aiJson.greeting.compiledGreeting;
        if (aiJson.voice?.selectedAgentId) personaId = aiJson.voice.selectedAgentId;
        if (aiJson.voice?.voiceId) voiceId = aiJson.voice.voiceId;
      } catch {}
    } else if (fs.existsSync(PROFILE_FILE)) {
      try {
        const profJson = JSON.parse(fs.readFileSync(PROFILE_FILE, "utf-8"));
        if (profJson.businessName) businessName = profJson.businessName;
      } catch {}
    }

    let agentResponse = "";
    let outcome = "ANSWERED";
    let type = "CALL";

    if (action === "incoming_call") {
      type = "CALL";
      agentResponse = compiledGreeting;
      outcome = "CALL_PICKED_UP_AND_GREETED";
    } else {
      type = "VOICE_NOTE";
      const q = (userInput || "").toLowerCase();

      if (q.includes("table") || q.includes("reserve") || q.includes("book")) {
        agentResponse = `Hello! I would be delighted to reserve a table for you at ${businessName}. What date, time, and how many guests will you be bringing?`;
        outcome = "BOOKED_RESERVATION";
      } else if (q.includes("menu") || q.includes("food") || q.includes("biryani") || q.includes("special")) {
        agentResponse = `At ${businessName}, our most ordered dish is our special Dum Biryani, followed by Garlic Butter Naan and Chef's Special Kebab Platter. Would you like to order for pickup or delivery?`;
        outcome = "PROVIDED_MENU";
      } else if (q.includes("hour") || q.includes("time") || q.includes("open")) {
        agentResponse = `We are open 7 days a week from 11:00 AM to 11:00 PM at ${businessName}. Please come visit us!`;
        outcome = "PROVIDED_HOURS";
      } else {
        agentResponse = `Thank you for contacting ${businessName}! I am your AI receptionist. I can help take your takeaway order, reserve a dining table, or answer questions. How may I help you?`;
        outcome = "ANSWERED_INQUIRY";
      }
    }

    // Generate real-time TTS audio for the exact text (ElevenLabs primary, OpenAI TTS fallback)
    let audioUrl = "";
    const elevenApiKey = process.env.ELEVENLABS_API_KEY || "";
    const openaiApiKey = process.env.OPENAI_API_KEY || "";

    try {
      const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": elevenApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: agentResponse,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (ttsRes.ok) {
        const audioBuffer = await ttsRes.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString("base64");
        audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
      } else {
        console.warn("ElevenLabs TTS returned non-200, falling back to OpenAI TTS...");
      }
    } catch (ttsErr) {
      console.error("ElevenLabs TTS generation error:", ttsErr);
    }

    // Fallback to OpenAI TTS if ElevenLabs quota is reached
    if (!audioUrl && openaiApiKey) {
      try {
        const oaiRes = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            input: agentResponse,
            voice: "nova", // Pleasant, professional female receptionist voice
          }),
        });

        if (oaiRes.ok) {
          const audioBuffer = await oaiRes.arrayBuffer();
          const base64Audio = Buffer.from(audioBuffer).toString("base64");
          audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
        } else {
          console.warn("OpenAI TTS returned non-200:", await oaiRes.text());
        }
      } catch (oaiErr) {
        console.error("OpenAI TTS fallback error:", oaiErr);
      }
    }

    const logEntry = {
      id: `sim_${Date.now()}`,
      callId: `wa_sim_${Math.random().toString(36).substring(2, 8)}`,
      callerNumber,
      type,
      direction: "INBOUND",
      status: "COMPLETED",
      timestamp: new Date().toISOString(),
      durationSeconds: action === "incoming_call" ? 18 : 28,
      callerInput: action === "incoming_call" ? "Incoming Voice Call via WhatsApp" : userInput,
      agentResponse,
      outcome,
      voiceId,
      voiceName: personaId,
      audioUrl: audioUrl || undefined,
    };

    // Save to persistent logs
    try {
      let logs: any[] = [];
      if (fs.existsSync(LOGS_FILE)) {
        logs = JSON.parse(fs.readFileSync(LOGS_FILE, "utf-8"));
        if (!Array.isArray(logs)) logs = [];
      }
      logs.unshift(logEntry);
      if (logs.length > 50) logs = logs.slice(0, 50);
      if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
    } catch (e) {
      console.warn("Could not save sim log:", e);
    }

    return NextResponse.json({
      success: true,
      action,
      agentResponse,
      audioUrl,
      businessName,
      personaId,
      logEntry,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
