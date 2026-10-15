import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_FILE = path.join(DATA_DIR, "ai-settings.json");

function readSettingsFromFile() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading ai-settings.json:", err);
    return null;
  }
}

function writeSettingsToFile(data: any) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing ai-settings.json:", err);
    return false;
  }
}

export async function GET() {
  const settings = readSettingsFromFile();
  if (!settings) {
    return NextResponse.json({ success: true, data: null });
  }
  return NextResponse.json({ success: true, data: settings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = readSettingsFromFile() || {};
    const merged = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    const written = writeSettingsToFile(merged);
    if (!written) {
      return NextResponse.json(
        { success: false, error: "Failed to persist to file database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: merged });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
