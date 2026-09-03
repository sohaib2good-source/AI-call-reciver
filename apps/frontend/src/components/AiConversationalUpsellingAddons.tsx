"use client";

import { useState } from "react";
import {
  Layers,
  Utensils,
  Sliders,
  Tag,
  MessageSquareQuote,
  Check,
  Copy,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
} from "lucide-react";

export interface UpsellModule {
  id: "categories" | "menu_items" | "modifiers_and_addons" | "combos_and_deals";
  title: string;
  subtitle: string;
  icon: any;
  defaultPrompt: string;
  triggerEvent: string;
  exampleItem: string;
}

export const UPSELL_MODULES: UpsellModule[] = [
  {
    id: "categories",
    title: "Categories",
    subtitle: "Ask caller to explore course categories (Appetizers, Beverages, Desserts).",
    icon: Layers,
    defaultPrompt: "Would you like to start with any appetizers or beverage specials today?",
    triggerEvent: "AFTER_FIRST_ITEM",
    exampleItem: "Appetizers & Beverages",
  },
  {
    id: "menu_items",
    title: "Menu Items",
    subtitle: "Proactively recommend chef's specials, best-sellers, and signature items.",
    icon: Utensils,
    defaultPrompt: "Our Chef's Special Truffle Pasta is very popular today. Would you like to try it?",
    triggerEvent: "ON_RECOMMENDATION_REQUEST",
    exampleItem: "Signature Dishes",
  },
  {
    id: "modifiers_and_addons",
    title: "Modifiers & Add-ons",
    subtitle: "Ask caller if they want extra toppings, cheese, special sauces, or side add-ons.",
    icon: Sliders,
    defaultPrompt: "Would you like to add extra cheese, bacon, avocado, or premium sauces to that?",
    triggerEvent: "ON_ITEM_SELECTED",
    exampleItem: "Toppings & Extras",
  },
  {
    id: "combos_and_deals",
    title: "Combos & Deals",
    subtitle: "Pitch meal combo upgrades, value packages, and active promotional bundle offers.",
    icon: Tag,
    defaultPrompt: "Would you like to upgrade your order into a combo meal with fries and a drink for $3.50?",
    triggerEvent: "BEFORE_CHECKOUT",
    exampleItem: "Combo Upgrades",
  },
];

export interface UpsellSettingsState {
  categories: boolean;
  menu_items: boolean;
  modifiers_and_addons: boolean;
  combos_and_deals: boolean;
}

interface AiConversationalUpsellingAddonsProps {
  initialState?: Partial<UpsellSettingsState>;
  onChange?: (state: UpsellSettingsState, jsonConfig: any) => void;
}

