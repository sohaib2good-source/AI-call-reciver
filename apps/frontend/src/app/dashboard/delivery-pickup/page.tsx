"use client";

import { useState } from "react";
import { Button } from "@ai-restaurant/ui";

export default function DeliveryPickupPage() {
  const [activeTab, setActiveTab] = useState<"delivery" | "pickup">("delivery");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Delivery & Pickup</h1>
        <Button>Save Settings</Button>
      </div>

      <div className="flex gap-4 mb-6 border-b pb-2">
        <button 
          className={`font-medium pb-2 ${activeTab === 'delivery' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab("delivery")}
        >
          Delivery Settings
        </button>
        <button 
          className={`font-medium pb-2 ${activeTab === 'pickup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab("pickup")}
        >
          Pickup Settings
        </button>
      </div>

      {activeTab === "delivery" && (
        <div className="bg-white p-6 rounded-lg shadow border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Radius (km)</label>
              <input type="number" className="w-full border rounded p-2" defaultValue="5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Order ($)</label>
              <input type="number" className="w-full border rounded p-2" defaultValue="20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Standard Delivery Fee ($)</label>
              <input type="number" className="w-full border rounded p-2" defaultValue="4.99" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estimated Delivery Time (mins)</label>
              <input type="number" className="w-full border rounded p-2" defaultValue="45" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "pickup" && (
        <div className="bg-white p-6 rounded-lg shadow border space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Preparation Time (mins)</label>
              <input type="number" className="w-full border rounded p-2" defaultValue="20" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <label className="text-sm font-medium">Pickup Available</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pickup Instructions</label>
            <textarea className="w-full border rounded p-2" rows={3} defaultValue="Please wait at the counter with your order number." />
          </div>
        </div>
      )}
    </div>
  );
}
