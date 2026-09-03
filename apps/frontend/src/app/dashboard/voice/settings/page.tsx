"use client";

import { Button } from "@ai-restaurant/ui";

export default function VoiceSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Voice Routing & Settings</h1>
          <p className="text-gray-500 text-sm">Configure what happens when the AI needs to transfer a call.</p>
        </div>
        <Button>Save Settings</Button>
      </div>

      <div className="space-y-6">
        
        {/* Escalations */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Human Escalation (Live Transfers)</h2>
          <p className="text-sm text-gray-500 mb-4">When a customer asks for a human, or the AI encounters a critical error, calls will be forwarded here via SIP or standard PSTN.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manager / Host Stand Number (Primary Fallback)</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-gray-700 font-mono" 
                defaultValue="+1 (555) 000-1111"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kitchen Number (For catering/large order transfers)</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-gray-700 font-mono" 
                placeholder="+1 (555) 000-2222"
              />
            </div>
          </div>
        </div>

        {/* Voicemail */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="font-bold text-gray-800">Voicemail Fallback</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-500 mb-4">If the Manager number is busy, or the restaurant is closed, allow the AI to transcribe a voicemail.</p>
        </div>

        {/* Recording */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="font-bold text-gray-800">Call Recording</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-sm text-gray-500 mb-4">Record AI interactions for quality assurance and training purposes. (Ensure compliance with local two-party consent laws).</p>
        </div>

      </div>
    </div>
  );
}
