"use client";

import { Button } from "@ai-restaurant/ui";

export default function FloorPlanPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <h1 className="text-2xl font-bold">Interactive Floor Plan</h1>
        <div className="space-x-4">
          <select className="border rounded p-2 text-gray-700 bg-white">
            <option>Main Floor</option>
            <option>Terrace</option>
          </select>
          <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50">Edit Layout</Button>
        </div>
      </div>

      <div className="flex-1 bg-gray-100 rounded-lg border shadow-inner relative overflow-hidden flex items-center justify-center p-8">
        
        {/* Mock Canvas Area */}
        <div className="w-[800px] h-[600px] bg-white shadow-sm border relative">
          
          {/* Table 1 - Occupied */}
          <div className="absolute top-[10%] left-[10%] w-[120px] h-[80px] bg-red-100 border-2 border-red-400 rounded-lg flex flex-col items-center justify-center cursor-pointer shadow">
            <div className="font-bold text-red-800">T-01</div>
            <div className="text-xs text-red-600">4 / 4 Seated</div>
          </div>

          {/* Table 2 - Reserved */}
          <div className="absolute top-[10%] left-[40%] w-[80px] h-[80px] bg-yellow-100 border-2 border-yellow-400 flex flex-col items-center justify-center cursor-pointer shadow">
            <div className="font-bold text-yellow-800">T-02</div>
            <div className="text-xs text-yellow-600">Next: 7:00 PM</div>
          </div>

          {/* Table 3 - Available (Round) */}
          <div className="absolute top-[40%] left-[15%] w-[100px] h-[100px] bg-green-50 border-2 border-green-400 rounded-full flex flex-col items-center justify-center cursor-pointer shadow">
            <div className="font-bold text-green-800">T-03</div>
            <div className="text-xs text-green-600">0 / 6</div>
          </div>

          {/* Table 4 - Cleaning */}
          <div className="absolute top-[40%] right-[15%] w-[120px] h-[120px] bg-blue-50 border-2 border-blue-400 rounded-full flex flex-col items-center justify-center cursor-pointer shadow">
            <div className="font-bold text-blue-800">T-04</div>
            <div className="text-xs text-blue-600 text-center px-2">Cleaning (5m)</div>
          </div>

          {/* VIP Room Wall */}
          <div className="absolute bottom-[5%] right-[5%] w-[300px] h-[200px] border-4 border-gray-300 flex items-center justify-center">
            <div className="absolute top-2 left-2 text-gray-400 font-bold tracking-widest uppercase">VIP Room</div>
            {/* Table 5 - Occupied VIP */}
            <div className="w-[180px] h-[80px] bg-purple-100 border-2 border-purple-400 rounded flex flex-col items-center justify-center cursor-pointer shadow">
              <div className="font-bold text-purple-800">T-05</div>
              <div className="text-xs text-purple-600">6 / 8 Seated</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
