"use client";

import { Button } from "@ai-restaurant/ui";

export default function KitchenDisplaySystemPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col font-mono">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-500">KDS: GRILL STATION</h1>
        <div className="flex gap-4">
          <div className="bg-gray-800 px-4 py-2 rounded text-lg font-bold border border-gray-700">Pending: 12</div>
          <div className="bg-gray-800 px-4 py-2 rounded text-lg font-bold border border-gray-700 text-blue-400">Cooking: 4</div>
          <Button className="bg-gray-700 border-none hover:bg-gray-600 text-white">Switch Station</Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full items-start">
          
          {/* Ticket 1: RUSH */}
          <div className="min-w-[300px] bg-red-950 border-t-8 border-red-600 rounded shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-red-900 flex justify-between items-center">
              <span className="font-bold text-xl">T-04</span>
              <span className="font-bold bg-white text-red-900 px-2 rounded animate-pulse">18m</span>
            </div>
            <div className="p-2 border-b border-red-800/50 bg-red-900/50 text-sm">
              ORD-89211 • Dine-In
            </div>
            <div className="p-4 flex-1 space-y-4">
              <div className="border-b border-red-800/30 pb-4">
                <div className="flex justify-between items-start text-lg font-bold">
                  <span>1x Truffle Burger</span>
                </div>
                <div className="text-red-300 ml-4 mt-1">• Medium Rare</div>
                <div className="text-red-300 ml-4">• + Extra Bacon</div>
              </div>
            </div>
            <div className="p-3 bg-gray-900/50">
              <Button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold h-12 text-lg shadow-none">MARK READY</Button>
            </div>
          </div>

          {/* Ticket 2 */}
          <div className="min-w-[300px] bg-gray-800 border-t-8 border-orange-500 rounded shadow-lg overflow-hidden flex flex-col">
            <div className="p-3 bg-gray-700 flex justify-between items-center">
              <span className="font-bold text-xl">DELIVERY</span>
              <span className="font-bold text-orange-400">8m</span>
            </div>
            <div className="p-2 border-b border-gray-600 bg-gray-700/50 text-sm text-gray-300">
              ORD-89212 • AI Phone Order
            </div>
            <div className="p-4 flex-1 space-y-4">
              <div className="border-b border-gray-700 pb-4">
                <div className="flex justify-between items-start text-lg font-bold">
                  <span>2x Classic Burger</span>
                </div>
                <div className="text-gray-400 ml-4 mt-1">• Well Done</div>
                <div className="text-yellow-400 font-bold ml-4 mt-1 text-sm">ALLERGY: NO ONIONS</div>
              </div>
              <div className="border-b border-gray-700 pb-4">
                <div className="flex justify-between items-start text-lg font-bold">
                  <span>1x Grilled Chicken</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-900/50">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 text-lg shadow-none">START COOKING</Button>
            </div>
          </div>

          {/* Ticket 3: New */}
          <div className="min-w-[300px] bg-gray-800 border-t-8 border-gray-500 rounded shadow-lg overflow-hidden flex flex-col opacity-80">
            <div className="p-3 bg-gray-700 flex justify-between items-center">
              <span className="font-bold text-xl">TAKEAWAY</span>
              <span className="font-bold text-gray-400">1m</span>
            </div>
            <div className="p-2 border-b border-gray-600 bg-gray-700/50 text-sm text-gray-300">
              ORD-89213 • Walk-In
            </div>
            <div className="p-4 flex-1 space-y-4">
              <div className="border-b border-gray-700 pb-4">
                <div className="flex justify-between items-start text-lg font-bold">
                  <span>1x Vegan Patty</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-gray-900/50">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 text-lg shadow-none">START COOKING</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
