"use client";

import Link from "next/link";
import { Button } from "@ai-restaurant/ui";

export default function CustomersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="space-x-4">
          <Link href="/dashboard/customers/merge">
            <Button className="bg-white text-gray-700 border shadow-none hover:bg-gray-50 mr-4">Merge Duplicates</Button>
          </Link>
          <Button>+ Add Customer</Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <input 
          type="search" 
          placeholder="Search by name, phone, or email..." 
          className="flex-1 border rounded p-2"
        />
        <select className="border rounded p-2 text-gray-700 bg-white">
          <option>All Segments</option>
          <option>VIP Only</option>
          <option>New Customers</option>
          <option>High Value</option>
        </select>
        <Button className="bg-gray-100 text-gray-700 border shadow-none hover:bg-gray-200">Export</Button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-600">Customer</th>
              <th className="p-4 font-medium text-gray-600">Contact</th>
              <th className="p-4 font-medium text-gray-600">LTV</th>
              <th className="p-4 font-medium text-gray-600">Tier</th>
              <th className="p-4 font-medium text-gray-600">Last Visit</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              { id: "c1", name: "Sarah Connor", phone: "+1 555-1234", ltv: "$1,240.00", tier: "GOLD", visit: "2 days ago", vip: true },
              { id: "c2", name: "John Smith", phone: "+1 555-9876", ltv: "$45.00", tier: "BRONZE", visit: "Today", vip: false },
            ].map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {c.name}
                    {c.vip && <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">VIP</span>}
                  </div>
                </td>
                <td className="p-4 text-gray-600">{c.phone}</td>
                <td className="p-4 font-medium">{c.ltv}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${c.tier === 'GOLD' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
                    {c.tier}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{c.visit}</td>
                <td className="p-4 text-right">
                  <Link href={`/dashboard/customers/${c.id}`} className="text-blue-600 text-sm font-medium hover:underline">
                    View Profile
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
