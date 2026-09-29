"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Bot,
  Building2,
  Clock,
  UtensilsCrossed,
  Truck,
  CreditCard,
  Settings2,
  Activity,
  Users,
  ChefHat,
  CalendarCheck,
  LayoutDashboard,
  Layers,
  PlusCircle,
  Utensils,
  SlidersHorizontal,
  Tag,
  ChevronDown,
  ChevronRight,
  User,
  BookOpen,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isBusinessIdentityRoute =
    pathname?.startsWith("/dashboard/restaurant") ||
    pathname?.startsWith("/dashboard/hours");

  const isMenuRoute =
    pathname?.startsWith("/dashboard/menu") ||
    pathname?.startsWith("/dashboard/tables") ||
    pathname?.startsWith("/dashboard/delivery-pickup");

  const isSystemConfigRoute =
    pathname?.startsWith("/dashboard/billing") ||
    pathname?.startsWith("/dashboard/settings") ||
    pathname?.startsWith("/dashboard/ai-settings") ||
    pathname?.startsWith("/dashboard/ai-logs");

  const isCrmRoute =
    pathname?.startsWith("/dashboard/customers") ||
    pathname?.startsWith("/dashboard/orders") ||
    pathname?.startsWith("/dashboard/reservations");

  const [isMenuOpen, setIsMenuOpen] = useState(isMenuRoute ?? false);
  const [isBusinessIdentityOpen, setIsBusinessIdentityOpen] = useState(isBusinessIdentityRoute ?? false);
  const [isSystemConfigOpen, setIsSystemConfigOpen] = useState(isSystemConfigRoute ?? false);
  const [isCrmOpen, setIsCrmOpen] = useState(isCrmRoute ?? false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isMenuRoute) {
      setIsMenuOpen(true);
    }
  }, [pathname, isMenuRoute]);

  useEffect(() => {
    if (isBusinessIdentityRoute) {
      setIsBusinessIdentityOpen(true);
    }
  }, [pathname, isBusinessIdentityRoute]);

  useEffect(() => {
    if (isSystemConfigRoute) {
      setIsSystemConfigOpen(true);
    }
  }, [pathname, isSystemConfigRoute]);

  useEffect(() => {
    if (isCrmRoute) {
      setIsCrmOpen(true);
    }
  }, [pathname, isCrmRoute]);

  if (!mounted) return null;

function TreeNavContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative ml-4 pl-3.5 my-1.5 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
      {/* Darker Main Vertical Trunk Line */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-[18px] w-[2px] bg-gray-400 dark:bg-gray-500 rounded-full"
      />
      {children}
    </div>
  );
}

