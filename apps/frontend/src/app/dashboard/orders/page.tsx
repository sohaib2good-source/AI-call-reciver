"use client";

import Link from "next/link";
import { Button } from "@ai-restaurant/ui";

export default function OrdersDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="space-x-4 flex">
          <Link href="/dashboard/orders/kds">
            <Button className="bg-orange-50 text-orange-700 border border-orange-200 shadow-none hover:bg-orange-100 mr-2">Launch KDS</Button>
          </Link>
          <Link href="/dashboard/orders/delivery">
            <Button className="bg-blue-50 text-blue-700 border border-blue-200 shadow-none hover:bg-blue-100 mr-4">Delivery Dispatch</Button>
          </Link>
          <Button>+ New Order</Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <input 
          type="search" 
          placeholder="Search Order #, Customer, or Phone" 
          className="flex-1 border rounded p-2"
        />
        <select className="border rounded p-2 text-gray-700 bg-white">
          <option>All Types</option>
          <option>Dine-In</option>
          <option>Delivery</option>
          <option>Takeaway</option>
          <option>AI Phone</option>
        </select>
        <select className="border rounded p-2 text-gray-700 bg-white">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Cooking</option>
          <option>Ready</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow border overflow-y-auto h-[700px] divide-y">
          <div className="p-3 bg-gray-50 border-b sticky top-0 font-bold text-gray-700 flex justify-between">
            Active Orders (12)
          </div>
          
          {/* Order Item 1 */}
          <div className="p-4 bg-blue-50/50 hover:bg-blue-50 cursor-pointer border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold">ORD-89211</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">COOKING</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">DINE-IN • Table 4</div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span>$42.50</span>
              <span className="text-gray-500 text-xs">14 mins ago</span>
            </div>
          </div>

          {/* Order Item 2 */}
          <div className="p-4 hover:bg-gray-50 cursor-pointer border-l-4 border-transparent">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold">ORD-89212</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">AI PHONE</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">DELIVERY • Sarah Connor</div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span>$85.00</span>
              <span className="text-gray-500 text-xs">2 mins ago</span>
            </div>
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="md:col-span-3 bg-white rounded-lg shadow border flex flex-col h-[700px]">
          
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-start bg-gray-50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">ORD-89211</h2>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">COOKING</span>
                <span className="text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded font-bold">DINE-IN • T-04</span>
              </div>
              <p className="text-gray-600">Created by: John (Waiter) at 12:45 PM</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">$42.50</div>
              <p className="text-green-600 font-medium text-sm flex items-center justify-end gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> PAID
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="font-bold text-gray-800 border-b pb-2 mb-4">Order Items (3)</h3>
            <div className="space-y-4">
              
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-600">1x</div>
                  <div>
                    <div className="font-medium">Truffle Burger</div>
                    <div className="text-sm text-gray-500">Medium Rare</div>
                    <div className="text-sm text-gray-500">+ Extra Bacon ($2.00)</div>
                    <div className="text-xs text-orange-600 font-bold mt-1">KITCHEN: COOKING</div>
                  </div>
                </div>
                <div className="font-medium">$18.50</div>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-600">2x</div>
                  <div>
                    <div className="font-medium">Craft Beer (IPA)</div>
                    <div className="text-xs text-green-600 font-bold mt-1">BAR: READY</div>
                  </div>
                </div>
                <div className="font-medium">$16.00</div>
              </div>

            </div>
          </div>

          {/* Timeline Footer */}
          <div className="p-6 border-t bg-gray-50">
            <h3 className="font-bold text-gray-800 mb-4">Order Timeline</h3>
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>
              
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mb-2"></div>
                <span className="text-xs font-bold">Placed</span>
                <span className="text-[10px] text-gray-500">12:45</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mb-2 border-2 border-white ring-2 ring-blue-500"></div>
                <span className="text-xs font-bold text-blue-600">Cooking</span>
                <span className="text-[10px] text-gray-500">12:47</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-gray-300 rounded-full mb-2"></div>
                <span className="text-xs font-bold text-gray-400">Ready</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-gray-300 rounded-full mb-2"></div>
                <span className="text-xs font-bold text-gray-400">Complete</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
