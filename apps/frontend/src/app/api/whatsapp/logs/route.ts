import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LOGS_FILE = path.join(DATA_DIR, "whatsapp-logs.json");

export async function GET() {
  try {
    if (!fs.existsSync(LOGS_FILE)) {
      return NextResponse.json({ success: true, logs: [] });
    }
    const raw = fs.readFileSync(LOGS_FILE, "utf-8");
    const logs = JSON.parse(raw);
    return NextResponse.json({ success: true, logs: Array.isArray(logs) ? logs : [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const newLog = await req.json();

    let logs: any[] = [];
    if (fs.existsSync(LOGS_FILE)) {
      try {
        const raw = fs.readFileSync(LOGS_FILE, "utf-8");
        logs = JSON.parse(raw);
        if (!Array.isArray(logs)) logs = [];
      } catch {}
    }

    const logEntry = {
      id: newLog.id || `wa_log_${Date.now()}`,
      timestamp: newLog.timestamp || new Date().toISOString(),
      ...newLog,
    };

    logs.unshift(logEntry);
    if (logs.length > 50) logs = logs.slice(0, 50);

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");

    return NextResponse.json({ success: true, log: logEntry });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
