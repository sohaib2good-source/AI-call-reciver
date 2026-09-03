"use client";

import { Button } from "@ai-restaurant/ui";

export default function PhoneNumbersPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Phone Numbers</h1>
          <p className="text-gray-500 text-sm">Manage the public phone numbers connected to your AI Receptionist.</p>
        </div>
        <Button>+ Buy New Number</Button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-4 font-medium">Number</th>
              <th className="p-4 font-medium">Friendly Name</th>
              <th className="p-4 font-medium">Provider</th>
              <th className="p-4 font-medium">Capabilities</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-800">
            
            <tr className="hover:bg-gray-50">
              <td className="p-4 font-mono font-bold">+1 (555) 123-4567</td>
              <td className="p-4">Main Line</td>
              <td className="p-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">TWILIO</span>
              </td>
              <td className="p-4 text-gray-500 text-xs">
                VOICE, SMS
              </td>
              <td className="p-4">
                <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> ACTIVE
                </span>
              </td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">Configure</button>
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-4 font-mono font-bold">+1 (555) 987-6543</td>
              <td className="p-4">Catering Line</td>
              <td className="p-4">
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">VAPI</span>
              </td>
              <td className="p-4 text-gray-500 text-xs">
                VOICE
              </td>
              <td className="p-4">
                <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> ACTIVE
                </span>
              </td>
              <td className="p-4">
                <button className="text-blue-600 hover:underline">Configure</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
