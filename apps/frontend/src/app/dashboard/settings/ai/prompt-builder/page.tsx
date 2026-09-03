"use client";

import { Button } from "@ai-restaurant/ui";

export default function AiPromptBuilderPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Personality & Prompt</h1>
          <p className="text-gray-500 text-sm">Configure how your AI Receptionist speaks and behaves.</p>
        </div>
        <div className="space-x-4">
          <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50 mr-4">Discard Changes</Button>
          <Button>Save Configuration</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Base System Prompt</h2>
            <textarea 
              className="w-full h-48 border rounded p-3 text-sm font-mono bg-gray-50"
              defaultValue={`You are a helpful, professional, and friendly restaurant receptionist.
Your primary goal is to assist customers with reservations, take food orders, and answer general questions about the restaurant.
Always be polite and keep your responses concise.`}
            />
            <p className="text-xs text-gray-500 mt-2">
              Note: The AI Engine automatically injects your live Business Hours, Menu Items, and active Promotions below this prompt. Do not hardcode prices here.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Voice & Tone</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                <select className="w-full border rounded p-2 text-gray-700 bg-white">
                  <option>Professional & Warm</option>
                  <option>Casual & Friendly</option>
                  <option>Formal & Elegant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pacing</label>
                <select className="w-full border rounded p-2 text-gray-700 bg-white">
                  <option>Normal (Conversational)</option>
                  <option>Slightly Slower (Clearer)</option>
                  <option>Fast (Efficient)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Greeting</label>
              <input 
                type="text" 
                className="w-full border rounded p-2 text-gray-700" 
                defaultValue="Thank you for calling [Restaurant Name]. This is your AI assistant. How can I help you today?"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="font-bold text-gray-800">Upsell Engine</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4" defaultChecked />
                <span className="text-sm font-medium">Enable Upselling</span>
              </label>
            </div>
            
            <textarea 
              className="w-full h-24 border rounded p-3 text-sm"
              defaultValue={`1. When a user orders a main course, ask if they would like to add a drink or side.
2. If the user mentions a special occasion, suggest premium add-ons.`}
            />
          </div>
        </div>

        {/* Sidebar / Simulator */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg shadow p-4 flex flex-col h-[500px]">
            <h2 className="font-bold text-blue-800 mb-2 border-b border-blue-200 pb-2">Chat Simulator</h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">AI</div>
                <div className="bg-white p-3 rounded-lg border text-sm text-gray-800 shadow-sm">
                  Thank you for calling. This is your AI assistant. How can I help you today?
                </div>
              </div>

              <div className="flex gap-2 flex-row-reverse">
                <div className="w-8 h-8 rounded bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs flex-shrink-0">ME</div>
                <div className="bg-blue-600 p-3 rounded-lg text-sm text-white shadow-sm">
                  Yeah hi, do you guys have vegan options?
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">AI</div>
                <div className="bg-white p-3 rounded-lg border text-sm text-gray-800 shadow-sm relative">
                  <span className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-800 text-[10px] px-1 rounded border border-yellow-200">searchMenu Tool Called</span>
                  Yes! We have a wonderful Vegan Patty Burger and a Fresh Garden Salad. Would you like to place an order?
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200 flex gap-2">
              <input type="text" placeholder="Type a message..." className="flex-1 border border-blue-300 rounded p-2 text-sm" />
              <Button className="bg-blue-600 text-white shadow-none">Send</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
