"use client";

import { Button } from "@ai-restaurant/ui";

export default function DeliveryDispatchPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Dispatch</h1>
        <div className="space-x-4">
          <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50">Manage Drivers</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[700px]">
        
        {/* Unassigned Orders */}
        <div className="bg-white rounded-lg shadow border flex flex-col">
          <div className="p-4 bg-orange-50 border-b font-bold text-orange-800">
            Ready For Dispatch (3)
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            
            {/* Delivery Ticket */}
            <div className="bg-white p-4 rounded border shadow-sm border-orange-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">ORD-89212</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 rounded font-bold">KITCHEN READY</span>
              </div>
              <div className="text-sm font-medium mb-1">Sarah Connor</div>
              <div className="text-xs text-gray-500 mb-4 line-clamp-2">
                123 Main St, Apt 4B. (Gate code: 1234)
              </div>
              <select className="w-full border rounded p-2 text-sm">
                <option value="">Assign Driver...</option>
                <option value="d1">David (Available)</option>
                <option value="d2">Mike (Returning - 5m)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Active Deliveries / Map Mock */}
        <div className="md:col-span-2 bg-white rounded-lg shadow border flex flex-col relative overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-blue-50 opacity-50 flex items-center justify-center">
            <span className="text-blue-200 font-bold text-4xl transform -rotate-12">[Interactive Maps Integration]</span>
          </div>

          <div className="relative z-10 p-4 border-b bg-white/90 backdrop-blur">
            <h2 className="font-bold text-gray-800">Active Fleet</h2>
          </div>

          <div className="relative z-10 flex-1 p-4 pointer-events-none">
            {/* Driver Marker 1 */}
            <div className="absolute top-[30%] left-[40%] bg-white border-2 border-blue-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg pointer-events-auto cursor-pointer">
              <span className="font-bold text-blue-700">D1</span>
            </div>
            {/* Driver Marker 2 */}
            <div className="absolute top-[60%] left-[70%] bg-white border-2 border-green-500 rounded-full w-10 h-10 flex items-center justify-center shadow-lg pointer-events-auto cursor-pointer">
              <span className="font-bold text-green-700">D2</span>
            </div>
          </div>

          {/* Active Drivers Sheet */}
          <div className="relative z-10 bg-white border-t p-4 grid grid-cols-2 gap-4">
            <div className="border rounded p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-700">David (D1)</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 rounded">DELIVERING</span>
              </div>
              <div className="text-xs text-gray-600">ORD-89210 • ETA: 4 mins</div>
            </div>
            
            <div className="border rounded p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-green-700">Mike (D2)</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 rounded">RETURNING</span>
              </div>
              <div className="text-xs text-gray-600">ETA to store: 5 mins</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
