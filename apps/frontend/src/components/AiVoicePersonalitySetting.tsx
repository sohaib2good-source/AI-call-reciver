"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Mic,
  Volume2,
  Sliders,
  Sparkles,
  Play,
  Square,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Globe,
  Gauge,
  Music2,
  Radio,
  HeartHandshake,
  Smile,
  Headset,
  Sun,
  Shield,
  Crown,
  Coffee,
  Flame,
  Search,
  Star,
  Plus,
  X,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { FAMOUS_100_LANGUAGES, LanguageItem } from "@/constants/famousLanguages";

export type VoiceGender = "female" | "male";

export interface PersonaOption {
  id: string;
  name: string;
  badge: string;
  icon: any;
  tone: string;
  description: string;
  sampleQuote: string;
  tags: string[];
}

export const CHARACTER_PERSONAS: PersonaOption[] = [
  {
    id: "polite",
    name: "Polite & Courteous",
    badge: "Most Popular",
    icon: HeartHandshake,
    tone: "Courteous & Gracious",
    description: "Highly respectful, attentive, and gracious. Always includes pleasantries and polite confirmations.",
    sampleQuote: "Thank you for calling AI Restaurant. It is our pleasure to assist you with your table reservation today.",
    tags: ["Fine Dining", "Hospitality"],
  },
  {
    id: "humble",
    name: "Humble & Gentle",
    badge: "Warm",
    icon: Smile,
    tone: "Gentle & Modest",
    description: "Soft-spoken, modest, and comforting. Creates a cozy, unpretentious, and family-friendly atmosphere.",
    sampleQuote: "Hello and warm welcome! We are so glad you reached out to us. How may we take good care of you?",
    tags: ["Family Bistro", "Cozy"],
  },
  {
    id: "receptionist",
    name: "Classic Receptionist",
    badge: "Recommended",
    icon: Headset,
    tone: "Professional & Organized",
    description: "Crisp, efficient, and direct. Swiftly gathers guest counts, reservation times, and takeaway orders.",
    sampleQuote: "AI Restaurant front desk. I can book your table or process your takeout order immediately.",
    tags: ["High Volume", "Efficiency"],
  },
  {
    id: "cheerful",
    name: "Cheerful & Energetic",
    badge: "Upbeat",
    icon: Sun,
    tone: "Enthusiastic & Vibrant",
    description: "Bright, energetic, and welcoming. Infuses every interaction with positivity and excitement.",
    sampleQuote: "Hey there! Happy to hear from you today! What delicious dishes can we get prepared for you?",
    tags: ["Brunch Spot", "Cafe"],
  },
  {
    id: "calm",
    name: "Calm & Soothing",
    badge: "Relaxing",
    icon: Coffee,
    tone: "Patient & Relaxing",
    description: "Unrushed, serene, and patient. Great at soothing stressed callers and carefully taking complex dietary requests.",
    sampleQuote: "Good evening. Please take all the time you need, and I will gladly guide you through our menu.",
    tags: ["Lounge", "Dinner Rush"],
  },
  {
    id: "formal",
    name: "Formal & Elegant",
    badge: "Luxury",
    icon: Crown,
    tone: "Sophisticated & Prestigious",
    description: "Distinguished vocabulary, refined cadence, and elevated manners designed for upscale establishments.",
    sampleQuote: "Good day. Welcome to the reservation concierge. May I arrange an exceptional table for your party?",
    tags: ["Michelin Star", "Steakhouse"],
  },
  {
    id: "casual",
    name: "Casual & Friendly",
    badge: "Approachable",
    icon: Shield,
    tone: "Conversational & Natural",
    description: "Down-to-earth and relatable, like speaking with your favorite friendly neighborhood server.",
    sampleQuote: "Hi! Thanks for calling in. Looking to grab a table or order some delicious food tonight?",
    tags: ["Neighborhood", "Pub & Grill"],
  },
  {
    id: "upseller",
    name: "Persuasive & Appetizing",
    badge: "Sales Focused",
    icon: Flame,
    tone: "Appetizing & Descriptive",
    description: "Lively culinary enthusiast who vividly describes chef specials, wine pairings, and signature desserts.",
    sampleQuote: "Welcome! Our chef prepared a stunning truffle ribeye special tonight. Let's get your table secured!",
    tags: ["Upselling", "Specials"],
  },
];

