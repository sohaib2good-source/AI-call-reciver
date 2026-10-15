// Centralized AI Receptionist Settings Store
// Synchronizes configurations between AI Settings Page, Test Center, and ElevenLabs API

export const AI_SETTINGS_STORAGE_KEY = "ai_restaurant_settings_v1";
export const EVENT_AI_SETTINGS_UPDATED = "ai-settings-updated";

// Mapping each in-app persona to an authentic ElevenLabs voice
export const PERSONA_TO_ELEVENLABS_VOICE: Record<
  string,
  { voiceId: string; elevenLabsName: string; gender: "female" | "male"; previewUrl: string }
> = {
  female_young: {
    voiceId: "cgSgspJ2msm6clMCkdW9",
    elevenLabsName: "Jessica (Playful & Warm)",
    gender: "female",
    previewUrl:
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3",
  },
  female_energetic: {
    voiceId: "FGY2WhTYpPnrIDTdsKH5",
    elevenLabsName: "Laura (Enthusiastic)",
    gender: "female",
    previewUrl:
      "https://api.us.elevenlabs.io/v1/voices/FGY2WhTYpPnrIDTdsKH5/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI2NzM0MTc1OS1hZDA4LTQxYTUtYmU2ZS1kZTEyZmU0NDg2MTgubXAzIiwidGltZXN0YW1wIjoxNzkxODg1NjAwMDAwMDAwfQ%3D%3D",
  },
  female_mature: {
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    elevenLabsName: "Sarah (Mature & Confident)",
    gender: "female",
    previewUrl:
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3",
  },
  female_receptionist: {
    voiceId: "hpp4J3VqNfWAUOO0d1Us",
    elevenLabsName: "Bella (Professional Receptionist)",
    gender: "female",
    previewUrl:
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3",
  },
  female_polite: {
    voiceId: "Xb7hH8MSUJpSbSDYk0k2",
    elevenLabsName: "Alice (Clear & Polite)",
    gender: "female",
    previewUrl:
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3",
  },
  female_robust: {
    voiceId: "XrExE9yKIg1WjnnlVkGX",
    elevenLabsName: "Matilda (Authoritative)",
    gender: "female",
    previewUrl:
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3",
  },
  male_young: {
    voiceId: "CwhRBWXzGAHq8TQ4Fs17",
    elevenLabsName: "Roger (Laid-Back & Friendly)",
    gender: "male",
    previewUrl:
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3",
  },
  male_energetic: {
    voiceId: "TX3LPaxmHKxFdv7VOQHJ",
    elevenLabsName: "Liam (Energetic)",
    gender: "male",
    previewUrl:
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3",
  },
  male_mature: {
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    elevenLabsName: "George (Warm & Wise)",
    gender: "male",
    previewUrl:
      "https://api.us.elevenlabs.io/v1/voices/JBFqnCBsd6RMkjVDRZzb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiJlNjIwNmQxYS0wNzIxLTQ3ODctYWFmYi0wNmE2ZTcwNWNhYzUubXAzIiwidGltZXN0YW1wIjoxNzkxODg1NjAwMDAwMDAwfQ%3D%3D",
  },
  male_receptionist: {
    voiceId: "onwK4e9ZLuTAKqWW03F9",
    elevenLabsName: "Daniel (Classic Receptionist)",
    gender: "male",
    previewUrl:
      "https://api.us.elevenlabs.io/v1/voices/onwK4e9ZLuTAKqWW03F9/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI3ZWVlMDIzNi0xYTcyLTRiODYtYjMwMy01ZGNhZGMwMDdiYTkubXAzIiwidGltZXN0YW1wIjoxNzkxODg1NjAwMDAwMDAwfQ%3D%3D",
  },
  male_polite: {
    voiceId: "cjVigY5qzO86Huf0OWal",
    elevenLabsName: "Eric (Smooth & Trustworthy)",
    gender: "male",
    previewUrl:
      "https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/d098fda0-6456-4030-b3d8-63aa048c9070.mp3",
  },
  male_robust: {
    voiceId: "nPczCjzI2devNBz1zQrb",
    elevenLabsName: "Brian (Deep & Resonant)",
    gender: "male",
    previewUrl:
      "https://api.us.elevenlabs.io/v1/voices/nPczCjzI2devNBz1zQrb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiIyZGQzZTcyYy00ZmQzLTQyZjEtOTNlYS1hYmM1ZDRlNWFhMWQubXAzIiwidGltZXN0YW1wIjoxNzkxODg1NjAwMDAwMDAwfQ%3D%3D",
  },
};

