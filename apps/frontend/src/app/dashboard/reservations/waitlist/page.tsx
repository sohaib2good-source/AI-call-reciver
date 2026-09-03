"use client";

import { Button } from "@ai-restaurant/ui";

export default function WaitlistPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Waitlist</h1>
          <p className="text-gray-500 text-sm">Friday, Oct 24 • Currently Accepting Walk-ins</p>
        </div>
        <div className="space-x-4 flex items-center">
          <label className="flex items-center gap-2 text-sm text-gray-600 mr-4">
            <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            Accepting Entries
          </label>
          <Button>+ Add Walk-In</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Waitlist Queue */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow border overflow-hidden">
          <div className="bg-gray-50 p-4 border-b font-medium text-gray-700 flex justify-between">
            <span>Live Queue (4)</span>
            <span className="text-blue-600 text-sm">Est. Wait: 45 mins</span>
          </div>
          <div className="divide-y">
            
            {/* Entry 1 */}
            <div className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    Michael Chen (3 Guests)
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-bold">NOTIFIED</span>
                  </div>
                  <div className="text-sm text-gray-500">Waiting: 42 mins • Quoted: 45 mins</div>
                </div>
              </div>
              <div className="space-x-2">
                <Button className="bg-white border text-gray-700 shadow-none hover:bg-gray-100">SMS Again</Button>
                <Button className="bg-green-600 text-white">Seat</Button>
              </div>
            </div>

            {/* Entry 2 */}
            <div className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    Emma Davis (2 Guests)
                  </div>
                  <div className="text-sm text-gray-500">Waiting: 25 mins • Quoted: 30 mins</div>
                </div>
              </div>
              <div className="space-x-2">
                <Button className="bg-white border text-gray-700 shadow-none hover:bg-gray-100">Notify SMS</Button>
              </div>
            </div>

            {/* Entry 3 VIP */}
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 bg-purple-50/30">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    Sarah Connor (4 Guests)
                    <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">VIP</span>
                  </div>
                  <div className="text-sm text-gray-500">Waiting: 10 mins • Quoted: 15 mins (Priority)</div>
                </div>
              </div>
              <div className="space-x-2">
                <Button className="bg-white border text-gray-700 shadow-none hover:bg-gray-100">Notify SMS</Button>
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow border p-6">
            <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Status Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Waiting</span>
                <span className="font-bold text-xl">14 Guests</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Wait Time</span>
                <span className="font-bold text-xl text-yellow-600">32 mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Walk-in Abandonment</span>
                <span className="font-bold text-xl text-red-600">12%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 mb-2">AI Waitlist Manager</h3>
            <p className="text-sm text-blue-700">
              The AI Receptionist is currently actively informing callers of the 45-minute wait time and placing them in the virtual queue.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
