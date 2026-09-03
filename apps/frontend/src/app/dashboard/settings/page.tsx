"use client";

import { useState } from "react";
import { Button } from "@ai-restaurant/ui";
import { SUPPORTED_CURRENCIES } from "@/constants/currencies";

export default function SettingsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  return (
    <div className="w-full max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">General Settings</h1>
        <Button>Save Settings</Button>
      </div>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Financial & Taxes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select 
                value={selectedCurrency} 
                onChange={(e) => setSelectedCurrency(e.target.value)} 
                className="w-full border rounded p-2 bg-white"
              >
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol}) - {curr.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service Charge (%)</label>
              <input type="number" className="w-full border rounded p-2" defaultValue="15" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">VAT Number</label>
              <input type="text" className="w-full border rounded p-2" placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business Registration #</label>
              <input type="text" className="w-full border rounded p-2" placeholder="Optional" />
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4">Printing & Receipts</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Receipt Footer Message</label>
              <textarea className="w-full border rounded p-2" rows={2} defaultValue="Thank you for dining at The Grand AI Cafe! Please come again." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <label className="text-sm font-medium">Auto-print receipts on order completion</label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
