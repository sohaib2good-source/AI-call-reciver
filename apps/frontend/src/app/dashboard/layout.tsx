"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Settings,
  User,
  Bot,
  Building2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(pathname?.startsWith("/dashboard/menu") ?? false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (pathname?.startsWith("/dashboard/menu")) {
      setIsMenuOpen(true);
    }
  }, [pathname]);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col border-r bg-white dark:bg-gray-800 md:flex">
        <div className="flex h-14 items-center justify-center border-b px-4">
          <span className="font-bold">AI Receptionist</span>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-2 rounded bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-medium">
            <Home size={18} /> Dashboard
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Identity</p>
          </div>
          <Link href="/dashboard/restaurant" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Building2 size={18} /> Business Profile
          </Link>
          <Link href="/dashboard/hours" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={18} /> Hours
          </Link>
          <Link href="/dashboard/tables" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={18} /> Tables
          </Link>
          <Link href="/dashboard/delivery-pickup" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={18} /> Delivery/Pickup
          </Link>

          {/* Menu Management (Collapsible Click to Open) */}
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu Management</p>
          </div>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full flex items-center justify-between rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Settings size={18} />
              <span>Menu Dashboard</span>
            </div>
            {isMenuOpen ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )}
          </button>

          {isMenuOpen && (
            <div className="space-y-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700 ml-4 animate-in fade-in slide-in-from-top-1 duration-150">
              <Link href="/dashboard/menu" className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600">
                Overview Dashboard
              </Link>
              <Link href="/dashboard/menu/categories" className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600">
                Categories
              </Link>
              <Link href="/dashboard/menu/add-ons" className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600">
                Add-ons
              </Link>
              <Link href="/dashboard/menu/items" className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600">
                Items & Variants
              </Link>
              <Link href="/dashboard/menu/modifiers" className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600">
                Modifiers
              </Link>
              <Link href="/dashboard/menu/combos" className="flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600">
                Combos & Deals
              </Link>
            </div>
          )}

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">System Config</p>
          </div>
          <Link href="/dashboard/billing" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={18} /> Billing & Plans
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={18} /> General Settings
          </Link>
          <Link href="/dashboard/ai-settings" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bot size={18} /> AI Settings
          </Link>
          <Link href="/dashboard/ai-logs" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={18} /> AI Observability
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CRM & Operations</p>
          </div>
          <Link href="/dashboard/customers" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <User size={18} /> Customers
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={18} /> Orders & KDS
          </Link>
          <Link href="/dashboard/reservations" className="flex items-center gap-2 rounded px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">
            <User size={18} /> Reservations
          </Link>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <aside className="relative w-64 flex-col bg-white dark:bg-gray-800 z-50 h-full">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="font-bold">AI Restaurant</span>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              <Link href="/dashboard" className="flex items-center gap-2 rounded bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-medium">
                <Home size={18} /> Dashboard
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Nav */}
        <header className="flex h-14 items-center justify-between border-b bg-white dark:bg-gray-800 px-4">
          <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex flex-1 justify-end items-center gap-4">
            <button className="rounded-full bg-gray-200 dark:bg-gray-700 p-2">
              <User size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
