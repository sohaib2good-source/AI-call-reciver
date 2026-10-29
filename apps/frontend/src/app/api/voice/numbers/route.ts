import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const NUMBERS_FILE = path.join(DATA_DIR, "phone-numbers.json");

interface PhoneNumberRecord {
  id: string;
  number: string;
  friendlyName: string;
  provider: "TWILIO" | "VAPI" | "RETELL" | "WHATSAPP";
  capabilities: string[];
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  webhookUrl: string;
  assignedRestaurant: string;
  forwardNumber?: string;
}

const BASE_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aireceiver.vortexlabsworld.com";

const DEFAULT_NUMBERS: PhoneNumberRecord[] = [
  {
    id: "num_twilio_1",
    number: "+1 (555) 123-4567",
    friendlyName: "Main Inbound Reception Line (Twilio + ElevenLabs Voice Agent)",
    provider: "TWILIO",
    capabilities: ["VOICE", "SMS"],
    status: "ACTIVE",
    webhookUrl: `${BASE_APP_URL}/api/voice/twilio/incoming`,
    assignedRestaurant: "biryani master link road",
    forwardNumber: "+1 (555) 000-1111",
  },
  {
    id: "num_wa_1",
    number: "+92 334 9779285",
    friendlyName: "Biryani Master WhatsApp Line (+92 334 9779285)",
    provider: "WHATSAPP",
    capabilities: ["VOICE", "TEXT", "VOICE_NOTES", "CALLS"],
    status: "ACTIVE",
    webhookUrl: `${BASE_APP_URL}/api/whatsapp/webhook`,
    assignedRestaurant: "biryani master link road",
  },
];

function readNumbers(): PhoneNumberRecord[] {
  try {
    if (fs.existsSync(NUMBERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(NUMBERS_FILE, "utf-8"));
      if (Array.isArray(data) && data.length > 0) {
        // Dynamically replace any stale trycloudflare URLs with active domain
        return data.map((item: PhoneNumberRecord) => ({
          ...item,
          webhookUrl: item.webhookUrl?.includes("trycloudflare.com")
            ? item.webhookUrl.replace(/https:\/\/[^/]+/, BASE_APP_URL)
            : item.webhookUrl,
        }));
      }
    }
  } catch (e) {
    console.warn("Error reading phone numbers:", e);
  }
  return DEFAULT_NUMBERS;
}

function saveNumbers(numbers: PhoneNumberRecord[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(NUMBERS_FILE, JSON.stringify(numbers, null, 2), "utf-8");
}

export async function GET() {
  const numbers = readNumbers();
  return NextResponse.json({ success: true, numbers });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, numberData } = body;

    let current = readNumbers();

    if (action === "update" && numberData?.id) {
      current = current.map((item) =>
        item.id === numberData.id ? { ...item, ...numberData } : item
      );
    } else if (action === "add" && numberData) {
      const newRecord: PhoneNumberRecord = {
        id: `num_${Date.now()}`,
        number: numberData.number || "+1 (555) 000-0000",
        friendlyName: numberData.friendlyName || "New Inbound Line",
        provider: numberData.provider || "TWILIO",
        capabilities: numberData.capabilities || ["VOICE"],
        status: numberData.status || "ACTIVE",
        webhookUrl: numberData.webhookUrl || "/webhook/voice/twilio/incoming",
        assignedRestaurant: numberData.assignedRestaurant || "biryani master link road",
        forwardNumber: numberData.forwardNumber || "",
      };
      current.push(newRecord);
    } else if (action === "delete" && numberData?.id) {
      current = current.filter((item) => item.id !== numberData.id);
    } else if (Array.isArray(body.numbers)) {
      current = body.numbers;
    }

    saveNumbers(current);
    return NextResponse.json({ success: true, numbers: current });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
