"use client";

import { useState, useEffect } from "react";
import { PhoneCall, PhoneOff, Sliders, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface AiCallAutoAnswerCardProps {
  initialActive?: boolean;
  pickupRings?: number;
  onToggle?: (active: boolean) => void;
}

export function AiCallAutoAnswerCard({
  initialActive = true,
  pickupRings = 2,
  onToggle,
}: AiCallAutoAnswerCardProps) {
  const [isAiActive, setIsAiActive] = useState(initialActive);
  const [showJson, setShowJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialActive !== undefined) {
      setIsAiActive(initialActive);
    }
  }, [initialActive]);

  const handleToggle = () => {
    const nextState = !isAiActive;
    setIsAiActive(nextState);
    onToggle?.(nextState);
  };

  const jsonConfig = {
    call_handling_policy: {
      auto_answer_enabled: isAiActive,
      strategy: isAiActive ? "AUTOMATED_AI_RECEPTIONIST" : "DIRECT_STAFF_FORWARDING",
      supported_workflows: isAiActive ? ["FOOD_ORDERING", "TABLE_RESERVATIONS", "FAQ_INQUIRIES"] : [],
      fallback_destination: "STAFF_PHONE_LINE"
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className={`p-6 rounded-2xl shadow-sm border-[2.5px] border-black transition-all duration-200 ${
        isAiActive
          ? "bg-white"
          : "bg-white opacity-85"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl transition-colors ${
              isAiActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isAiActive ? <PhoneCall size={24} /> : <PhoneOff size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-semibold text-gray-900">
                AI Call Auto-Answering
              </h2>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isAiActive
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAiActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                ></span>
                {isAiActive
                  ? "ACTIVE (AUTO-PICKUP)"
                  : "DISABLED (CALL FORWARDING)"}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              When toggled <strong>ON</strong>, the AI receptionist
              automatically answers incoming calls, speaks with customers,
              answers questions, takes food orders, and books table reservations.
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3 sm:self-center">
          <span className="text-sm font-semibold text-gray-700">
            {isAiActive ? "AI Agent: ON" : "AI Agent: OFF"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isAiActive}
            onClick={handleToggle}
            className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              isAiActive ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span className="sr-only">Toggle AI Agent</span>
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isAiActive ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Context Banner */}
      <div className="mt-4 pt-4 border-t">
        {isAiActive ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs bg-green-50/70 border border-green-100 p-3 rounded-md text-green-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="font-semibold">AI Receptionist Active</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Monitoring incoming line and answering calls</span>
            </div>
            <div className="text-green-800 font-medium bg-green-200/60 px-2 py-0.5 rounded text-[11px]">
              Active Tasks: Orders, Reservations, FAQs
            </div>
          </div>
        ) : (
          <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 flex items-center gap-2">
            <span>⚠️</span>
            <span>
              <strong>AI Paused:</strong> Incoming calls will not be answered
              by the AI and will forward directly to the staff phone line.
            </span>
          </div>
        )}

        {/* Collapsible JSON Schema (Default OFF) */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowJson(!showJson)}
              className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition"
            >
              <Sliders size={13} className="text-gray-500" />
              <span>Call Handling Policy Schema (JSON)</span>
              {showJson ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {showJson && (
              <button
                type="button"
                onClick={handleCopy}
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
              {JSON.stringify(jsonConfig, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}
