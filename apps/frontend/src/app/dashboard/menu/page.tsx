"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@ai-restaurant/ui";
import {
  BookOpen,
  Layers,
  PlusCircle,
  SlidersHorizontal,
  Tag,
  UtensilsCrossed,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus
} from "lucide-react";
import {
  MenuItem,
  getStoredMenuItems,
  getStoredCategories,
  onMenuItemsUpdated
} from "@/lib/menu-store";

export default function MenuDashboardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getStoredMenuItems());
    setCategories(getStoredCategories());

    const unsubscribe = onMenuItemsUpdated((updatedItems) => {
      setItems(updatedItems);
    });

    return () => unsubscribe();
  }, []);

  if (!mounted) return null;

  const activeItemsCount = items.filter((i) => i.status === "Active").length;
  const outOfStockCount = items.filter((i) => i.status === "Out of Stock").length;
  const recentItems = items.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Menu Overview Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Live Sync
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time catalog analytics and section navigation. Items configured in Menu Management automatically synchronize here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/menu/management">
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus size={16} />
              <span>Add Menu Item</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Live KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Menu Items</span>
            <BookOpen size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mt-3">{items.length}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500">Live in catalog</span>
            <Link href="/dashboard/menu/management" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
              Manage Items <ArrowRight size={12} />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Dishes</span>
            <CheckCircle2 size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600 mt-3">{activeItemsCount}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500">Available for orders</span>
            <span className="text-green-600 font-semibold">{items.length > 0 ? Math.round((activeItemsCount / items.length) * 100) : 0}% active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Out of Stock</span>
            <AlertCircle size={20} className="text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-600 mt-3">{outOfStockCount}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500">Suspended items</span>
            <Link href="/dashboard/menu/management" className="text-amber-600 font-medium hover:underline">
              Review Stock
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories Configured</span>
            <Layers size={20} className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600 mt-3">{categories.length}</p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-500">Root sections</span>
            <Link href="/dashboard/menu/categories" className="text-purple-600 font-medium hover:underline flex items-center gap-1">
              View Tree <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/dashboard/menu/management"
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <BookOpen size={20} />
          </div>
          <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            Menu Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            View all {items.length} items, create new dishes, assign categories & configure pricing.
          </p>
        </Link>

        <Link
          href="/dashboard/menu/categories"
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Layers size={20} />
          </div>
          <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            Categories
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage hierarchical sections ({categories.length} active) with live item counts.
          </p>
        </Link>

        <Link
          href="/dashboard/menu/add-ons"
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <PlusCircle size={20} />
          </div>
          <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            Add-ons & Extras
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure extra cheese, sauces, sides, and upselling add-ons linked to menu items.
          </p>
        </Link>

        <Link
          href="/dashboard/menu/combos"
          className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Tag size={20} />
          </div>
          <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            Combos & Deals
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Build combo packages and limited time deals bundled with real menu items.
          </p>
        </Link>
      </div>

      {/* Active Menus Summary (Live Calculated) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-gray-700" />
            <h2 className="font-bold text-gray-800 text-sm">Active Channel Menus</h2>
          </div>
          <span className="text-xs text-gray-500">Automatically reflects current catalog</span>
        </div>
        <table className="w-full text-left">
          <tbody className="divide-y divide-gray-100 text-sm">
            <tr className="hover:bg-gray-50/70 transition-colors">
              <td className="p-4 font-semibold text-gray-900">Main Restaurant & AI Phone Menu</td>
              <td className="p-4 text-gray-600 text-xs">
                Synchronized with <span className="font-semibold text-blue-600">{items.length} Live Items</span> across{" "}
                <span className="font-semibold text-purple-600">{categories.length} Root Categories</span>
              </td>
              <td className="p-4 text-right">
                <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  Active & Synced
                </span>
              </td>
            </tr>
            <tr className="hover:bg-gray-50/70 transition-colors">
              <td className="p-4 font-semibold text-gray-900">Dine-In Digital Tablet Menu</td>
              <td className="p-4 text-gray-600 text-xs">
                Contains <span className="font-semibold text-blue-600">{activeItemsCount} Available Items</span> (excludes {outOfStockCount} out of stock)
              </td>
              <td className="p-4 text-right">
                <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  Active
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recent Items in Catalog */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-gray-700" />
            <h2 className="font-bold text-gray-800 text-sm">Recent Catalog Items</h2>
          </div>
          <Link
            href="/dashboard/menu/management"
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            View All {items.length} Items <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-3.5 pl-4">Item Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-3.5 pl-4 font-medium text-gray-900">
                    <div>{item.name}</div>
                    <div className="text-[11px] text-gray-400 font-mono">{item.sku}</div>
                  </td>
                  <td className="p-3.5 text-xs text-gray-600">
                    {item.categoryPath?.join(" > ") || "-"}
                  </td>
                  <td className="p-3.5 font-bold text-gray-900">
                    ${parseFloat(item.price).toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-4">
                    <Link
                      href="/dashboard/menu/management"
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
