"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@ai-restaurant/ui";
import { AiCallAutoAnswerCard } from "@/components/AiCallAutoAnswerCard";
import { AiGreetingBuilderCard } from "@/components/AiGreetingBuilderCard";
import { AiPickupDelaySetting } from "@/components/AiPickupDelaySetting";
import { AiConversationalUpsellingAddons } from "@/components/AiConversationalUpsellingAddons";
import { AiVoicePersonalitySetting } from "@/components/AiVoicePersonalitySetting";
import {
  Bot,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function AiSettingsPage() {
  const [isAiActive, setIsAiActive] = useState<boolean>(true);
  const [pickupRings, setPickupRings] = useState<number>(2);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">AI Receptionist Settings</h1>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">
              Voice Assistant
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Manage AI auto-answering behavior, call pickup ring threshold, conversational ordering add-ons, and voice persona.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1 font-medium animate-in fade-in">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>

      {/* Master AI Auto-Answering Toggle Switch */}
      <AiCallAutoAnswerCard
        initialActive={isAiActive}
        pickupRings={pickupRings}
        onToggle={(active) => setIsAiActive(active)}
      />

      {/* Step 1: Greeting Configuration (Under AI call toggle switch) */}
      <AiGreetingBuilderCard
        businessName="The Grand AI Cafe"
        businessAddress="123 AI Boulevard, San Francisco"
      />

      {/* Step 2: Standalone Call Pickup Delay (Adjustable Ring Threshold & JSON Schema) */}
      <AiPickupDelaySetting
        isAiActive={isAiActive}
        initialRings={pickupRings}
        onChange={(rings) => setPickupRings(rings)}
      />

      {/* Step 3: Conversational Ordering & Upselling Addons: Categories, Menu Items, Modifiers, Combos */}
      <AiConversationalUpsellingAddons />

      {/* Step 4: Voice & Personality Engine (Cadence, Pitch, Personas & 100 Languages) */}
      <AiVoicePersonalitySetting />

      {/* Quick Links to Advanced AI Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/settings/ai/prompt-builder"
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 hover:shadow transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Prompt & Tone Studio</div>
              <div className="text-xs text-gray-500">Fine-tune system prompts and simulate live conversations</div>
            </div>
          </div>
          <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 transition" />
        </Link>

        <Link
          href="/dashboard/settings/ai/tools"
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 hover:shadow transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition">
              <Bot size={20} />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">AI Tool Registry</div>
              <div className="text-xs text-gray-500">Enable/disable KDS booking and menu search capabilities</div>
            </div>
          </div>
          <ExternalLink size={16} className="text-gray-400 group-hover:text-purple-600 transition" />
        </Link>
      </div>

      {/* Step 5: Business & Escalation Rules */}
      <section className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
            Step 5
          </span>
          <h2 className="text-lg font-bold text-gray-900">Business &amp; Escalation Rules</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="font-medium text-gray-900">Enable Smart Upselling</div>
              <div className="text-sm text-gray-500">AI receptionist intelligently suggests paired drinks, desserts, or daily specials.</div>
            </div>
            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="font-medium text-gray-900">Human Fallback & Transfer</div>
              <div className="text-sm text-gray-500">Automatically transfer call to staff if customer requests a human or AI cannot assist.</div>
            </div>
            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Staff Transfer Phone Number</label>
            <input
              type="text"
              className="w-full md:w-1/2 border rounded p-2 text-gray-800"
              defaultValue="+1 (555) 019-2834"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