export const SPEED_LEVELS = [
  { level: 1, label: "0.8x", name: "Gentle / Slow", desc: "For elderly guests or noisy environments" },
  { level: 2, label: "0.9x", name: "Relaxed", desc: "Slightly deliberate and clear" },
  { level: 3, label: "1.0x", name: "Normal", badge: "Recommended", desc: "Standard conversational flow" },
  { level: 4, label: "1.15x", name: "Brisk", desc: "Quick and active for rush hours" },
  { level: 5, label: "1.3x", name: "Fast", desc: "Rapid intake for quick takeaway callers" },
];

export const PITCH_DESCRIPTIONS: { [key: number]: { label: string; desc: string } } = {
  1: { label: "Ultra Thin & High Treble", desc: "Very light, high register" },
  2: { label: "Thin & Bright", desc: "Crisp, airy top-end" },
  3: { label: "Light Conversational", desc: "Clear, higher-mid presence" },
  4: { label: "Mild & Balanced", desc: "Slightly above neutral" },
  5: { label: "Natural Mid-Tone", desc: "Standard balanced acoustic pitch" },
  6: { label: "Warm & Resonant", desc: "Full-bodied with slight warmth" },
  7: { label: "Rich & Grounded", desc: "Lower-mid register, authoritative" },
  8: { label: "Deep & Solid", desc: "Substantial low-end depth" },
  9: { label: "Very Deep", desc: "Bass-dominant and commanding" },
  10: { label: "Heavy & Baritone Bass", desc: "Maximum heavy, deep acoustic timbre" },
};

interface AiVoicePersonalitySettingProps {
  initialGender?: VoiceGender;
  initialSpeed?: number;
  initialPitch?: number;
  initialPersonaId?: string;
  onChange?: (config: any) => void;
}

