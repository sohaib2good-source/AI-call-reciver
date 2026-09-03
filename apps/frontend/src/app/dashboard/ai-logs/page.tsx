"use client";

import Link from "next/link";
import { Button } from "@ai-restaurant/ui";

export default function AiLogsDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Observability & Logs</h1>
          <p className="text-gray-500 text-sm">Monitor AI conversations, tool latency, and guardrail interventions.</p>
        </div>
        <div className="space-x-4">
          <select className="border rounded p-2 text-gray-700 bg-white shadow-sm">
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
          </select>
          <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50">Export Logs</Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-500 font-medium">Total Conversations</div>
          <div className="text-3xl font-bold mt-1">428</div>
          <div className="text-green-600 text-sm font-medium mt-1">↑ 12% from yesterday</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-500 font-medium">Avg Latency (OpenAI)</div>
          <div className="text-3xl font-bold mt-1 text-blue-600">840ms</div>
          <div className="text-gray-500 text-sm mt-1">Target: &lt;1000ms</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="text-sm text-gray-500 font-medium">Human Escalations</div>
          <div className="text-3xl font-bold mt-1 text-orange-600">5.2%</div>
          <div className="text-green-600 text-sm font-medium mt-1">↓ 1.1% from yesterday</div>
        </div>
        <div className="bg-white rounded-lg shadow border p-4 border-l-4 border-l-red-500">
          <div className="text-sm text-gray-500 font-medium">Guardrail Blocks</div>
          <div className="text-3xl font-bold mt-1 text-red-600">3</div>
          <div className="text-gray-500 text-sm mt-1">Prevented Hallucinations</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="font-bold text-gray-800">Recent Sessions</h2>
          <div className="flex gap-2">
            <input type="search" placeholder="Search SID or phone..." className="border rounded p-1.5 text-sm w-64" />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-3 font-medium">Session ID</th>
              <th className="p-3 font-medium">Channel</th>
              <th className="p-3 font-medium">Outcome</th>
              <th className="p-3 font-medium">Duration</th>
              <th className="p-3 font-medium">Tokens</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-800">
            
            <tr className="hover:bg-gray-50">
              <td className="p-3 font-mono text-xs text-blue-600 font-bold">ses_9x21abc...</td>
              <td className="p-3">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">VOICE</span>
              </td>
              <td className="p-3">
                <span className="text-green-600 font-medium">PLACED_ORDER</span>
              </td>
              <td className="p-3">1m 45s</td>
              <td className="p-3 text-gray-500">2,450</td>
              <td className="p-3">
                <button className="text-blue-600 hover:underline">View Transcript</button>
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-3 font-mono text-xs text-blue-600 font-bold">ses_9x21abd...</td>
              <td className="p-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">SMS</span>
              </td>
              <td className="p-3">
                <span className="text-blue-600 font-medium">BOOKED_RESERVATION</span>
              </td>
              <td className="p-3">3m 12s</td>
              <td className="p-3 text-gray-500">4,120</td>
              <td className="p-3">
                <button className="text-blue-600 hover:underline">View Transcript</button>
              </td>
            </tr>

            <tr className="hover:bg-gray-50 bg-orange-50/30">
              <td className="p-3 font-mono text-xs text-blue-600 font-bold">ses_9x21abe...</td>
              <td className="p-3">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">VOICE</span>
              </td>
              <td className="p-3">
                <span className="text-orange-600 font-bold">ESCALATED_HUMAN</span>
              </td>
              <td className="p-3">4m 05s</td>
              <td className="p-3 text-gray-500">5,800</td>
              <td className="p-3">
                <button className="text-blue-600 hover:underline">View Transcript</button>
              </td>
            </tr>

            <tr className="hover:bg-gray-50 bg-red-50/30">
              <td className="p-3 font-mono text-xs text-blue-600 font-bold">ses_9x21abf...</td>
              <td className="p-3">
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold">WHATSAPP</span>
              </td>
              <td className="p-3">
                <span className="text-red-600 font-bold text-xs bg-red-100 px-2 py-0.5 rounded">GUARDRAIL_BLOCK</span>
              </td>
              <td className="p-3">0m 15s</td>
              <td className="p-3 text-gray-500">800</td>
              <td className="p-3">
                <button className="text-blue-600 hover:underline">Review Incident</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
}