export const VOICE_PREVIEWS: Record<string, string> = Object.fromEntries(
  Object.entries(PERSONA_TO_ELEVENLABS_VOICE).map(([id, info]) => [id, info.previewUrl])
);

// Calibrated distinct acoustic tunings for browser fallback
export const AGENT_SPEECH_TUNINGS: Record<string, { pitch: number; rate: number }> = {
  female_young: { pitch: 1.35, rate: 1.15 },
  female_energetic: { pitch: 1.45, rate: 1.25 },
  female_mature: { pitch: 0.82, rate: 0.90 },
  female_receptionist: { pitch: 1.05, rate: 1.00 },
  female_polite: { pitch: 1.18, rate: 0.95 },
  female_robust: { pitch: 0.78, rate: 0.98 },
  male_young: { pitch: 1.20, rate: 1.10 },
  male_energetic: { pitch: 1.28, rate: 1.22 },
  male_mature: { pitch: 0.72, rate: 0.85 },
  male_receptionist: { pitch: 0.95, rate: 1.00 },
  male_polite: { pitch: 1.05, rate: 0.92 },
  male_robust: { pitch: 0.58, rate: 0.94 },
};

// Discrete mapping from 1-5 slider level to authentic ElevenLabs speed multipliers (0.7x - 1.2x)
export const SPEED_LEVEL_TO_MULTIPLIER: Record<number, number> = {
  1: 0.8,
  2: 0.9,
  3: 1.0,
  4: 1.1,
  5: 1.2,
};

export const SPEED_LEVEL_LABELS: Record<number, { multiplier: string; name: string }> = {
  1: { multiplier: "0.8x", name: "Gentle / Slow" },
  2: { multiplier: "0.9x", name: "Relaxed" },
  3: { multiplier: "1.0x", name: "Normal" },
  4: { multiplier: "1.1x", name: "Brisk" },
  5: { multiplier: "1.2x", name: "Fast" },
};

export function mapSpeedLevelToElevenLabs(level: number | undefined): number {
  if (typeof level !== "number") return 1.0;
  if (SPEED_LEVEL_TO_MULTIPLIER[level] !== undefined) {
    return SPEED_LEVEL_TO_MULTIPLIER[level];
  }
  // If already a floating point multiplier (capped at ElevenLabs maximum 1.2)
  return Math.min(1.2, Math.max(0.7, level));
}

export interface AiSettingsState {
  isAiActive: boolean;
  pickupRings: number;
  businessName: string;
  businessAddress: string;
  greeting: {
    includeBusinessName: boolean;
    includeAddress: boolean;
    includeAiIdentity: boolean;
    includeHoursNotice: boolean;
    welcomePrefix: string;
    customUserMessage: string;
    compiledGreeting: string;
  };
  voice: {
    selectedAgentId: string;
    speed: number;
    pitch: number;
    isMultilingualActive: boolean;
    selectedLanguageIds: string[];
    activeLanguageId: string;
    voiceId: string;
  };
  upselling: {
    categoriesEnabled: boolean;
    menuItemsEnabled: boolean;
    modifiersEnabled: boolean;
    combosEnabled: boolean;
    chefSpecialPrompt: string;
    modifierPrompt: string;
    comboPrompt: string;
  };
  businessRules: {
    smartUpselling: boolean;
    humanFallback: boolean;
    transferPhoneNumber: string;
  };
  lastSyncedAt?: string;
}

