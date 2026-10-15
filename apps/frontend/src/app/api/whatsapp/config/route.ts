import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "whatsapp-config.json");
const AI_SETTINGS_FILE = path.join(DATA_DIR, "ai-settings.json");
const PROFILE_FILE = path.join(DATA_DIR, "business-profile.json");

export async function GET() {
  try {
    let config = {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "1284705801403358",
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || "1689894745896050",
      verifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "my_super_secret_verify_token_123",
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || "",
      autoPickCalls: true,
      voiceRepliesEnabled: true,
      whisperTranscriptionEnabled: true,
      elevenLabsTtsEnabled: true,
      selectedPersonaId: "female_receptionist",
      transferPhoneNumber: "+1 (555) 019-2834",
      status: "connected",
      lastVerifiedAt: new Date().toISOString(),
    };

    if (fs.existsSync(CONFIG_FILE)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
        config = { ...config, ...fileData };
      } catch (e) {
        console.warn("Could not read whatsapp-config.json:", e);
      }
    }

    // Read live restaurant name and greeting from ai-settings.json
    let businessName = "biryani master link road";
    let compiledGreeting =
      "Thank you for calling biryani master link road. How may I assist you with your order, reservation, or appointment today?";
    let activePersona = "female_receptionist";

    if (fs.existsSync(AI_SETTINGS_FILE)) {
      try {
        const aiJson = JSON.parse(fs.readFileSync(AI_SETTINGS_FILE, "utf-8"));
        if (aiJson.businessName) businessName = aiJson.businessName;
        if (aiJson.greeting?.compiledGreeting) compiledGreeting = aiJson.greeting.compiledGreeting;
        if (aiJson.voice?.selectedAgentId) activePersona = aiJson.voice.selectedAgentId;
      } catch {}
    } else if (fs.existsSync(PROFILE_FILE)) {
      try {
        const profJson = JSON.parse(fs.readFileSync(PROFILE_FILE, "utf-8"));
        if (profJson.businessName) businessName = profJson.businessName;
      } catch {}
    }

    return NextResponse.json({
      success: true,
      config: {
        ...config,
        businessName,
        compiledGreeting,
        activePersona,
        webhookUrl: "/api/whatsapp/webhook",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    let existing = {};
    if (fs.existsSync(CONFIG_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      } catch {}
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");

    return NextResponse.json({ success: true, config: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
