import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PROFILE_FILE = path.join(DATA_DIR, "business-profile.json");
const AI_SETTINGS_FILE = path.join(DATA_DIR, "ai-settings.json");

export const DEFAULT_BUSINESS_PROFILE = {
  businessName: "The Grand AI Cafe",
  legalName: "Grand AI Cafe LLC",
  description: "A futuristic dining and reception experience powered by conversational AI.",
  specialtyValue: "International",
  phone: "+1 234 567 8900",
  email: "hello@grandai.cafe",
  website: "https://grandai.cafe",
  addressStreet: "123 AI Boulevard",
  addressCity: "San Francisco",
  addressState: "CA",
  addressZip: "94103",
  addressCountry: "USA",
  selectedIndustries: ["restaurant"],
  selectedCapabilities: ["order_taker", "reservation", "book_appointment"],
};

function readProfileFromFile() {
  try {
    if (!fs.existsSync(PROFILE_FILE)) {
      return DEFAULT_BUSINESS_PROFILE;
    }
    const raw = fs.readFileSync(PROFILE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading business-profile.json:", err);
    return DEFAULT_BUSINESS_PROFILE;
  }
}

function writeProfileToFile(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(data, null, 2), "utf-8");

    // Also synchronize businessName and address with ai-settings.json
    if (fs.existsSync(AI_SETTINGS_FILE) && (data.businessName || data.addressStreet)) {
      try {
        const rawAi = fs.readFileSync(AI_SETTINGS_FILE, "utf-8");
        const aiJson = JSON.parse(rawAi);
        if (data.businessName) {
          aiJson.businessName = data.businessName;
        }
        if (data.addressStreet || data.addressCity) {
          const street = data.addressStreet || "";
          const city = data.addressCity ? `, ${data.addressCity}` : "";
          aiJson.businessAddress = `${street}${city}`.trim();
        }

        // Re-compile greeting text with new profile name
        const prefix = aiJson.greeting?.welcomePrefix?.trim() || "Thank you for calling";
        const custom = aiJson.greeting?.customUserMessage?.trim() || "How may I assist you with your order, reservation, or appointment today?";
        const parts: string[] = [];
        if (aiJson.greeting?.includeBusinessName !== false && aiJson.businessName) {
          parts.push(`${prefix} ${aiJson.businessName}.`);
        } else {
          parts.push(`${prefix}.`);
        }
        if (aiJson.greeting?.includeAddress !== false && aiJson.businessAddress) {
          parts.push(`Located at ${aiJson.businessAddress}.`);
        }
        if (aiJson.greeting?.includeAiIdentity !== false) {
          parts.push("This is your AI receptionist.");
        }
        if (custom) parts.push(custom);

        if (!aiJson.greeting) aiJson.greeting = {};
        const compiledGreeting = parts.join(" ");
        aiJson.greeting.compiledGreeting = compiledGreeting;
        fs.writeFileSync(AI_SETTINGS_FILE, JSON.stringify(aiJson, null, 2), "utf-8");

        // Asynchronously update ElevenLabs cloud agent with new name & greeting
        const apiKey = process.env.ELEVENLABS_API_KEY || "";
        const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_2001m4ha09d9e88bn4c0vmjzh0rw";
        fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
          method: "PATCH",
          headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_config: {
              agent: {
                first_message: compiledGreeting,
                prompt: {
                  prompt: `You are an AI Restaurant Receptionist answering inbound phone calls for ${aiJson.businessName}, located at ${aiJson.businessAddress}.\nYour opening greeting is: "${compiledGreeting}".\nAlways identify yourself and the restaurant as "${aiJson.businessName}".`,
                },
              },
            },
          }),
        }).catch((err) => console.warn("Cloud agent background sync notice:", err));
      } catch (e) {
        console.warn("Failed to sync businessName to ai-settings.json:", e);
      }
    }

    return true;
  } catch (err) {
    console.error("Error writing business-profile.json:", err);
    return false;
  }
}

export async function GET() {
  const profile = readProfileFromFile();
  return NextResponse.json({ success: true, data: profile });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = readProfileFromFile() || DEFAULT_BUSINESS_PROFILE;
    const merged = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const written = writeProfileToFile(merged);
    if (!written) {
      return NextResponse.json(
        { success: false, error: "Failed to persist profile to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: merged });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
