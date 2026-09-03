"use client";

import Link from "next/link";
import { Button } from "@ai-restaurant/ui";

export default function ReservationsDashboardPage() {
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
        <button className="font-medium text-blue-600 border-b-2 border-blue-600 px-2 pb-2">Timeline</button>
        <button className="font-medium text-gray-500 px-2 pb-2">List View</button>
        <button className="font-medium text-gray-500 px-2 pb-2">Calendar</button>
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
          <div className="grid grid-cols-12 p-2 items-center text-sm min-h-[60px] relative">
            <div className="col-span-2 pl-2 font-bold text-gray-700">T-01 (4p) Window</div>
            <div className="col-span-10 relative h-full w-full">
              {/* Reservation Block */}
              <div className="absolute top-1 bottom-1 left-[10%] w-[30%] bg-blue-100 border border-blue-300 rounded px-2 py-1 overflow-hidden">
                <div className="font-bold text-blue-800 truncate">Sarah Connor (2)</div>
                <div className="text-xs text-blue-600">5:30 - 7:00 PM</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-12 p-2 items-center text-sm min-h-[60px] relative">
            <div className="col-span-2 pl-2 font-bold text-gray-700">T-02 (2p) Indoor</div>
            <div className="col-span-10 relative h-full w-full">
              {/* Reservation Block */}
              <div className="absolute top-1 bottom-1 left-[40%] w-[20%] bg-green-100 border border-green-300 rounded px-2 py-1 overflow-hidden">
                <div className="font-bold text-green-800 truncate">John Smith (2)</div>
                <div className="text-xs text-green-600">7:00 - 8:00 PM</div>
              </div>
              
              <div className="absolute top-1 bottom-1 left-[70%] w-[25%] bg-yellow-100 border border-yellow-300 rounded px-2 py-1 overflow-hidden">
                <div className="font-bold text-yellow-800 truncate">Walk-in (2)</div>
                <div className="text-xs text-yellow-600">8:30 - 9:45 PM</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 p-2 items-center text-sm min-h-[60px] relative">
            <div className="col-span-2 pl-2 font-bold text-gray-700">T-03 (6p) VIP Room</div>
            <div className="col-span-10 relative h-full w-full">
              {/* Reservation Block */}
              <div className="absolute top-1 bottom-1 left-[50%] w-[50%] bg-purple-100 border border-purple-300 rounded px-2 py-1 overflow-hidden">
                <div className="font-bold text-purple-800 truncate">Corporate Event (6)</div>
                <div className="text-xs text-purple-600">7:30 - 10:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
