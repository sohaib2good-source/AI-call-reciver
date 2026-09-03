"use client";

import { useState, useEffect } from "react";
import { Button } from "@ai-restaurant/ui";
import { Plus, Settings2, Trash2, X } from "lucide-react";

type AddOn = {
  id: string;
  name: string;
  price: number;
};

const INITIAL_ADDONS: AddOn[] = [
  { id: "1", name: "Extra Cheese", price: 1.50 },
  { id: "2", name: "Bacon", price: 2.00 },
  { id: "3", name: "Avocado", price: 1.75 },
  { id: "4", name: "Gluten-Free Bun", price: 2.50 },
  { id: "5", name: "Extra Patty", price: 4.00 },
  { id: "6", name: "Mushrooms", price: 1.00 },
  { id: "7", name: "Grilled Onions", price: 0.75 },
  { id: "8", name: "Jalapenos", price: 0.50 },
  { id: "9", name: "Fried Egg", price: 1.50 },
  { id: "10", name: "Truffle Oil", price: 3.00 },
  { id: "11", name: "Vegan Cheese", price: 2.00 },
  { id: "12", name: "Ranch Dressing", price: 0.50 },
  { id: "13", name: "BBQ Sauce", price: 0.50 },
  { id: "14", name: "Garlic Aioli", price: 0.75 },
  { id: "15", name: "Sriracha Mayo", price: 0.75 },
  { id: "16", name: "Pickles", price: 0.50 },
  { id: "17", name: "Tomato", price: 0.50 },
];

export default function AddOnsPage() {
  const [addons, setAddons] = useState<AddOn[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("menu_addons");
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_ADDONS;
  });

  useEffect(() => {
    localStorage.setItem("menu_addons", JSON.stringify(addons));
  }, [addons]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Pagination state
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(addons.length / ITEMS_PER_PAGE) || 1;
  const currentAddons = addons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const resetModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setName("");
    setPrice("");
  };

  const openAddModal = () => {
    resetModal();
    setIsModalOpen(true);
  };

  const openEditModal = (addon: AddOn) => {
    setEditingId(addon.id);
    setName(addon.name);
    setPrice(addon.price.toString());
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    if (editingId) {
      setAddons(prev => prev.map(a => a.id === editingId ? { ...a, name, price: parseFloat(price) } : a));
    } else {
      setAddons(prev => [...prev, {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        price: parseFloat(price)
      }]);
    }
    resetModal();
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto animate-in fade-in duration-300 pb-8">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Add-ons</h1>
          <p className="text-gray-500 text-sm">Manage global add-ons to attach to menu items.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={16} /> Create Add-on
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">
          <div className="col-span-8">Add-on Name</div>
          <div className="col-span-3 text-right">Price ($)</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
        
        <div className="p-2 space-y-1">
          {currentAddons.length === 0 ? (
            <div className="text-center p-8 text-gray-400">
              No add-ons created yet.
            </div>
          ) : (
            currentAddons.map(addon => (
              <div key={addon.id} className="grid grid-cols-12 gap-4 items-center p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                <div className="col-span-8 font-medium text-gray-700">{addon.name}</div>
                <div className="col-span-3 text-right text-gray-600">${addon.price.toFixed(2)}</div>
                <div className="col-span-1 flex justify-center">
                  {deletingId === addon.id ? (
                    <div className="flex gap-1 animate-in fade-in zoom-in duration-200">
                       <button onClick={() => {
                         setAddons(prev => prev.filter(a => a.id !== addon.id));
                         setDeletingId(null);
                         // If deleting last item on page, go back one page
                         if (currentAddons.length === 1 && currentPage > 1) {
                           setCurrentPage(prev => prev - 1);
                         }
                       }} className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors font-medium">Yes</button>
                       <button onClick={() => setDeletingId(null)} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded transition-colors font-medium">No</button>
                    </div>
                  ) : (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(addon)} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Settings2 size={16} />
                      </button>
                      <button onClick={() => setDeletingId(addon.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination Controls */}
        {addons.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50 text-sm shrink-0">
            <span className="text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, addons.length)} of {addons.length} entries
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">{editingId ? "Edit Add-on" : "Create Add-on"}</h3>
              <button onClick={resetModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Add-on Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Extra Cheese"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={resetModal}>Cancel</Button>
                <Button type="submit">{editingId ? "Update" : "Save Add-on"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
