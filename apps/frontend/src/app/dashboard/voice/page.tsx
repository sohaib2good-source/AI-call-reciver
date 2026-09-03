"use client";

import Link from "next/link";
import { Button } from "@ai-restaurant/ui";

export default function VoiceDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Voice Analytics & History</h1>
          <p className="text-gray-500 text-sm">Listen to call recordings, read transcripts, and track AI performance.</p>
        </div>
        <div className="space-x-4 flex">
          <Link href="/dashboard/voice/numbers">
            <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50 mr-4">Phone Numbers</Button>
          </Link>
          <Link href="/dashboard/voice/settings">
            <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50">Call Routing</Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-500 font-medium">Total Calls (Today)</div>
          <div className="text-3xl font-bold mt-1">142</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-500 font-medium">Avg Duration</div>
          <div className="text-3xl font-bold mt-1 text-blue-600">1m 45s</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-500 font-medium">Transferred to Human</div>
          <div className="text-3xl font-bold mt-1 text-orange-600">18</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-500 font-medium">AI Resolution Rate</div>
          <div className="text-3xl font-bold mt-1 text-green-600">87.3%</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden flex flex-col md:flex-row h-[700px]">
        
        {/* Call List */}
        <div className="w-full md:w-1/3 border-r overflow-y-auto bg-gray-50">
          <div className="p-3 bg-white border-b sticky top-0 z-10 font-bold text-gray-700 flex justify-between items-center">
            <span>Recent Calls</span>
            <span className="text-xs text-gray-400 font-normal">Auto-refreshing...</span>
          </div>

          <div className="divide-y">
            
            {/* Call 1 */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-gray-900">+1 (555) 123-4567</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">COMPLETED</span>
              </div>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>Today, 12:45 PM</span>
                <span>2m 14s</span>
              </div>
              <div className="mt-2 text-xs font-medium text-blue-600">
                Outcome: Placed Order (ORD-89212)
              </div>
            </div>

            {/* Call 2 */}
            <div className="p-4 hover:bg-gray-100 border-l-4 border-transparent cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-gray-900">+1 (555) 987-6543</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">TRANSFERRED</span>
              </div>
              <div className="text-sm text-gray-600 flex justify-between">
                <span>Today, 12:30 PM</span>
                <span>4m 05s</span>
              </div>
              <div className="mt-2 text-xs font-medium text-orange-600">
                Outcome: Complex Catering Request
              </div>
            </div>

          </div>
        </div>

        {/* Detail Pane */}
        <div className="w-full md:w-2/3 flex flex-col bg-white">
          <div className="p-6 border-b flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">+1 (555) 123-4567</h2>
              <p className="text-gray-500 text-sm mt-1">Session ID: ses_9x21abd... • Via Twilio Voice</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">Duration: 2m 14s</div>
              <p className="text-green-600 font-medium text-sm">COMPLETED</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">▶</button>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-blue-600"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0:45</span>
                  <span>2:14</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <h3 className="font-bold text-gray-800 border-b pb-2">Transcript</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">AI</div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">0:00</div>
                  <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800">
                    Thank you for calling. This is your AI assistant. How can I help you today?
                  </div>
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <div className="w-8 h-8 rounded bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs flex-shrink-0">CUST</div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-500 mb-1">0:05</div>
                  <div className="bg-blue-600 p-3 rounded-lg text-sm text-white">
                    Hi, I'd like to order a Classic Burger for pickup.
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">AI</div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">0:12</div>
                  <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800">
                    <div className="text-[10px] bg-yellow-100 text-yellow-800 px-1 inline-block mb-1 font-mono">searchMenu()</div><br/>
                    I can definitely help with that. Would you like to add fries or a drink to that order?
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
