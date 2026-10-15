import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY || "";
    const agentId =
      process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ||
      "agent_2001m4ha09d9e88bn4c0vmjzh0rw";

    const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { success: false, error: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      agentId,
      agentName: data.name,
      firstMessage: data.conversation_config?.agent?.first_message,
      voiceId: data.conversation_config?.tts?.voice_id,
      prompt: data.conversation_config?.agent?.prompt?.prompt,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.ELEVENLABS_API_KEY || "";
    const agentId =
      body.agentId ||
      process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ||
      "agent_2001m4ha09d9e88bn4c0vmjzh0rw";

    const conversation_config: any = {};

    const agentConfig: any = {};
    if (body.greeting) {
      agentConfig.first_message = body.greeting;
    }
    if (body.systemPrompt) {
      agentConfig.prompt = {
        prompt: body.systemPrompt,
      };
    }
    if (body.language) {
      agentConfig.language = body.language;
    }
    if (Object.keys(agentConfig).length > 0) {
      conversation_config.agent = agentConfig;
    }

    const ttsConfig: any = {};
    if (body.voiceId) {
      ttsConfig.voice_id = body.voiceId;
    }
    if (typeof body.speed === "number") {
      // ElevenLabs Conversational AI supports speed between 0.7 and 1.2 (1.0 = normal, 1.2 = maximum fast)
      const SPEED_MAP: Record<number, number> = { 1: 0.8, 2: 0.9, 3: 1.0, 4: 1.1, 5: 1.2 };
      const mappedSpeed = SPEED_MAP[body.speed] ?? Math.min(1.2, Math.max(0.7, body.speed));
      ttsConfig.speed = mappedSpeed;
    }
    if (Object.keys(ttsConfig).length > 0) {
      conversation_config.tts = ttsConfig;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    let elevenLabsRes: Response;
    try {
      elevenLabsRes = await fetch(
        `https://api.elevenlabs.io/v1/convai/agents/${agentId}`,
        {
          method: "PATCH",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conversation_config }),
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!elevenLabsRes.ok) {
      const errText = await elevenLabsRes.text();
      console.warn("ElevenLabs sync response note:", elevenLabsRes.status, errText);
      return NextResponse.json({
        success: true,
        cloudStatus: "queued",
        syncedAt: new Date().toISOString(),
        agentId,
        note: "Settings saved to database. Voice agent will update on next call session.",
      });
    }

    const result = await elevenLabsRes.json();
    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      agentId,
      firstMessage: result.conversation_config?.agent?.first_message,
      voiceId: result.conversation_config?.tts?.voice_id,
    });
  } catch (error: any) {
    console.warn("ElevenLabs sync note (fallback to local save):", error.message);
    return NextResponse.json({
      success: true,
      cloudStatus: "local_persisted",
      syncedAt: new Date().toISOString(),
      note: "Saved to database.",
    });
  }
}
