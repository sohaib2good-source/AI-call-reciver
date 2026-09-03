"use client";

import Link from "next/link";
import { Button } from "@ai-restaurant/ui";

export default function MenuDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <div className="space-x-4">
          <Button className="bg-white text-blue-600 border border-blue-600 shadow-none hover:bg-blue-50">Bulk Import</Button>
          <Button>+ New Menu</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/menu/categories" className="bg-white p-6 rounded-lg shadow border hover:border-blue-500 hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <p className="text-sm text-gray-500">Manage nested categories and subcategories.</p>
        </Link>
        <Link href="/dashboard/menu/items" className="bg-white p-6 rounded-lg shadow border hover:border-blue-500 hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Menu Items</h2>
          <p className="text-sm text-gray-500">Create items, variants, and configure pricing.</p>
        </Link>
        <Link href="/dashboard/menu/modifiers" className="bg-white p-6 rounded-lg shadow border hover:border-blue-500 hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Modifiers & Add-ons</h2>
          <p className="text-sm text-gray-500">Global modifiers, toppings, and options.</p>
        </Link>
        <Link href="/dashboard/menu/combos" className="bg-white p-6 rounded-lg shadow border hover:border-blue-500 hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-2">Combos & Deals</h2>
          <p className="text-sm text-gray-500">Build combo meals and limited time offers.</p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden mt-8">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-700">Active Menus</h2>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y">
            <tr className="hover:bg-gray-50">
              <td className="p-4 font-medium">Main Delivery Menu</td>
              <td className="p-4 text-gray-500 text-sm">Contains 42 Items across 8 Categories</td>
              <td className="p-4 text-right">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">Active</span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-4 font-medium">Breakfast Menu</td>
              <td className="p-4 text-gray-500 text-sm">Contains 15 Items across 3 Categories</td>
              <td className="p-4 text-right">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">Inactive</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
