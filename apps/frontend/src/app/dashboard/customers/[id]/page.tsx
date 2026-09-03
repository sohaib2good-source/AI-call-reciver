"use client";

import { Button } from "@ai-restaurant/ui";
import Link from "next/link";

export default function CustomerProfilePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
            SC
          </div>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Sarah Connor 
              <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">VIP</span>
            </h1>
            <p className="text-gray-500">+1 555-1234 • sarah@example.com</p>
          </div>
        </div>
        <Button>Edit Profile</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button className="font-medium pb-2 text-blue-600 border-b-2 border-blue-600">Overview</button>
        <button className="font-medium pb-2 text-gray-500">Preferences</button>
        <button className="font-medium pb-2 text-gray-500">Timeline & History</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Stats */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="font-semibold mb-4 border-b pb-2">Loyalty & Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Tier</span>
                <span className="font-bold text-yellow-600">GOLD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Points</span>
                <span className="font-medium">1,250</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">LTV</span>
                <span className="font-medium">$1,240.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Visits</span>
                <span className="font-medium">14</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="font-semibold mb-4 border-b pb-2">Dietary</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Gluten Free</span>
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">Nut Allergy</span>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline/Insights */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="font-semibold mb-4 border-b pb-2">AI Insights</h2>
            <p className="text-gray-700 italic bg-blue-50 p-4 rounded-lg border border-blue-100">
              "Customer frequently orders on Friday evenings. Prefers a window seat. Highly allergic to peanuts. Last interaction was a complaint about cold delivery—offer a complimentary dessert on next order."
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="font-semibold mb-4 border-b pb-2">Recent Timeline</h2>
            <div className="space-y-4">
              <div className="border-l-2 border-blue-500 pl-4">
                <div className="text-xs text-gray-500">Today, 2:30 PM</div>
                <div className="font-medium">Phone Call (AI Receptionist)</div>
                <div className="text-sm text-gray-600">Made a reservation for 4 people on Friday at 7 PM.</div>
              </div>
              <div className="border-l-2 border-green-500 pl-4">
                <div className="text-xs text-gray-500">Oct 12, 8:00 PM</div>
                <div className="font-medium">Delivery Order Completed</div>
                <div className="text-sm text-gray-600">Total: $45.50. Earned 45 points.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