function TreeNavItem({
  href,
  children,
  icon,
  isActive,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <div className="relative flex items-center">
      {/* Darker Horizontal Branch Connector from Trunk to Item */}
      <span
        aria-hidden="true"
        className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-[2px] bg-gray-400 dark:bg-gray-500"
      />
      <Link
        href={href}
        className={`w-full flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        {icon}
        <span>{children}</span>
      </Link>
    </div>
  );
}

  const renderNavLinks = () => (
    <>
      <Link href="/dashboard" className="flex items-center gap-2 rounded bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm font-medium">
        <Home size={18} /> Dashboard
      </Link>

      {/* Business Identity (Collapsible Click to Open) */}
      <div className="pt-4 pb-1">
        <button
          type="button"
          onClick={() => setIsBusinessIdentityOpen(!isBusinessIdentityOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 uppercase tracking-wider rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
        >
          <span>Business Identity</span>
          {isBusinessIdentityOpen ? (
            <ChevronDown size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          ) : (
            <ChevronRight size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>
      </div>

      {isBusinessIdentityOpen && (
        <TreeNavContainer>
          <TreeNavItem
            href="/dashboard/restaurant"
            icon={<Building2 size={18} />}
            isActive={pathname === "/dashboard/restaurant"}
          >
            Business Profile
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/hours"
            icon={<Clock size={18} />}
            isActive={pathname === "/dashboard/hours"}
          >
            Hours
          </TreeNavItem>
        </TreeNavContainer>
      )}

      {/* System Config (Collapsible Click to Open - Positioned Above Menu Dashboard) */}
      <div className="pt-4 pb-1">
        <button
          type="button"
          onClick={() => setIsSystemConfigOpen(!isSystemConfigOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 uppercase tracking-wider rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
        >
          <span>System Config</span>
          {isSystemConfigOpen ? (
            <ChevronDown size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          ) : (
            <ChevronRight size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>
      </div>

      {isSystemConfigOpen && (
        <TreeNavContainer>
          <TreeNavItem
            href="/dashboard/billing"
            icon={<CreditCard size={18} />}
            isActive={pathname === "/dashboard/billing"}
          >
            Billing & Plans
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/settings"
            icon={<Settings2 size={18} />}
            isActive={pathname === "/dashboard/settings"}
          >
            General Settings
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/ai-settings"
            icon={<Bot size={18} />}
            isActive={pathname === "/dashboard/ai-settings"}
          >
            AI Settings
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/ai-logs"
            icon={<Activity size={18} />}
            isActive={pathname === "/dashboard/ai-logs"}
          >
            AI Observability
          </TreeNavItem>
        </TreeNavContainer>
      )}

      {/* Menu Dashboard (Collapsible Click to Open) */}
      <div className="pt-4 pb-1">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 uppercase tracking-wider rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
        >
          <span>Menu Dashboard</span>
          {isMenuOpen ? (
            <ChevronDown size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          ) : (
            <ChevronRight size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <TreeNavContainer>
          <TreeNavItem
            href="/dashboard/menu/management"
            icon={<BookOpen size={16} />}
            isActive={pathname === "/dashboard/menu/management" || pathname === "/dashboard/menu/items"}
          >
            Menu Management
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/menu"
            icon={<LayoutDashboard size={16} />}
            isActive={pathname === "/dashboard/menu"}
          >
            Overview Dashboard
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/menu/categories"
            icon={<Layers size={16} />}
            isActive={pathname === "/dashboard/menu/categories"}
          >
            Categories
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/menu/add-ons"
            icon={<PlusCircle size={16} />}
            isActive={pathname === "/dashboard/menu/add-ons"}
          >
            Add-ons
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/menu/modifiers"
            icon={<SlidersHorizontal size={16} />}
            isActive={pathname === "/dashboard/menu/modifiers"}
          >
            Modifiers
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/menu/combos"
            icon={<Tag size={16} />}
            isActive={pathname === "/dashboard/menu/combos"}
          >
            Combos & Deals
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/menu/tables"
            icon={<UtensilsCrossed size={16} />}
            isActive={pathname === "/dashboard/menu/tables" || pathname === "/dashboard/tables"}
          >
            Tables
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/menu/delivery-pickup"
            icon={<Truck size={16} />}
            isActive={pathname === "/dashboard/menu/delivery-pickup" || pathname === "/dashboard/delivery-pickup"}
          >
            Delivery/Pickup
          </TreeNavItem>
        </TreeNavContainer>
      )}

      {/* CRM & Operations (Collapsible Click to Open) */}
      <div className="pt-4 pb-1">
        <button
          type="button"
          onClick={() => setIsCrmOpen(!isCrmOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 uppercase tracking-wider rounded hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
        >
          <span>CRM & Operations</span>
          {isCrmOpen ? (
            <ChevronDown size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          ) : (
            <ChevronRight size={15} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
          )}
        </button>
      </div>

      {isCrmOpen && (
        <TreeNavContainer>
          <TreeNavItem
            href="/dashboard/customers"
            icon={<Users size={18} />}
            isActive={pathname === "/dashboard/customers"}
          >
            Customers
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/orders"
            icon={<ChefHat size={18} />}
            isActive={pathname === "/dashboard/orders"}
          >
            Orders & KDS
          </TreeNavItem>
          <TreeNavItem
            href="/dashboard/reservations"
            icon={<CalendarCheck size={18} />}
            isActive={pathname === "/dashboard/reservations"}
          >
            Reservations
          </TreeNavItem>
        </TreeNavContainer>
      )}
    </>
  );

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col border-r bg-white dark:bg-gray-800 md:flex">
        <div className="flex h-14 items-center justify-center border-b px-4">
          <span className="font-bold">AI Receptionist</span>
        </div>
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {renderNavLinks()}
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
            <nav className="space-y-1 p-4 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
              {renderNavLinks()}
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
