"use client";

import { Button } from "@ai-restaurant/ui";

export default function AiSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">AI Receptionist Settings</h1>
        <Button>Save Settings</Button>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Voice & Personality</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Voice Profile</label>
              <select className="w-full border rounded p-2">
                <option>Friendly Female (English)</option>
                <option>Professional Male (English)</option>
                <option>Warm Female (Spanish)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Supported Languages</label>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">English</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Spanish</span>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm border hover:bg-gray-200">+</button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Custom Greeting</label>
              <textarea className="w-full border rounded p-2" rows={2} defaultValue="Welcome to The Grand AI Cafe! How can I assist you with your reservation or order today?" />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Business Rules</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">Enable Upselling</div>
                <div className="text-sm text-gray-500">AI will automatically suggest popular sides or drinks.</div>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <div className="font-medium">Human Fallback</div>
                <div className="text-sm text-gray-500">Transfer to staff if AI cannot understand after 2 attempts.</div>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transfer Phone Number</label>
              <input type="text" className="w-full md:w-1/2 border rounded p-2" defaultValue="+1 234 567 8900" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
