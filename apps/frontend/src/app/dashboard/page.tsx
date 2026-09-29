"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, CalendarCheck, PhoneCall, Activity, ArrowRight } from "lucide-react";
import { getStoredMenuItems, onMenuItemsUpdated } from "@/lib/menu-store";

export default function DashboardPage() {
  const [itemsCount, setItemsCount] = useState(8);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const items = getStoredMenuItems();
    setItemsCount(items.length);

    const unsub = onMenuItemsUpdated((updatedItems) => {
      setItemsCount(updatedItems.length);
    });

    return () => unsub();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Here is your restaurant's live operational status.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Total Reservations</h3>
            <CalendarCheck size={18} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">1,234</p>
          <p className="text-xs text-green-600 mt-1 font-medium">+12% vs last week</p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Active AI Calls</h3>
            <PhoneCall size={18} className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold mt-2 text-purple-600">12</p>
          <p className="text-xs text-gray-400 mt-1">Real-time voice receptionist</p>
        </div>

        <div className="rounded-xl border bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Active Menu Items</h3>
            <BookOpen size={18} className="text-emerald-500" />
          </div>
          <p className="text-3xl font-bold mt-2 text-emerald-600">{mounted ? itemsCount : 8}</p>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-gray-400">In Menu Management</span>
            <Link href="/dashboard/menu/management" className="text-blue-600 font-medium hover:underline flex items-center gap-0.5">
              Catalog <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-white dark:bg-gray-800 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">System Health</h3>
            <Activity size={18} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2 text-green-600">99.9%</p>
          <p className="text-xs text-gray-400 mt-1">All services operational</p>
        </div>
      </div>
    </div>
  );
}
