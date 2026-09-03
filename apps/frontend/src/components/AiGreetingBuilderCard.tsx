"use client";

import { useState, useMemo } from "react";
import {
  MessageSquareQuote,
  Sparkles,
  Check,
  Copy,
  Code2,
  Volume2,
  Building2,
  MapPin,
  Bot,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AiGreetingBuilderCardProps {
  businessName?: string;
  businessAddress?: string;
  onChange?: (greetingConfig: any) => void;
}

export function AiGreetingBuilderCard({
  businessName = "The Grand AI Cafe",
  businessAddress = "123 AI Boulevard, San Francisco",
  onChange,
}: AiGreetingBuilderCardProps) {
  // Checkboxes for dynamic tags
  const [includeBusinessName, setIncludeBusinessName] = useState<boolean>(true);
  const [includeAddress, setIncludeAddress] = useState<boolean>(true);
  const [includeAiIdentity, setIncludeAiIdentity] = useState<boolean>(true);
  const [includeHoursNotice, setIncludeHoursNotice] = useState<boolean>(false);

  // Blank spaces / Custom user text
  const [welcomePrefix, setWelcomePrefix] = useState<string>("Thank you for calling");
  const [customUserMessage, setCustomUserMessage] = useState<string>(
    "How may I assist you with your order, reservation, or appointment today?"
  );

  const [copied, setCopied] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Compile full greeting dynamically
  const compiledGreeting = useMemo(() => {
    const parts: string[] = [];

    // 1. Welcome prefix
    const prefix = welcomePrefix.trim();
    if (prefix) {
      if (includeBusinessName && businessName) {
        parts.push(`${prefix} ${businessName}.`);
      } else {
        parts.push(`${prefix}.`);
      }
    } else if (includeBusinessName && businessName) {
      parts.push(`${businessName}.`);
    }

    // 2. Address tag
    if (includeAddress && businessAddress) {
      parts.push(`Located at ${businessAddress}.`);
    }

    // 3. AI Identity tag
    if (includeAiIdentity) {
      parts.push("This is your AI receptionist.");
    }

    // 4. Hours notice
    if (includeHoursNotice) {
      parts.push("We are currently open and taking orders.");
    }

    // 5. Rest of custom message added by the user
    if (customUserMessage.trim()) {
      parts.push(customUserMessage.trim());
    }

    return parts.join(" ");
  }, [
    welcomePrefix,
    includeBusinessName,
    businessName,
    includeAddress,
    businessAddress,
    includeAiIdentity,
    includeHoursNotice,
    customUserMessage,
  ]);

  const greetingJsonConfig = useMemo(() => {
    return {
      step: 1,
      greeting_configuration: {
        status: "GREETING_INCLUDED",
        options: {
          include_business_name: includeBusinessName,
          include_address: includeAddress,
          include_ai_identity: includeAiIdentity,
          include_hours_notice: includeHoursNotice,
        },
        custom_welcome_prefix: welcomePrefix,
        custom_user_message: customUserMessage,
        dynamic_values: {
          business_name: businessName,
          address: businessAddress,
        },
        compiled_full_greeting: compiledGreeting,
      },
    };
  }, [
    includeBusinessName,
    includeAddress,
    includeAiIdentity,
    includeHoursNotice,
    welcomePrefix,
    customUserMessage,
    businessName,
    businessAddress,
    compiledGreeting,
  ]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(greetingJsonConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSpeakPreview = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(compiledGreeting);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-blue-200 ring-1 ring-blue-100 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <MessageSquareQuote size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                Step 1
              </span>
              <h2 className="text-lg font-bold text-gray-900">
                Greeting Configuration
              </h2>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
                Greeting Included
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure what the AI receptionist says first when answering. Check boxes to include business details, and add custom welcome text.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSpeakPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition cursor-pointer self-start sm:self-center shadow-2xs"
        >
          <Volume2 size={15} className={isPlaying ? "animate-pulse text-blue-600" : ""} />
          <span>{isPlaying ? "Playing..." : "Listen Greeting"}</span>
        </button>
      </div>

      {/* 1. Checkboxes (Little Boxes) to include elements */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Included Dynamic Elements (Check to Include in Greeting)
        </label>
        <p className="text-xs text-gray-500">
          The AI will dynamically weave checked information into its opening sentence:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Checkbox 1: Add Business Name */}
          <label
            className={`flex items-start gap-2.5 p-3 rounded-lg border transition cursor-pointer select-none ${
              includeBusinessName
                ? "bg-blue-50/70 border-blue-400 text-blue-950 font-medium ring-1 ring-blue-100"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={includeBusinessName}
              onChange={(e) => setIncludeBusinessName(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
            />
            <div>
              <div className="text-xs font-bold flex items-center gap-1">
                <Building2 size={13} className="text-blue-600" />
                <span>Add Business Name</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[170px]">
                &quot;{businessName}&quot;
              </div>
            </div>
          </label>

          {/* Checkbox 2: Add Address */}
          <label
            className={`flex items-start gap-2.5 p-3 rounded-lg border transition cursor-pointer select-none ${
              includeAddress
                ? "bg-blue-50/70 border-blue-400 text-blue-950 font-medium ring-1 ring-blue-100"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={includeAddress}
              onChange={(e) => setIncludeAddress(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
            />
            <div>
              <div className="text-xs font-bold flex items-center gap-1">
                <MapPin size={13} className="text-blue-600" />
                <span>Add Address</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[170px]">
                &quot;{businessAddress}&quot;
              </div>
            </div>
          </label>

          {/* Checkbox 3: Add AI Identity */}
          <label
            className={`flex items-start gap-2.5 p-3 rounded-lg border transition cursor-pointer select-none ${
              includeAiIdentity
                ? "bg-blue-50/70 border-blue-400 text-blue-950 font-medium ring-1 ring-blue-100"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={includeAiIdentity}
              onChange={(e) => setIncludeAiIdentity(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
            />
            <div>
              <div className="text-xs font-bold flex items-center gap-1">
                <Bot size={13} className="text-blue-600" />
                <span>Add AI Identity</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                &quot;This is your AI receptionist&quot;
              </div>
            </div>
          </label>

          {/* Checkbox 4: Add Hours Notice */}
          <label
            className={`flex items-start gap-2.5 p-3 rounded-lg border transition cursor-pointer select-none ${
              includeHoursNotice
                ? "bg-blue-50/70 border-blue-400 text-blue-950 font-medium ring-1 ring-blue-100"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={includeHoursNotice}
              onChange={(e) => setIncludeHoursNotice(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
            />
            <div>
              <div className="text-xs font-bold flex items-center gap-1">
                <Clock size={13} className="text-blue-600" />
                <span>Add Hours Notice</span>
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                &quot;Currently open for orders&quot;
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* 2. Blank Spaces for Custom Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t">
        {/* Blank Space 1: Custom Welcome Message Prefix */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Welcome Message (Blank Space to Customize)
          </label>
          <input
            type="text"
            value={welcomePrefix}
            onChange={(e) => setWelcomePrefix(e.target.value)}
            placeholder="e.g. Thank you for calling, Welcome to, Hello..."
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 bg-white font-medium focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-1.5 mt-2 flex-wrap text-[11px]">
            <span className="text-gray-400">Quick presets:</span>
            {["Thank you for calling", "Welcome to", "Hello! Thanks for reaching"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setWelcomePrefix(preset)}
                className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 border border-gray-200"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Blank Space 2: User Message (Closing / Rest of greeting) */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            User Message (Rest of Greeting / Call-to-Action)
          </label>
          <textarea
            rows={2}
            value={customUserMessage}
            onChange={(e) => setCustomUserMessage(e.target.value)}
            placeholder="Type your message here (e.g. How may I assist you with your table reservation or food order today?)..."
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 bg-white font-medium focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            This message will be spoken directly after the dynamic business tags.
          </p>
        </div>
      </div>

      {/* 3. Live Assembled Greeting Box */}
      <div className="p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-600" />
            Live Assembled Greeting (Spoken by AI on Answer)
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-blue-700 border border-blue-200">
            {compiledGreeting.split(" ").length} Words
          </span>
        </div>

        <div className="p-3 bg-white rounded-lg border border-blue-200 shadow-2xs font-medium text-sm text-gray-900 leading-relaxed">
          &quot;{compiledGreeting}&quot;
        </div>
      </div>

      {/* 4. Machine-Readable JSON Structure */}
      <div className="pt-2 border-t space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
              <Code2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">
                  Step 1 Greeting JSON Configuration
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Machine-Readable
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Telephony voice bots and LLMs read this exact payload as the greeting prompt.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium cursor-pointer"
            >
              {showJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showJson ? "Hide JSON" : "Show JSON"}
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-900 text-white hover:bg-gray-800 transition cursor-pointer shadow-xs"
            >
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
              <span>{copied ? "Copied!" : "Copy JSON"}</span>
            </button>
          </div>
        </div>

        {showJson && (
          <div className="relative">
            <pre className="bg-gray-950 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-gray-800 leading-relaxed shadow-inner max-h-72">
              <code>{JSON.stringify(greetingJsonConfig, null, 2)}</code>
            </pre>
            <div className="text-[11px] text-gray-500 mt-1.5 flex items-center justify-between">
              <span>Endpoint for Voice Bots: <code className="text-gray-700 font-bold">GET /ai-settings/agent-config</code></span>
              <span className="text-green-600 font-medium">✓ Auto-syncs live with greeting tags and user message</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
