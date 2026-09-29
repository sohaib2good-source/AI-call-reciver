"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@ai-restaurant/ui";
import { Plus, X, UtensilsCrossed, Trash2, CheckCircle2 } from "lucide-react";
import { MenuItem, getStoredMenuItems, onMenuItemsUpdated } from "@/lib/menu-store";

interface OrderLineItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  type: "DINE-IN" | "DELIVERY" | "TAKEAWAY" | "AI PHONE";
  tableOrCustomer: string;
  status: "PENDING" | "COOKING" | "READY" | "COMPLETE";
  total: number;
  timeAgo: string;
  createdBy: string;
  items: OrderLineItem[];
}

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-89211",
    type: "DINE-IN",
    tableOrCustomer: "Table 4",
    status: "COOKING",
    total: 34.50,
    timeAgo: "14 mins ago",
    createdBy: "John (Waiter) at 12:45 PM",
    items: [
      { id: "li-1", menuItemId: "item-1", name: "Classic Gourmet Cheeseburger", price: 13.99, quantity: 1 },
      { id: "li-2", menuItemId: "item-3", name: "Fiery Buffalo Wings (8 pcs)", price: 10.99, quantity: 1 },
      { id: "li-3", menuItemId: "item-7", name: "Fresh Mint Lemonade Cooler", price: 5.50, quantity: 1 }
    ]
  },
  {
    id: "ord-2",
    orderNumber: "ORD-89212",
    type: "AI PHONE",
    tableOrCustomer: "Sarah Connor (Delivery)",
    status: "COOKING",
    total: 39.75,
    timeAgo: "2 mins ago",
    createdBy: "AI Voice Receptionist at 1:02 PM",
    items: [
      { id: "li-4", menuItemId: "item-2", name: "Artisan Truffle Mushroom Pizza", price: 18.50, quantity: 1 },
      { id: "li-5", menuItemId: "item-4", name: "Creamy Chicken Alfredo Pasta", price: 16.25, quantity: 1 },
      { id: "li-6", menuItemId: "item-7", name: "Fresh Mint Lemonade Cooler", price: 5.50, quantity: 1 }
    ]
  }
];

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("ord-1");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // New Order Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrderType, setNewOrderType] = useState<"DINE-IN" | "DELIVERY" | "TAKEAWAY" | "AI PHONE">("DINE-IN");
  const [newOrderDestination, setNewOrderDestination] = useState("Table 2");
  const [cartItems, setCartItems] = useState<{ menuItemId: string; quantity: number }[]>([]);

  useEffect(() => {
    setMenuItems(getStoredMenuItems());
    const unsub = onMenuItemsUpdated((items) => setMenuItems(items));
    return () => unsub();
  }, []);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleOpenNewOrderModal = () => {
    setNewOrderType("DINE-IN");
    setNewOrderDestination("Table 2");
    if (menuItems.length > 0) {
      setCartItems([{ menuItemId: menuItems[0].id, quantity: 1 }]);
    } else {
      setCartItems([]);
    }
    setIsModalOpen(true);
  };

  const handleAddCartRow = () => {
    if (menuItems.length > 0) {
      setCartItems([...cartItems, { menuItemId: menuItems[0].id, quantity: 1 }]);
    }
  };

  const handleRemoveCartRow = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const lineItems: OrderLineItem[] = cartItems.map((cart, idx) => {
      const itemDef = menuItems.find((m) => m.id === cart.menuItemId);
      return {
        id: `li-${Date.now()}-${idx}`,
        menuItemId: cart.menuItemId,
        name: itemDef ? itemDef.name : "Custom Item",
        price: itemDef ? parseFloat(itemDef.price) : 10.0,
        quantity: cart.quantity
      };
    });

    const total = lineItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      type: newOrderType,
      tableOrCustomer: newOrderDestination,
      status: "COOKING",
      total,
      timeAgo: "Just now",
      createdBy: "POS Staff (Kitchen Auto-Route)",
      items: lineItems
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrderId(newOrder.id);
    setIsModalOpen(false);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.tableOrCustomer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || o.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesQuery && matchesType && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Live kitchen & phone orders synced with Menu Management items.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/dashboard/orders/kds">
            <Button className="bg-orange-50 text-orange-700 border border-orange-200 shadow-none hover:bg-orange-100">
              Launch KDS
            </Button>
          </Link>
          <Link href="/dashboard/orders/delivery">
            <Button className="bg-blue-50 text-blue-700 border border-blue-200 shadow-none hover:bg-blue-100">
              Delivery Dispatch
            </Button>
          </Link>
          <Button onClick={handleOpenNewOrderModal} className="bg-blue-600 hover:bg-blue-700 text-white">
            + New Order
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Order #, Customer, or Table..."
          className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Channels</option>
          <option value="DINE-IN">Dine-In</option>
          <option value="DELIVERY">Delivery</option>
          <option value="TAKEAWAY">Takeaway</option>
          <option value="AI PHONE">AI Phone</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="COOKING">Cooking</option>
          <option value="READY">Ready</option>
          <option value="COMPLETE">Complete</option>
        </select>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Orders List */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto h-[640px] divide-y divide-gray-100">
          <div className="p-3.5 bg-gray-50/80 border-b sticky top-0 font-bold text-gray-700 text-xs uppercase tracking-wider flex justify-between items-center">
            <span>Active Orders ({filteredOrders.length})</span>
            <span className="text-[11px] text-green-600 font-medium">Live KDS Sync</span>
          </div>

          {filteredOrders.map((ord) => {
            const isSelected = ord.id === selectedOrderId;
            return (
              <div
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className={`p-4 cursor-pointer transition-colors border-l-4 ${
                  isSelected
                    ? "bg-blue-50/60 border-blue-600"
                    : "hover:bg-gray-50 border-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-bold text-gray-900 text-sm">{ord.orderNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ord.type === "AI PHONE"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {ord.type}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-1">{ord.tableOrCustomer}</div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-800">
                  <span>${ord.total.toFixed(2)}</span>
                  <span className="text-gray-400 font-normal text-[11px]">{ord.timeAgo}</span>
                </div>
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-400">No orders found.</div>
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[640px] overflow-hidden">
          {selectedOrder ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50/70 flex justify-between items-start shrink-0">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedOrder.orderNumber}</h2>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      {selectedOrder.status}
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-semibold">
                      {selectedOrder.type} • {selectedOrder.tableOrCustomer}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Created by: {selectedOrder.createdBy}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-gray-900">
                    ${selectedOrder.total.toFixed(2)}
                  </div>
                  <p className="text-green-600 font-medium text-xs flex items-center justify-end gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> PAID (Verified)
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 text-sm flex items-center justify-between">
                  <span>Order Items ({selectedOrder.items.length})</span>
                  <span className="text-xs font-normal text-gray-400">Synced from Menu Catalog</span>
                </h3>
                <div className="divide-y divide-gray-100">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="py-3 flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 bg-blue-50 text-blue-700 font-bold rounded-lg flex items-center justify-center text-xs">
                          {it.quantity}x
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{it.name}</div>
                          <div className="text-xs text-gray-400">
                            Unit Price: ${it.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 text-sm">
                        ${(it.price * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50/70 shrink-0">
                <h4 className="font-semibold text-gray-700 text-xs mb-3">Order Status Progression</h4>
                <div className="flex justify-between items-center relative max-w-md mx-auto">
                  <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-0"></div>

                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-3.5 h-3.5 bg-green-500 rounded-full ring-4 ring-white"></div>
                    <span className="text-[11px] font-bold text-gray-700 mt-1">Received</span>
                  </div>

                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-3.5 h-3.5 bg-blue-500 rounded-full ring-4 ring-white animate-pulse"></div>
                    <span className="text-[11px] font-bold text-blue-600 mt-1">In Kitchen</span>
                  </div>

                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-3.5 h-3.5 bg-gray-300 rounded-full ring-4 ring-white"></div>
                    <span className="text-[11px] font-semibold text-gray-400 mt-1">Ready</span>
                  </div>

                  <div className="flex flex-col items-center relative z-10">
                    <div className="w-3.5 h-3.5 bg-gray-300 rounded-full ring-4 ring-white"></div>
                    <span className="text-[11px] font-semibold text-gray-400 mt-1">Served</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-gray-400 my-auto">Select an order to view details</div>
          )}
        </div>
      </div>

      {/* New Order Modal (Connected to Menu Management) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50/70 shrink-0">
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900 text-base">Create New Customer Order</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="flex flex-col min-h-0 overflow-hidden flex-1">
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Order Channel
                    </label>
                    <select
                      value={newOrderType}
                      onChange={(e) => setNewOrderType(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                    >
                      <option value="DINE-IN">Dine-In (Table)</option>
                      <option value="TAKEAWAY">Takeaway (Counter)</option>
                      <option value="DELIVERY">Delivery</option>
                      <option value="AI PHONE">AI Phone Booking</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Table # or Customer Name
                    </label>
                    <input
                      required
                      type="text"
                      value={newOrderDestination}
                      onChange={(e) => setNewOrderDestination(e.target.value)}
                      placeholder="e.g. Table 7 or Michael Scott"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Select Items from Menu Catalog
                    </label>
                    <button
                      type="button"
                      onClick={handleAddCartRow}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                    >
                      <Plus size={13} /> Add Another Dish
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cartItems.map((cart, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                        <select
                          value={cart.menuItemId}
                          onChange={(e) => {
                            const copy = [...cartItems];
                            copy[idx].menuItemId = e.target.value;
                            setCartItems(copy);
                          }}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-xs bg-white font-medium"
                        >
                          {menuItems.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} — ${parseFloat(m.price).toFixed(2)} ({m.status})
                            </option>
                          ))}
                        </select>

                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            value={cart.quantity}
                            onChange={(e) => {
                              const copy = [...cartItems];
                              copy[idx].quantity = parseInt(e.target.value) || 1;
                              setCartItems(copy);
                            }}
                            className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs text-center font-bold"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveCartRow(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/70 shrink-0">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Place Order to Kitchen
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