export function AiConversationalUpsellingAddons({
  initialState,
  onChange,
}: AiConversationalUpsellingAddonsProps) {
  const [activeModules, setActiveModules] = useState<UpsellSettingsState>({
    categories: initialState?.categories ?? true,
    menu_items: initialState?.menu_items ?? true,
    modifiers_and_addons: initialState?.modifiers_and_addons ?? true,
    combos_and_deals: initialState?.combos_and_deals ?? false,
  });

  const [prompts, setPrompts] = useState<Record<string, string>>({
    categories: UPSELL_MODULES[0].defaultPrompt,
    menu_items: UPSELL_MODULES[1].defaultPrompt,
    modifiers_and_addons: UPSELL_MODULES[2].defaultPrompt,
    combos_and_deals: UPSELL_MODULES[3].defaultPrompt,
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(true);

  const handleToggle = (id: keyof UpsellSettingsState) => {
    const nextState = {
      ...activeModules,
      [id]: !activeModules[id],
    };
    setActiveModules(nextState);
    onChange?.(nextState, generateJsonConfig(nextState));
  };

  const generateJsonConfig = (modules: UpsellSettingsState) => {
    return {
      ai_conversational_addons: {
        categories: {
          enabled: modules.categories,
          agent_behavior: modules.categories ? "AGENT_WILL_ASK" : "AGENT_WILL_NOT_ASK",
          prompt_script: prompts.categories,
          trigger: "AFTER_FIRST_ITEM",
        },
        menu_items: {
          enabled: modules.menu_items,
          agent_behavior: modules.menu_items ? "AGENT_WILL_ASK" : "AGENT_WILL_NOT_ASK",
          prompt_script: prompts.menu_items,
          trigger: "ON_RECOMMENDATION_REQUEST",
        },
        modifiers_and_addons: {
          enabled: modules.modifiers_and_addons,
          agent_behavior: modules.modifiers_and_addons ? "AGENT_WILL_ASK" : "AGENT_WILL_NOT_ASK",
          prompt_script: prompts.modifiers_and_addons,
          trigger: "ON_ITEM_SELECTED",
        },
        combos_and_deals: {
          enabled: modules.combos_and_deals,
          agent_behavior: modules.combos_and_deals ? "AGENT_WILL_ASK" : "AGENT_WILL_NOT_ASK",
          prompt_script: prompts.combos_and_deals,
          trigger: "BEFORE_CHECKOUT",
        },
      },
    };
  };

  const currentJsonConfig = generateJsonConfig(activeModules);
  const jsonString = JSON.stringify(currentJsonConfig, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeCount = Object.values(activeModules).filter(Boolean).length;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                Step 3
              </span>
              <h2 className="text-lg font-bold text-gray-900">
                AI Conversational Add-ons & Upselling
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                {activeCount} of 4 Prompts Active
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Click to toggle: If clicked, the AI agent will ask the customer. If disabled, the agent will not ask.
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-600 bg-gray-50 border px-3 py-1.5 rounded-lg flex items-center gap-2 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Click card to switch between <strong>Will Ask</strong> / <strong>Will Not Ask</strong></span>
        </div>
      </div>

      {/* 4 Cards Grid Matching User Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {UPSELL_MODULES.map((mod) => {
          const isEnabled = activeModules[mod.id];
          const IconComponent = mod.icon;

          return (
            <div
              key={mod.id}
              onClick={() => handleToggle(mod.id)}
              className={`flex flex-col justify-between p-4 rounded-xl border-2 transition-all cursor-pointer relative select-none ${
                isEnabled
                  ? "border-green-500 bg-green-50/40 shadow-sm ring-1 ring-green-100"
                  : "border-gray-200 bg-white hover:border-gray-300 opacity-90"
              }`}
            >
              <div>
                {/* Header with Icon and Toggle Pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isEnabled
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <IconComponent size={20} />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isEnabled
                        ? "bg-green-600 text-white shadow-2xs"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isEnabled ? (
                      <>
                        <Volume2 size={11} /> Agent Will Ask
                      </>
                    ) : (
                      <>
                        <VolumeX size={11} /> Will NOT Ask
                      </>
                    )}
                  </span>
                </div>

                {/* Title and Subtitle */}
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                  <span>{mod.title}</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {mod.subtitle}
                </p>
              </div>

              {/* Dynamic Action / Prompt Preview */}
              <div className="mt-4 pt-3 border-t border-gray-200/80">
                {isEnabled ? (
                  <div className="bg-white/90 p-2 rounded-md border border-green-200 text-[11px] text-green-950 flex items-start gap-1.5">
                    <MessageSquareQuote size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Prompt: </span>
                      <span className="italic">&quot;{prompts[mod.id]}&quot;</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-2 rounded-md border border-gray-200 text-[11px] text-gray-500 flex items-center gap-1.5">
                    <VolumeX size={13} className="text-gray-400 flex-shrink-0" />
                    <span>Agent stays silent & skips prompt.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Caller Dialogue Simulation */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquareQuote size={15} className="text-blue-600" />
            Live Call Simulation Preview
          </span>
          <span className="text-[11px] text-gray-500">
            Caller orders: <em>&quot;I would like a Gourmet Burger.&quot;</em>
          </span>
        </div>

        <div className="p-3 bg-white rounded-lg border text-xs text-gray-800 space-y-1.5">
          <div className="font-semibold text-blue-900 flex items-center gap-1.5">
            <span>🤖 AI Receptionist Response:</span>
          </div>
          <p className="text-gray-700 italic pl-3 border-l-2 border-blue-400">
            &quot;Certainly! I have added one Gourmet Burger to your order.{" "}
            {activeModules.modifiers_and_addons && (
              <span className="text-green-700 font-medium">
                Would you like to add extra cheese, bacon, or customize your sauce?{" "}
              </span>
            )}
            {activeModules.combos_and_deals && (
              <span className="text-indigo-700 font-medium">
                We also have a combo special today—would you like to upgrade that into a meal with fries and a beverage?{" "}
              </span>
            )}
            {activeModules.categories && (
              <span className="text-amber-700 font-medium">
                Can I also get you started with any drinks or appetizers?{" "}
              </span>
            )}
            {!activeModules.modifiers_and_addons &&
              !activeModules.combos_and_deals &&
              !activeModules.categories && (
                <span>Anything else I can get for you today?</span>
              )}
            &quot;
          </p>
        </div>
      </div>

      {/* Standardized Machine-Readable JSON Structure */}
      <div className="pt-2 border-t space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
              <Code2 size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">
                  AI Conversational Upselling JSON Configuration
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Machine-Readable
                </span>
              </div>
              <p className="text-[11px] text-gray-500">
                Directly ingested by telephony workers (Twilio IVR, Retell, Vapi) to decide when the bot will ask.
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
              <code>{jsonString}</code>
            </pre>
            <div className="text-[11px] text-gray-500 mt-1.5 flex items-center justify-between">
              <span>Endpoint for Voice Bots: <code className="text-gray-700 font-bold">GET /ai-settings/agent-config</code></span>
              <span className="text-green-600 font-medium">✓ Auto-syncs live with card clicks</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
