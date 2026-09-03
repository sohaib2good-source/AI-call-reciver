"use client";

import { useState } from "react";
import { Button } from "@ai-restaurant/ui";
import { SUPPORTED_CURRENCIES } from "@/constants/currencies";
import { CheckCircle2, Receipt } from "lucide-react";

export default function GeneralSettingsPage() {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
          <p className="text-sm text-gray-500">
            Configure restaurant parameters, currency, taxes, and receipt preferences.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1 font-medium animate-in fade-in">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>

      <section className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Financial & Taxes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full border rounded p-2 bg-white text-gray-800"
            >
              {SUPPORTED_CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol}) - {curr.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Service Charge (%)</label>
            <input type="number" className="w-full border rounded p-2" defaultValue="15" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">VAT / Tax ID</label>
            <input type="text" className="w-full border rounded p-2" placeholder="Optional" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Business Registration #</label>
            <input type="text" className="w-full border rounded p-2" placeholder="Optional" />
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={20} className="text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Printing & Receipts</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Receipt Footer Message</label>
            <textarea
              className="w-full border rounded p-2 text-gray-800"
              rows={2}
              defaultValue="Thank you for dining with us! Please come again."
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="autoprint" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
            <label htmlFor="autoprint" className="text-sm font-medium text-gray-700 cursor-pointer">
              Auto-print receipts on order completion
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
