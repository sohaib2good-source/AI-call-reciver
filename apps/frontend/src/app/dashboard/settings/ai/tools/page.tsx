"use client";

import { Button } from "@ai-restaurant/ui";

export default function AiToolsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">AI Tool Registry</h1>
          <p className="text-gray-500 text-sm">Enable or disable specific backend actions the AI is allowed to perform.</p>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Category: Ordering */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="bg-gray-50 p-4 border-b font-bold text-gray-700">Order Management Tools</div>
          <div className="divide-y">
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <div className="font-bold flex items-center gap-2">
                  searchMenu()
                  <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold uppercase">READ-ONLY</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Allows the AI to search the catalog for items, prices, and stock availability.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="p-4 flex justify-between items-center">
              <div>
                <div className="font-bold flex items-center gap-2">
                  createOrder()
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold uppercase">MUTATION</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Allows the AI to finalize and inject orders directly into the Kitchen Display System (KDS).</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

          </div>
        </div>

        {/* Category: Reservations */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="bg-gray-50 p-4 border-b font-bold text-gray-700">Reservation Tools</div>
          <div className="divide-y">
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <div className="font-bold flex items-center gap-2">
                  checkAvailability()
                  <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold uppercase">READ-ONLY</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Calculates valid reservation slots based on physical table coordinates and duration math.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="p-4 flex justify-between items-center opacity-60">
              <div>
                <div className="font-bold flex items-center gap-2">
                  createReservation()
                  <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold uppercase">MUTATION</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Allows the AI to book a table directly.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

          </div>
        </div>

        {/* Category: CRM & System */}
        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <div className="bg-gray-50 p-4 border-b font-bold text-gray-700">Escalation & Safety Tools</div>
          <div className="divide-y">
            
            <div className="p-4 flex justify-between items-center">
              <div>
                <div className="font-bold flex items-center gap-2">
                  transferToHuman()
                  <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold uppercase">SIP TRANSFER</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Initiates a WebRTC or SIP call transfer to the host stand.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
