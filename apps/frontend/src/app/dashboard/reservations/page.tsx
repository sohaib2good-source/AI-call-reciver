"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@ai-restaurant/ui";

export default function ReservationsDashboardPage() {
  const [activeView, setActiveView] = useState("timeline"); // timeline, list, calendar

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <div className="space-x-4">
          <Link href="/dashboard/reservations/waitlist">
            <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50 mr-4">Waitlist</Button>
          </Link>
          <Link href="/dashboard/reservations/floor-plan">
            <Button className="bg-blue-50 text-blue-700 border border-blue-200 shadow-none hover:bg-blue-100 mr-4">Floor Plan</Button>
          </Link>
          <Button>+ New Booking</Button>
        </div>
      </div>

      <div className="flex gap-4 border-b pb-2">
        <button 
          onClick={() => setActiveView('timeline')}
          className={`font-medium px-2 pb-2 ${activeView === 'timeline' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Timeline
        </button>
        <button 
          onClick={() => setActiveView('list')}
          className={`font-medium px-2 pb-2 ${activeView === 'list' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          List View
        </button>
        <button 
          onClick={() => setActiveView('calendar')}
          className={`font-medium px-2 pb-2 ${activeView === 'calendar' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Calendar
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <input type="date" className="border rounded p-2 text-gray-700 bg-white" defaultValue="2026-10-24" />
        <select className="border rounded p-2 text-gray-700 bg-white">
          <option>All Statuses</option>
          <option>Confirmed</option>
          <option>Seated</option>
          <option>Pending</option>
        </select>
        <input 
          type="search" 
          placeholder="Search name, phone, or RES-#" 
          className="flex-1 border rounded p-2"
        />
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {activeView === 'timeline' && (
          <>
            {/* Mock Timeline Header */}
            <div className="grid grid-cols-12 bg-gray-50 border-b text-sm font-medium text-gray-600 p-2 text-center">
              <div className="col-span-2 text-left pl-2">Table</div>
              <div>5:00 PM</div><div>5:30 PM</div><div>6:00 PM</div>
              <div>6:30 PM</div><div>7:00 PM</div><div>7:30 PM</div>
              <div>8:00 PM</div><div>8:30 PM</div><div>9:00 PM</div>
              <div>9:30 PM</div>
            </div>
            
            {/* Mock Timeline Rows */}
            <div className="divide-y relative">
              <div className="grid grid-cols-12 p-2 items-center text-sm min-h-[80px] relative">
                <div className="col-span-2 pl-2 font-bold text-gray-700">T-01 (4p) Window</div>
                <div className="col-span-10 relative h-full w-full">
                  {/* Reservation Block */}
                  <div className="absolute top-1 bottom-1 left-[10%] w-[30%] bg-blue-100 border border-blue-300 rounded px-2 py-1 overflow-hidden flex flex-col justify-center">
                    <div className="font-bold text-blue-800 truncate">Sarah Connor (2)</div>
                    <div className="text-xs text-blue-600">5:30 - 7:00 PM</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-12 p-2 items-center text-sm min-h-[80px] relative">
                <div className="col-span-2 pl-2 font-bold text-gray-700">T-02 (2p) Indoor</div>
                <div className="col-span-10 relative h-full w-full">
                  {/* Reservation Block */}
                  <div className="absolute top-1 bottom-1 left-[40%] w-[20%] bg-green-100 border border-green-300 rounded px-2 py-1 overflow-hidden flex flex-col justify-center">
                    <div className="font-bold text-green-800 truncate">John Smith (2)</div>
                    <div className="text-xs text-green-600">7:00 - 8:00 PM</div>
                  </div>
                  
                  <div className="absolute top-1 bottom-1 left-[70%] w-[25%] bg-yellow-100 border border-yellow-300 rounded px-2 py-1 overflow-hidden flex flex-col justify-center">
                    <div className="font-bold text-yellow-800 truncate">Walk-in (2)</div>
                    <div className="text-xs text-yellow-600">8:30 - 9:45 PM</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 p-2 items-center text-sm min-h-[80px] relative">
                <div className="col-span-2 pl-2 font-bold text-gray-700">T-03 (6p) VIP Room</div>
                <div className="col-span-10 relative h-full w-full">
                  {/* Reservation Block */}
                  <div className="absolute top-1 bottom-1 left-[50%] w-[50%] bg-purple-100 border border-purple-300 rounded px-2 py-1 overflow-hidden flex flex-col justify-center">
                    <div className="font-bold text-purple-800 truncate">Corporate Event (6)</div>
                    <div className="text-xs text-purple-600">7:30 - 10:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'list' && (
          <div className="p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-600 text-sm">
                  <th className="pb-2 font-medium">Time</th>
                  <th className="pb-2 font-medium">Guest</th>
                  <th className="pb-2 font-medium">Party Size</th>
                  <th className="pb-2 font-medium">Table</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                <tr className="border-b">
                  <td className="py-3">5:30 PM</td>
                  <td className="font-bold">Sarah Connor</td>
                  <td>2</td>
                  <td>T-01 (Window)</td>
                  <td><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">Confirmed</span></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">7:00 PM</td>
                  <td className="font-bold">John Smith</td>
                  <td>2</td>
                  <td>T-02 (Indoor)</td>
                  <td><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Seated</span></td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">7:30 PM</td>
                  <td className="font-bold">Corporate Event</td>
                  <td>6</td>
                  <td>T-03 (VIP Room)</td>
                  <td><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">Confirmed</span></td>
                </tr>
                <tr>
                  <td className="py-3">8:30 PM</td>
                  <td className="font-bold">Walk-in</td>
                  <td>2</td>
                  <td>T-02 (Indoor)</td>
                  <td><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="p-16 flex flex-col items-center justify-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">Calendar View</p>
            <p className="text-sm">Month and week views are under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
}
