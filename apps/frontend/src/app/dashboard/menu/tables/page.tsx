"use client";

import { Button } from "@ai-restaurant/ui";

export default function TablesPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tables & Areas</h1>
        <Button>+ Add Area</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Areas List */}
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow border space-y-2">
          <h2 className="font-semibold text-lg mb-4">Areas</h2>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded cursor-pointer font-medium text-blue-800">
            Main Dining Room
          </div>
          <div className="p-3 hover:bg-gray-50 border rounded cursor-pointer font-medium text-gray-600">
            Outdoor Terrace
          </div>
          <div className="p-3 hover:bg-gray-50 border rounded cursor-pointer font-medium text-gray-600">
            VIP Lounge
          </div>
        </div>

        {/* Tables in Selected Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="font-semibold text-lg">Tables in: Main Dining Room</h2>
            <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-none border text-sm h-8">+ Add Table</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border rounded p-4 text-center hover:border-blue-500 cursor-pointer">
                <div className="font-bold text-lg mb-1">T-{i}</div>
                <div className="text-xs text-gray-500">Cap: 4</div>
                <div className="mt-2 text-xs bg-green-100 text-green-800 rounded px-2 py-1 inline-block">Available</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
