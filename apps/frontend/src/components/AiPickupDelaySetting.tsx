"use client";

import { useState } from "react";
import {
  BellRing,
  Clock,
  Check,
  Copy,
  Sparkles,
  PhoneCall,
  Code2,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface PickupDelayOption {
  rings: number;
  seconds: number;
  label: string;
  badge?: string;
  strategy: "IMMEDIATE_PICKUP" | "QUICK_PICKUP" | "STAFF_FIRST" | "STAFF_PRIORITY" | "MAX_DELAY";
  description: string;
  recommended?: boolean;
}

export const PICKUP_DELAY_OPTIONS: PickupDelayOption[] = [
  {
    rings: 1,
    seconds: 3,
    label: "1 Ring (~3s)",
    strategy: "IMMEDIATE_PICKUP",
    description: "Instant AI pickup with minimal delay. Callers are answered immediately. Best for busy takeaway hours or when no front-desk staff is available.",
  },
  {
    rings: 2,
    seconds: 6,
    label: "2 Rings (~6s)",
    badge: "RECOMMENDED",
    recommended: true,
    strategy: "QUICK_PICKUP",
    description: "Brief staff alert before AI intervenes. Callers experience a natural telephone ring before speaking with the AI receptionist.",
  },
  {
    rings: 3,
    seconds: 9,
    label: "3 Rings (~9s)",
    strategy: "STAFF_FIRST",
    description: "Staff-first window. Gives host or waitstaff 9 seconds to answer. If busy attending to seated guests, AI automatically takes over.",
  },
  {
    rings: 4,
    seconds: 12,
    label: "4 Rings (~12s)",
    strategy: "STAFF_PRIORITY",
    description: "High staff priority. AI acts as an overflow backup during peak dine-in rushes to guarantee zero lost calls.",
  },
  {
    rings: 5,
    seconds: 15,
    label: "5 Rings (~15s)",
    strategy: "MAX_DELAY",
    description: "Maximum delay before answer. Staff answers almost all calls; AI is the last line of defense before voicemail.",
  },
];

interface AiPickupDelaySettingProps {
  isAiActive?: boolean;
  initialRings?: number;
  onChange?: (rings: number, config: any) => void;
}

export function AiPickupDelaySetting({
  isAiActive = true,
  initialRings = 2,
  onChange,
}: AiPickupDelaySettingProps) {
  const [selectedRings, setSelectedRings] = useState<number>(initialRings);
  const [copied, setCopied] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(true);

  const currentOption =
    PICKUP_DELAY_OPTIONS.find((opt) => opt.rings === selectedRings) ||
    PICKUP_DELAY_OPTIONS[1];

  const handleSelectRings = (rings: number) => {
    setSelectedRings(rings);
    const opt = PICKUP_DELAY_OPTIONS.find((o) => o.rings === rings)!;
    onChange?.(rings, generateJsonConfig(isAiActive, opt));
  };

  const generateJsonConfig = (active: boolean, opt: PickupDelayOption) => {
    return {
      ai_agent_status: active ? "ACTIVE" : "DISABLED",
      auto_answering: {
        enabled: active,
        pickup_delay: {
          rings: opt.rings,
          estimated_seconds: opt.seconds,
          mode: opt.rings === 1 ? "IMMEDIATE" : "DELAYED",
          strategy: opt.strategy,
          description: opt.description,
        },
        operating_hours_only: false,
      },
      telephony: {
        provider_support: ["TWILIO", "VAPI", "RETELL", "SIP_IVR"],
        action: active ? "AI_AUTO_PICKUP" : "FORWARD_TO_STAFF",
        ring_timeout_ms: opt.seconds * 1000,
      },
    };
  };

  const currentJsonString = JSON.stringify(
    generateJsonConfig(isAiActive, currentOption),
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(currentJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <BellRing size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                Step 2
              </span>
              <h2 className="text-lg font-semibold text-gray-900">
                Call Pickup Delay (Ringing Threshold)
              </h2>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {selectedRings} {selectedRings === 1 ? "Ring" : "Rings"} (~{currentOption.seconds}s)
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Set after how many rings the AI receptionist answers incoming calls. Allows staff a chance to pick up first.
            </p>
          </div>
        </div>

        {/* Live status badge */}
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-50 border text-gray-600">
          <Clock size={14} className="text-blue-600" />
          <span>Delay: <strong>{currentOption.seconds} seconds</strong></span>
        </div>
      </div>

      {/* Ring Options Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
          Select Pickup Ring Threshold
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {PICKUP_DELAY_OPTIONS.map((opt) => {
            const isSelected = selectedRings === opt.rings;
            return (
              <button
                key={opt.rings}
                type="button"
                onClick={() => handleSelectRings(opt.rings)}
                className={`flex flex-col items-center text-center p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-100"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                {opt.badge && (
                  <span className="absolute -top-2.5 px-2 py-0.5 text-[9px] font-black rounded-full bg-green-600 text-white shadow-xs">
                    {opt.badge}
                  </span>
                )}
                <div className={`text-base font-bold ${isSelected ? "text-blue-700" : "text-gray-800"}`}>
                  {opt.rings} {opt.rings === 1 ? "Ring" : "Rings"}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  ~{opt.seconds} sec delay
                </div>
                <div className={`mt-2 text-[11px] font-semibold px-2 py-0.5 rounded ${
                  isSelected ? "bg-blue-200/60 text-blue-900" : "bg-gray-100 text-gray-600"
                }`}>
                  {opt.rings === 1 ? "Immediate" : opt.rings === 2 ? "Quick Pickup" : opt.rings === 3 ? "Staff First" : opt.rings === 4 ? "Staff Priority" : "Max Delay"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Option Explanation Box */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-start gap-2.5">
          <Sparkles size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Strategy: {currentOption.strategy.replace(/_/g, " ")}</strong> — {currentOption.description}
          </div>
        </div>
      </div>

      {/* Visual Timeline Call Flow */}
      <div className="space-y-2 pt-2 border-t">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
          <span>Call Answering Flow Timeline</span>
          <span className="text-blue-600 font-semibold">Total delay: {currentOption.seconds}s</span>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">1</span>
            <span>Caller Dials Restaurant</span>
          </div>

          <span className="text-gray-300 hidden sm:inline">➔</span>

          <div className="flex items-center gap-1.5 font-medium text-gray-700">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">2</span>
            <span>Rings {selectedRings}x ({currentOption.seconds}s staff window)</span>
          </div>

          <span className="text-gray-300 hidden sm:inline">➔</span>

          <div className="flex items-center gap-1.5 font-bold text-green-700 bg-green-100/70 px-2.5 py-1 rounded-md border border-green-200">
            <PhoneCall size={12} />
            <span>AI Receptionist Picks Up</span>
          </div>
        </div>
      </div>

      {/* Standardized JSON Structure Preview */}
      <div className="pt-2 border-t space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 size={18} className="text-gray-700" />
            <h3 className="text-sm font-bold text-gray-900">
              AI Agent JSON Configuration (Ready for AI Voice Bot / Webhook)
            </h3>
            <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border">
              Machine-Readable
            </span>
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
              <code>{currentJsonString}</code>
            </pre>
            <div className="text-[11px] text-gray-500 mt-1.5 flex items-center justify-between">
              <span>Endpoint for Voice Agents: <code className="text-gray-700 font-bold">GET /ai-settings/agent-config</code></span>
              <span className="text-green-600 font-medium">✓ Auto-syncs live with ring adjustments</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