export function AiVoicePersonalitySetting({
  initialGender = "female",
  initialSpeed = 3,
  initialPitch = 5,
  initialPersonaId = "receptionist",
  onChange,
}: AiVoicePersonalitySettingProps) {
  const [gender, setGender] = useState<VoiceGender>(initialGender);
  const [speed, setSpeed] = useState<number>(initialSpeed);
  const [pitch, setPitch] = useState<number>(initialPitch);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(initialPersonaId);

  // Multilingual State: 100 Famous Languages & Active Selection
  const [isMultilingualActive, setIsMultilingualActive] = useState<boolean>(true);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<string[]>([
    "en-US",
    "es-ES",
  ]);
  const [activeLanguageId, setActiveLanguageId] = useState<string>("en-US");

  // Language Picker / Drawer state
  const [showLanguagePicker, setShowLanguagePicker] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(false);

  const currentPersona =
    CHARACTER_PERSONAS.find((p) => p.id === selectedPersonaId) || CHARACTER_PERSONAS[2];

  // Resolve selected language objects from 100 languages pool
  const selectedLanguages = useMemo(() => {
    return selectedLanguageIds
      .map((id) => FAMOUS_100_LANGUAGES.find((l) => l.id === id))
      .filter((l): l is LanguageItem => Boolean(l));
  }, [selectedLanguageIds]);

  const activeLanguage = useMemo(() => {
    return (
      FAMOUS_100_LANGUAGES.find((l) => l.id === activeLanguageId) ||
      selectedLanguages[0] ||
      FAMOUS_100_LANGUAGES[0]
    );
  }, [activeLanguageId, selectedLanguages]);

  // Filter 100 famous languages by search query and region
  const filteredLanguages = useMemo(() => {
    return FAMOUS_100_LANGUAGES.filter((item) => {
      // Region filter
      if (selectedRegion === "POPULAR") {
        if (!item.popularRank) return false;
      } else if (selectedRegion !== "ALL" && item.region !== selectedRegion) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(query) ||
        item.nativeName.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.region.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, selectedRegion]);

  // Build JSON configuration
  const buildConfig = () => ({
    voice_gender: gender,
    voice_speed: {
      level: speed,
      playback_rate: 0.7 + speed * 0.1,
      name: SPEED_LEVELS.find((s) => s.level === speed)?.name,
    },
    voice_pitch: {
      level: pitch,
      acoustic_timbre: pitch <= 3 ? "THIN" : pitch >= 8 ? "HEAVY" : "BALANCED",
      description: PITCH_DESCRIPTIONS[pitch]?.label,
      multiplier: 0.5 + pitch * 0.1,
    },
    character_persona: {
      id: currentPersona.id,
      name: currentPersona.name,
      tone: currentPersona.tone,
      sample_greeting: currentPersona.sampleQuote,
    },
    multilingual: {
      is_active: isMultilingualActive,
      active_primary_language: {
        id: activeLanguage.id,
        code: activeLanguage.code,
        name: activeLanguage.name,
        native_name: activeLanguage.nativeName,
        flag: activeLanguage.flag,
      },
      selected_languages_count: selectedLanguages.length,
      selected_languages: selectedLanguages.map((l) => ({
        id: l.id,
        code: l.code,
        name: l.name,
        native_name: l.nativeName,
        flag: l.flag,
        is_active_primary: l.id === activeLanguage.id,
      })),
    },
    supported_languages: selectedLanguages.map((l) => l.name),
  });

  // Notify parent on changes
  useEffect(() => {
    onChange?.(buildConfig());
  }, [gender, speed, pitch, selectedPersonaId, selectedLanguageIds, activeLanguageId, isMultilingualActive]);

  // Handle adding a language
  const handleAddLanguage = (lang: LanguageItem, makeActive: boolean = false) => {
    if (!selectedLanguageIds.includes(lang.id)) {
      const nextIds = [...selectedLanguageIds, lang.id];
      setSelectedLanguageIds(nextIds);
      if (makeActive) {
        setActiveLanguageId(lang.id);
      }
    } else if (makeActive) {
      setActiveLanguageId(lang.id);
    }
  };

  // Handle removing a language
  const handleRemoveLanguage = (langIdToRemove: string) => {
    if (selectedLanguageIds.length <= 1) {
      alert("At least one language must remain selected.");
      return;
    }
    const nextIds = selectedLanguageIds.filter((id) => id !== langIdToRemove);
    setSelectedLanguageIds(nextIds);
    if (activeLanguageId === langIdToRemove) {
      setActiveLanguageId(nextIds[0]);
    }
  };

  // Set active primary language
  const handleSetActiveLanguage = (langId: string) => {
    setActiveLanguageId(langId);
    if (!selectedLanguageIds.includes(langId)) {
      setSelectedLanguageIds([...selectedLanguageIds, langId]);
    }
  };

  // Browser Text-To-Speech Preview
  const handlePlayPreview = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentPersona.sampleQuote);
    utterance.rate = 0.7 + speed * 0.1;
    utterance.pitch = 0.5 + pitch * 0.1;

    // Set utterance language code if possible
    if (activeLanguage?.code) {
      utterance.lang = activeLanguage.code;
    }

    // Pick matching voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find((v) => {
        const nameLower = v.name.toLowerCase();
        const matchesGender =
          gender === "female"
            ? nameLower.includes("female") ||
              nameLower.includes("zira") ||
              nameLower.includes("samantha") ||
              nameLower.includes("victoria") ||
              nameLower.includes("karen")
            : nameLower.includes("male") ||
              nameLower.includes("david") ||
              nameLower.includes("george") ||
              nameLower.includes("daniel") ||
              nameLower.includes("alex");
        return matchesGender;
      });
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(buildConfig(), null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
            <Mic size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                Step 4
              </span>
              <h2 className="text-lg font-bold text-gray-900">
                Voice &amp; Personality Engine
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Voice Assistant Persona
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure gender, speed cadence, acoustic pitch, 8 hospitality personas, and 100 world languages with active primary selection.
            </p>
          </div>
        </div>

        {/* Live Audio Preview Trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlayPreview}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition shadow-sm ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Square size={16} className="fill-current" />
                <span>Stop Preview</span>
              </>
            ) : (
              <>
                <Play size={16} className="fill-current" />
                <span>Test Voice Sample</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-8">
        {/* ======================================================== */}
        {/* 1. GENDER TABS & RADIO BUTTONS                           */}
        {/* ======================================================== */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-blue-600" />
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                1. Voice Gender Selection
              </label>
            </div>
            <span className="text-xs text-gray-500">Select preferred vocal identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Female Tab / Radio */}
            <label
              onClick={() => setGender("female")}
              className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                gender === "female"
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <input
                  type="radio"
                  name="voice_gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-base shadow-inner">
                  👩
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    Female Voice
                    {gender === "female" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Warm, melodic, and empathetic conversational tone
                  </p>
                </div>
              </div>
            </label>

            {/* Male Tab / Radio */}
            <label
              onClick={() => setGender("male")}
              className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                gender === "male"
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <input
                  type="radio"
                  name="voice_gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base shadow-inner">
                  👨
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    Male Voice
                    {gender === "male" && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Clear, grounded, and authoritative welcoming presence
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. VOICE SPEED (SELECTABLE SPEED 1 TO 5)                */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-blue-600" />
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                2. Voice Speed (Cadence 1 to 5)
              </label>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              Selected: Speed Level {speed} ({SPEED_LEVELS.find((s) => s.level === speed)?.label} -{" "}
              {SPEED_LEVELS.find((s) => s.level === speed)?.name})
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {SPEED_LEVELS.map((s) => {
              const isSelected = speed === s.level;
              return (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSpeed(s.level)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white shadow-md ring-2 ring-blue-300 ring-offset-1"
                      : "border-gray-200 bg-gray-50/60 hover:bg-gray-100 hover:border-gray-300 text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      Speed {s.level}
                    </span>
                    <span className="text-xs font-semibold">{s.label}</span>
                  </div>
                  <div className={`mt-2 font-bold text-sm ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {s.name}
                  </div>
                  <p
                    className={`text-[11px] mt-1 leading-tight line-clamp-2 ${
                      isSelected ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {s.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Range Slider Track */}
          <div className="mt-4 px-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1 font-medium">
              <span>1 (Very Slow 0.8x)</span>
              <span>2 (Relaxed 0.9x)</span>
              <span className="text-blue-600 font-bold">3 (Normal 1.0x)</span>
              <span>4 (Brisk 1.15x)</span>
              <span>5 (Fast 1.3x)</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. VOICE PITCH (SELECTABLE LINE 1 TO 10: THIN TO HEAVY) */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
            <div className="flex items-center gap-2">
              <Music2 size={16} className="text-blue-600" />
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                3. Voice Pitch (Thin to Heavy: 1 to 10)
              </label>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200 self-start sm:self-auto">
              Level {pitch}/10: {PITCH_DESCRIPTIONS[pitch]?.label}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
            {/* Extreme Labels */}
            <div className="flex justify-between items-center text-xs font-bold text-gray-600 mb-2">
              <div className="flex items-center gap-1.5 text-indigo-700">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                <span>Thin Voice (Higher Pitch)</span>
              </div>
              <div className="hidden sm:block text-gray-400 font-normal">
                Selectable Acoustic Spectrum (1 to 10)
              </div>
              <div className="flex items-center gap-1.5 text-purple-800">
                <span>Heavy Voice (Deep Baritone)</span>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
              </div>
            </div>

            {/* Stepped Clickable Line (1 to 10) */}
            <div className="relative my-4">
              {/* Background track line */}
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-300 via-blue-400 to-purple-500 rounded-full -translate-y-1/2 z-0"></div>

              {/* Step Buttons */}
              <div className="relative z-10 flex justify-between items-center">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => {
                  const isSelected = pitch === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPitch(val)}
                      className={`flex flex-col items-center group transition-transform ${
                        isSelected ? "scale-110" : "hover:scale-105"
                      }`}
                      title={`Pitch ${val}: ${PITCH_DESCRIPTIONS[val]?.label}`}
                    >
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                          isSelected
                            ? "bg-blue-600 text-white ring-4 ring-blue-200 shadow-md font-extrabold"
                            : "bg-white text-gray-700 border border-gray-300 group-hover:border-blue-400 group-hover:text-blue-600"
                        }`}
                      >
                        {val}
                      </div>
                      <span
                        className={`text-[10px] mt-1 font-medium transition-colors ${
                          isSelected ? "text-blue-700 font-bold" : "text-gray-400 group-hover:text-gray-700"
                        }`}
                      >
                        {val === 1 ? "Thin" : val === 5 ? "Mid" : val === 10 ? "Heavy" : val}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider sync */}
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={pitch}
              onChange={(e) => setPitch(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
            />

            <div className="mt-3 p-2.5 bg-white border border-gray-200 rounded-lg flex items-center justify-between text-xs">
              <span className="text-gray-600">
                Acoustic Profile: <strong>{PITCH_DESCRIPTIONS[pitch]?.label}</strong>
              </span>
              <span className="text-gray-500 italic hidden sm:inline">
                {PITCH_DESCRIPTIONS[pitch]?.desc}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. 8 CHARACTER VOICES / PERSONAS                        */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                4. Restaurant Character Voice Personas (8 Archetypes)
              </label>
            </div>
            <span className="text-xs text-gray-500">Pick personality style for calls</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {CHARACTER_PERSONAS.map((persona) => {
              const isSelected = selectedPersonaId === persona.id;
              const IconComponent = persona.icon;

              return (
                <div
                  key={persona.id}
                  onClick={() => setSelectedPersonaId(persona.id)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/40 shadow-sm ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <IconComponent size={18} />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {persona.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {persona.name}
                    </h3>
                    <div className="text-[11px] font-medium text-blue-600 mt-0.5">
                      {persona.tone}
                    </div>

                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      {persona.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {persona.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] transition-colors ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Persona Quote Preview Box */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Volume2 size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Current Sample Phrase</span>
                  <span className="text-blue-500">•</span>
                  <span className="font-semibold text-blue-700">{currentPersona.name}</span>
                </div>
                <p className="text-sm text-gray-800 font-medium italic mt-0.5">
                  &ldquo;{currentPersona.sampleQuote}&rdquo;
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayPreview}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition ${
                isPlaying
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-50"
              }`}
            >
              {isPlaying ? <Square size={12} className="fill-current" /> : <Play size={12} className="fill-current" />}
              <span>{isPlaying ? "Stop" : "Listen"}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. 100 FAMOUS LANGUAGES, MAKE ACTIVE & DISPLAY SELECTED */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-gray-100">
          {/* Header Row with Active Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-600" />
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  5. Multilingual Engine (100 Famous World Languages)
                </label>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                  100 Languages Pool
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Designate the <strong>Active Primary Spoken Language</strong> and add any of the 100 famous languages for real-time auto-detection.
              </p>
            </div>

            {/* Multilingual Master Active Switch */}
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
              <span className="text-xs font-semibold text-gray-700">Multilingual Mode</span>
              <button
                type="button"
                onClick={() => setIsMultilingualActive(!isMultilingualActive)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isMultilingualActive ? "bg-emerald-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isMultilingualActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isMultilingualActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isMultilingualActive ? "ACTIVE" : "OFF"}
              </span>
            </div>
          </div>

          {/* ACTIVE PRIMARY LANGUAGE BANNER */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 shadow-sm mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-center text-2xl">
                {activeLanguage.flag}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    Active Primary Language
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold">
                    (Default Phone Greeting & Dialog)
                  </span>
                </div>
                <div className="text-base font-extrabold text-gray-900 mt-1 flex items-center gap-2">
                  <span>{activeLanguage.name}</span>
                  <span className="text-sm font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                    {activeLanguage.nativeName}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">[{activeLanguage.code}]</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  AI receptionist will greet callers in this language. If caller speaks in any other selected language, AI automatically detects and responds in that language.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                {showLanguagePicker ? <X size={14} /> : <Plus size={14} />}
                <span>{showLanguagePicker ? "Close Directory" : "Add More From 100 Languages"}</span>
              </button>
            </div>
          </div>

          {/* DISPLAY SELECTED LANGUAGES CARDS */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <span>Selected Languages Display ({selectedLanguages.length} Active in Pool)</span>
                <span className="text-gray-400 font-normal">| Click &quot;Make Active&quot; to switch primary voice</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedLanguages.map((lang) => {
                const isActive = lang.id === activeLanguage.id;

                return (
                  <div
                    key={lang.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-200"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{lang.flag}</span>
                        <div>
                          <div className="text-sm font-bold text-gray-900 leading-tight">
                            {lang.name}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {lang.nativeName} • <span className="font-mono text-[10px]">{lang.code}</span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      {selectedLanguages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition"
                          title="Remove language"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 size={12} className="text-emerald-600" />
                          ACTIVE PRIMARY
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetActiveLanguage(lang.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 px-2.5 py-1 rounded-lg border border-blue-200 hover:border-blue-600 transition shadow-2xs"
                        >
                          <Star size={12} />
                          <span>Make It Active</span>
                        </button>
                      )}

                      <span className="text-[10px] text-gray-400 font-medium">
                        {isActive ? "Primary Dialect" : "Auto-Detected"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* SEARCHABLE 100 FAMOUS LANGUAGES BROWSER DRAWER          */}
          {/* ======================================================== */}
          {showLanguagePicker && (
            <div className="mt-5 p-4 sm:p-5 rounded-xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/50 to-white shadow-md animate-in fade-in zoom-in-95 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    100
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      World 100 Famous Languages Directory
                    </h3>
                    <p className="text-xs text-gray-500">
                      Click &quot;+ Add&quot; or &quot;Make Active&quot; on any language below to activate it in the restaurant voice pool.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLanguagePicker(false)}
                  className="self-end sm:self-auto text-xs text-gray-500 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 flex items-center gap-1"
                >
                  <X size={16} />
                  <span>Close Directory</span>
                </button>
              </div>

              {/* Search bar & Region filters */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search 100 languages by name, native script, or country code (e.g. Spanish, Urdu, Arabic, Japanese)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] font-bold text-gray-500 mr-1 flex items-center gap-1">
                    <Filter size={12} /> Regions:
                  </span>
                  {[
                    { id: "ALL", label: "All 100 Languages" },
                    { id: "POPULAR", label: "Top 20 Most Popular" },
                    { id: "Americas", label: "Americas (11)" },
                    { id: "Europe", label: "Europe (29)" },
                    { id: "Asia & Pacific", label: "Asia & Pacific (34)" },
                    { id: "Middle East", label: "Middle East (11)" },
                    { id: "Africa", label: "Africa (15)" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedRegion(filter.id)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
                        selectedRegion === filter.id
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Language Grid (100 languages) */}
              <div className="max-h-80 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {filteredLanguages.map((item) => {
                  const isAlreadySelected = selectedLanguageIds.includes(item.id);
                  const isPrimary = activeLanguage.id === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-lg border text-xs transition flex flex-col justify-between ${
                        isPrimary
                          ? "bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300"
                          : isAlreadySelected
                          ? "bg-blue-50/60 border-blue-200"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/20"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{item.flag}</span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {item.code}
                          </span>
                        </div>
                        <div className="font-bold text-gray-900 mt-1 leading-tight line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-gray-500 line-clamp-1">
                          {item.nativeName}
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between gap-1">
                        {isPrimary ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                            <CheckCircle2 size={10} />
                            Active Primary
                          </span>
                        ) : isAlreadySelected ? (
                          <>
                            <span className="text-[10px] font-semibold text-blue-700 flex items-center gap-0.5">
                              <Check size={10} /> Added
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSetActiveLanguage(item.id)}
                              className="text-[10px] font-bold text-emerald-700 hover:underline"
                            >
                              Make Active
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleAddLanguage(item, false)}
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                            >
                              <Plus size={10} /> Add
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddLanguage(item, true)}
                              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900"
                            >
                              Add & Make Active
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredLanguages.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-xs">
                  No languages match &ldquo;{searchQuery}&rdquo;. Try another name or region.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 6. LIVE JSON TELEPHONY CONFIGURATION                    */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition"
            >
              <Sliders size={14} className="text-gray-500" />
              <span>Voice & Multilingual Telephony Persona Schema (JSON)</span>
              {showJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showJson && (
              <button
                type="button"
                onClick={handleCopyJson}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-green-600" />
                    <span className="text-green-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Schema</span>
                  </>
                )}
              </button>
            )}
          </div>

          {showJson && (
            <pre className="mt-2.5 p-3.5 bg-slate-900 text-slate-100 text-xs rounded-xl overflow-x-auto font-mono leading-relaxed border border-slate-800">
              {JSON.stringify(buildConfig(), null, 2)}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