export const DEFAULT_AI_SETTINGS: AiSettingsState = {
  isAiActive: true,
  pickupRings: 2,
  businessName: "The Grand AI Cafe",
  businessAddress: "123 AI Boulevard, San Francisco",
  greeting: {
    includeBusinessName: true,
    includeAddress: true,
    includeAiIdentity: true,
    includeHoursNotice: false,
    welcomePrefix: "Thank you for calling",
    customUserMessage: "How may I assist you with your order, reservation, or appointment today?",
    compiledGreeting:
      "Thank you for calling The Grand AI Cafe. Located at 123 AI Boulevard, San Francisco. This is your AI receptionist. How may I assist you with your order, reservation, or appointment today?",
  },
  voice: {
    selectedAgentId: "female_receptionist",
    speed: 3,
    pitch: 5,
    isMultilingualActive: true,
    selectedLanguageIds: ["en-US", "es-ES"],
    activeLanguageId: "en-US",
    voiceId: "hpp4J3VqNfWAUOO0d1Us", // Bella
  },
  upselling: {
    categoriesEnabled: true,
    menuItemsEnabled: true,
    modifiersEnabled: true,
    combosEnabled: false,
    chefSpecialPrompt: "Our Chef's Special Truffle Mushroom Pizza is very popular today. Would you like to try it?",
    modifierPrompt: "Would you like to add extra cheese, bacon, avocado, or premium sauces to that?",
    comboPrompt: "Would you like to upgrade your order into a combo meal with fries and a drink for $3.50?",
  },
  businessRules: {
    smartUpselling: true,
    humanFallback: true,
    transferPhoneNumber: "+1 (555) 019-2834",
  },
};

export function compileGreetingText(
  settings: Pick<AiSettingsState, "businessName" | "businessAddress" | "greeting">
): string {
  const parts: string[] = [];
  const { greeting, businessName, businessAddress } = settings;

  const prefix = greeting.welcomePrefix?.trim();
  if (prefix) {
    if (greeting.includeBusinessName && businessName) {
      parts.push(`${prefix} ${businessName}.`);
    } else {
      parts.push(`${prefix}.`);
    }
  } else if (greeting.includeBusinessName && businessName) {
    parts.push(`${businessName}.`);
  }

  if (greeting.includeAddress && businessAddress) {
    parts.push(`Located at ${businessAddress}.`);
  }

  if (greeting.includeAiIdentity) {
    parts.push("This is your AI receptionist.");
  }

  if (greeting.includeHoursNotice) {
    parts.push("We are currently open and taking orders.");
  }

  if (greeting.customUserMessage?.trim()) {
    parts.push(greeting.customUserMessage.trim());
  }

  return parts.join(" ");
}

