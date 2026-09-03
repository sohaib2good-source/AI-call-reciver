"use client";

import { useState } from "react";
import { Button } from "@ai-restaurant/ui";
import { SUPPORTED_CURRENCIES } from "@/constants/currencies";
import { Bot, PhoneCall, PhoneOff, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isAiActive, setIsAiActive] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">General Settings</h1>
          <p className="text-sm text-gray-500">Configure AI auto-receptionist behavior and restaurant parameters.</p>
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

      <div className="space-y-6">
        {/* AI Agent Auto-Answer Toggle Card */}
        <section className={`p-6 rounded-lg shadow border transition-all duration-200 ${
          isAiActive ? "bg-white border-green-200 ring-1 ring-green-100" : "bg-white border-gray-200"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl transition-colors ${
                isAiActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {isAiActive ? <PhoneCall size={24} /> : <PhoneOff size={24} />}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-semibold text-gray-900">AI Call Auto-Answering</h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isAiActive 
                      ? "bg-green-100 text-green-800 border border-green-200" 
                      : "bg-gray-100 text-gray-600 border border-gray-300"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isAiActive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></span>
                    {isAiActive ? "ACTIVE (AUTO-PICKUP)" : "DISABLED (CALL FORWARDING)"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  When toggled <strong>ON</strong>, the AI receptionist automatically answers incoming calls, speaks with customers, answers questions, takes food orders, and books table reservations.
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
                onClick={() => setIsAiActive(!isAiActive)}
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-green-50/70 border border-green-100 p-3 rounded-md text-green-900">
                <div>
                  <span className="font-bold">⚡ Pickup Delay:</span> 1 ring (Immediate)
                </div>
                <div>
                  <span className="font-bold">🎙️ Voice Mode:</span> Natural Conversational AI
                </div>
                <div>
                  <span className="font-bold">📋 Active Tasks:</span> Orders, Reservations, FAQs
                </div>
              </div>
            ) : (
              <div className="text-xs bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-800 flex items-center gap-2">
                <span>⚠️</span>
                <span><strong>AI Paused:</strong> Incoming calls will not be answered by the AI and will forward directly to the front desk / staff phone line.</span>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Financial & Taxes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select 
                value={selectedCurrency} 
                onChange={(e) => setSelectedCurrency(e.target.value)} 
                className="w-full border rounded p-2 bg-white"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol}) - {curr.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service Charge (%)</label>
              <input type="number" className="w-full border rounded p-2" defaultValue="15" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">VAT Number</label>
              <input type="text" className="w-full border rounded p-2" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Registration #</label>
              <input type="text" className="w-full border rounded p-2" placeholder="Optional" />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Printing & Receipts</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Receipt Footer Message</label>
              <textarea className="w-full border rounded p-2" rows={2} defaultValue="Thank you for dining at The Grand AI Cafe! Please come again." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <label className="text-sm font-medium">Auto-print receipts on order completion</label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