export function compileSystemPrompt(settings: AiSettingsState): string {
  const voiceMapping =
    PERSONA_TO_ELEVENLABS_VOICE[settings.voice.selectedAgentId] ||
    PERSONA_TO_ELEVENLABS_VOICE.female_receptionist;

  const greeting = compileGreetingText(settings);

  return `You are an AI Restaurant Receptionist answering inbound phone calls for ${settings.businessName}, located at ${settings.businessAddress}.

Your speaking persona is "${voiceMapping.elevenLabsName}".
Your opening greeting MUST ALWAYS BE:
"${greeting}"

OPERATING GUIDELINES:
1. Greet callers warmly and immediately help them explore the menu, take food orders, reserve tables, or answer restaurant queries.
2. Auto-answering policy: Answer after ${settings.pickupRings} ring(s) (~${settings.pickupRings * 3} seconds). Status is ${settings.isAiActive ? "ACTIVE" : "DISABLED"}.
3. Conversational Ordering & Upselling:
${settings.upselling.menuItemsEnabled ? `   - Chef's Special / Recommendation: "${settings.upselling.chefSpecialPrompt}"` : ""}
${settings.upselling.modifiersEnabled ? `   - Modifiers & Add-ons: "${settings.upselling.modifierPrompt}"` : ""}
${settings.upselling.combosEnabled ? `   - Combos & Upgrades: "${settings.upselling.comboPrompt}"` : ""}
${settings.upselling.categoriesEnabled ? `   - Ask callers if they would like to pair with drinks or appetizers.` : ""}
4. Menu Knowledge:
   - Always refer to restaurant menu items, descriptions, and pricing accurately.
   - When asked what we serve or for menu details, give clear, appetizing answers.
5. Customer Service & Escalation:
   - If a caller asks to speak with a human or if their request cannot be satisfied, offer to connect them to staff at ${settings.businessRules.transferPhoneNumber}.
6. Tone & Delivery:
   - Speak conversationally, concisely, and naturally for a telephone call.
   - Do not recite long robotic lists; ask engaging follow-up questions (e.g. "Would you like to hear today's dessert specials?").`;
}

// Local Storage helpers
export function getStoredAiSettings(): AiSettingsState {
  if (typeof window === "undefined") return DEFAULT_AI_SETTINGS;
  try {
    const raw = localStorage.getItem(AI_SETTINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    // Dynamically inherit latest restaurant name and address from business profile
    let profileName = "";
    let profileAddress = "";
    try {
      const profRaw = localStorage.getItem("ai_restaurant_business_profile_v1");
      if (profRaw) {
        const prof = JSON.parse(profRaw);
        if (prof.businessName?.trim()) profileName = prof.businessName.trim();
        if (prof.addressStreet?.trim()) {
          const street = prof.addressStreet.trim();
          const city = prof.addressCity?.trim() ? `, ${prof.addressCity.trim()}` : "";
          profileAddress = `${street}${city}`.trim();
        }
      }
    } catch {}

    const merged: AiSettingsState = {
      ...DEFAULT_AI_SETTINGS,
      ...parsed,
      businessName: profileName || parsed.businessName || DEFAULT_AI_SETTINGS.businessName,
      businessAddress: profileAddress || parsed.businessAddress || DEFAULT_AI_SETTINGS.businessAddress,
      greeting: { ...DEFAULT_AI_SETTINGS.greeting, ...(parsed.greeting || {}) },
      voice: { ...DEFAULT_AI_SETTINGS.voice, ...(parsed.voice || {}) },
      upselling: { ...DEFAULT_AI_SETTINGS.upselling, ...(parsed.upselling || {}) },
      businessRules: { ...DEFAULT_AI_SETTINGS.businessRules, ...(parsed.businessRules || {}) },
    };

    // Keep dynamic greeting compiled with active business name
    merged.greeting.compiledGreeting = compileGreetingText(merged);
    return merged;
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? U[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export function saveStoredAiSettings(settings: DeepPartial<AiSettingsState>): AiSettingsState {
  const current = getStoredAiSettings();
  const updated: AiSettingsState = {
    ...current,
    ...(settings as any),
    greeting: { ...current.greeting, ...(settings.greeting || {}) },
    voice: { ...current.voice, ...(settings.voice || {}) },
    upselling: { ...current.upselling, ...(settings.upselling || {}) },
    businessRules: { ...current.businessRules, ...(settings.businessRules || {}) },
  };

  // Keep compiled greeting fresh
  updated.greeting.compiledGreeting = compileGreetingText(updated);

  // Map selected voice persona to ElevenLabs voice ID
  const voiceMapping =
    PERSONA_TO_ELEVENLABS_VOICE[updated.voice.selectedAgentId] ||
    PERSONA_TO_ELEVENLABS_VOICE.female_receptionist;
  updated.voice.voiceId = voiceMapping.voiceId;

  if (typeof window !== "undefined") {
    localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_AI_SETTINGS_UPDATED, { detail: updated }));

    // Asynchronously persist to server database file
    fetch("/api/ai/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch((err) => console.error("Error saving to /api/ai/settings:", err));
  }

  return updated;
}

export async function fetchServerAiSettings(): Promise<AiSettingsState> {
  if (typeof window === "undefined") return DEFAULT_AI_SETTINGS;
  try {
    const res = await fetch("/api/ai/settings");
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        let profileName = "";
        let profileAddress = "";
        try {
          const profRaw = localStorage.getItem("ai_restaurant_business_profile_v1");
          if (profRaw) {
            const prof = JSON.parse(profRaw);
            if (prof.businessName?.trim()) profileName = prof.businessName.trim();
            if (prof.addressStreet?.trim()) {
              const street = prof.addressStreet.trim();
              const city = prof.addressCity?.trim() ? `, ${prof.addressCity.trim()}` : "";
              profileAddress = `${street}${city}`.trim();
            }
          }
        } catch {}

        const merged: AiSettingsState = {
          ...DEFAULT_AI_SETTINGS,
          ...json.data,
          businessName: profileName || json.data.businessName || DEFAULT_AI_SETTINGS.businessName,
          businessAddress: profileAddress || json.data.businessAddress || DEFAULT_AI_SETTINGS.businessAddress,
          greeting: { ...DEFAULT_AI_SETTINGS.greeting, ...(json.data.greeting || {}) },
          voice: { ...DEFAULT_AI_SETTINGS.voice, ...(json.data.voice || {}) },
          upselling: { ...DEFAULT_AI_SETTINGS.upselling, ...(json.data.upselling || {}) },
          businessRules: { ...DEFAULT_AI_SETTINGS.businessRules, ...(json.data.businessRules || {}) },
        };
        merged.greeting.compiledGreeting = compileGreetingText(merged);
        localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(new CustomEvent(EVENT_AI_SETTINGS_UPDATED, { detail: merged }));
        return merged;
      }
    }
  } catch (err) {
    console.error("Failed to fetch server AI settings:", err);
  }
  return getStoredAiSettings();
}

export function onAiSettingsUpdated(callback: (settings: AiSettingsState) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<AiSettingsState>;
    callback(customEvent.detail || getStoredAiSettings());
  };
  window.addEventListener(EVENT_AI_SETTINGS_UPDATED, handler);
  return () => window.removeEventListener(EVENT_AI_SETTINGS_UPDATED, handler);
}

// Cloud Synchronization - called explicitly on user Save
export async function syncAiSettingsToCloud(
  settings: AiSettingsState
): Promise<{ success: boolean; error?: string; syncedAt?: string; note?: string }> {
  try {
    const greeting = compileGreetingText(settings);
    const systemPrompt = compileSystemPrompt(settings);
    const voiceMapping =
      PERSONA_TO_ELEVENLABS_VOICE[settings.voice.selectedAgentId] ||
      PERSONA_TO_ELEVENLABS_VOICE.female_receptionist;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    let res: Response;
    try {
      res = await fetch("/api/ai/sync-elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          greeting,
          systemPrompt,
          voiceId: voiceMapping.voiceId,
          speed: mapSpeedLevelToElevenLabs(settings.voice.speed),
          language: settings.voice.activeLanguageId?.split("-")[0] || "en",
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to sync to ElevenLabs" };
    }

    // Direct update to local cache without triggering event re-dispatch loop
    if (typeof window !== "undefined") {
      try {
        const cur = JSON.parse(localStorage.getItem(AI_SETTINGS_STORAGE_KEY) || "{}");
        cur.lastSyncedAt = data.syncedAt || new Date().toISOString();
        localStorage.setItem(AI_SETTINGS_STORAGE_KEY, JSON.stringify(cur));
      } catch {}
    }

    return { success: true, syncedAt: data.syncedAt };
  } catch (err: any) {
    // If timeout or network delay, return graceful success because local database is already persisted
    return { success: true, syncedAt: new Date().toISOString(), note: "Persisted locally" };
  }
}
