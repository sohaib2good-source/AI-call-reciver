"use client";

import { useState, useEffect } from "react";
import { Button } from "@ai-restaurant/ui";
import { Plus, Trash2, X } from "lucide-react";

type ComboItem = {
  id: string;
  quantity: number;
  description: string;
};

type Combo = {
  id: string;
  name: string;
  description: string;
  price: string;
  items: ComboItem[];
  isActive: boolean;
};

const INITIAL_COMBOS: Combo[] = [
  {
    id: "1",
    name: "Family Feast Deal",
    description: "Valid only on weekends.",
    price: "49.99",
    isActive: true,
    items: [
      { id: "i1", quantity: 2, description: "Any Large Pizza" },
      { id: "i2", quantity: 1, description: "Large Garlic Bread" },
      { id: "i3", quantity: 1, description: "2L Soda" },
    ]
  }
];

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("menu_combos");
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_COMBOS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState<ComboItem[]>([]);
  const [availableMenuItems, setAvailableMenuItems] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem("menu_combos", JSON.stringify(combos));
  }, [combos]);

  useEffect(() => {
    const savedItems = localStorage.getItem("menu_items");
    if (savedItems) {
      try { setAvailableMenuItems(JSON.parse(savedItems)); } catch(e){}
    }
  }, []);

  const openModal = (combo?: Combo) => {
    if (combo) {
      setEditingId(combo.id);
      setName(combo.name);
      setDescription(combo.description);
      setPrice(combo.price);
      setItems(combo.items);
    } else {
      setEditingId(null);
      setName("");
      setDescription("");
      setPrice("");
      setItems([{ id: Math.random().toString(), quantity: 1, description: "" }]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim() || items.length === 0) return;

    const newCombo: Combo = {
      id: editingId || Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      items: items.filter(i => i.description.trim() !== ""),
      isActive: editingId ? combos.find(c => c.id === editingId)?.isActive ?? true : true
    };

    if (editingId) {
      setCombos(prev => prev.map(c => c.id === editingId ? newCombo : c));
    } else {
      setCombos(prev => [...prev, newCombo]);
    }
    closeModal();
  };

  const toggleStatus = (id: string) => {
    setCombos(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this combo?")) {
      setCombos(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Combos & Deals</h1>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus size={16} /> Create Combo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map(combo => (
          <div key={combo.id} className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col transition-opacity ${!combo.isActive ? 'opacity-60' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-bold text-lg">{combo.name}</h2>
                {combo.description && <p className="text-gray-500 text-sm mt-0.5">{combo.description}</p>}
              </div>
              <div className="font-bold text-green-600 text-xl">${parseFloat(combo.price).toFixed(2)}</div>
            </div>
            
            <div className="space-y-2 mb-6 flex-1">
              {combo.items.map(item => (
                <div key={item.id} className="bg-gray-50/80 p-2.5 rounded-lg text-sm border border-gray-100 flex items-center gap-3">
                  <span className="font-semibold text-gray-700 bg-white px-2 py-0.5 rounded border shadow-sm">{item.quantity}x</span>
                  <span className="text-gray-600">{item.description}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-4 shrink-0">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleStatus(combo.id)}
                  className={`text-sm font-medium ${combo.isActive ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'}`}
                >
                  {combo.isActive ? 'Disable' : 'Enable'}
                </button>
                <button 
                  onClick={() => handleDelete(combo.id)}
                  className="text-red-600 text-sm font-medium hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              <Button 
                onClick={() => openModal(combo)}
                className="bg-gray-100 text-gray-800 border shadow-none hover:bg-gray-200"
              >
                Edit Combo
              </Button>
            </div>
          </div>
        ))}
        {combos.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Combos Yet</h3>
            <p className="text-gray-500 mb-4">Create your first combo or deal to boost sales.</p>
            <Button onClick={() => openModal()}>Create Combo</Button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b shrink-0 bg-gray-50/50">
              <h3 className="font-semibold text-lg">{editingId ? "Edit Combo" : "Create Combo"}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 bg-white p-1 rounded-full shadow-sm border">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col min-h-0 overflow-hidden flex-1">
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Combo Name *</label>
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Family Feast Deal"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($) *</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Valid only on weekends."
                  />
                </div>

                <div className="border-t pt-5 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-gray-800">Combo Items</label>
                    <button 
                      type="button"
                      onClick={() => setItems([...items, { id: Math.random().toString(), quantity: 1, description: "" }])}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1.5 rounded-md transition-colors"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-20 shrink-0">
                          <input 
                            required
                            type="number" 
                            min="1"
                            value={item.quantity}
                            onChange={e => {
                              const newItems = [...items];
                              newItems[index].quantity = parseInt(e.target.value) || 1;
                              setItems(newItems);
                            }}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Qty"
                          />
                        </div>
                        <div className="flex-1">
                          <select 
                            required
                            value={item.description}
                            onChange={e => {
                              const newItems = [...items];
                              newItems[index].description = e.target.value;
                              setItems(newItems);
                            }}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="" disabled>Select a menu item...</option>
                            {availableMenuItems.length === 0 && (
                              <option value="" disabled>No menu items available. Create some first!</option>
                            )}
                            {availableMenuItems.map((menuItem: any, i: number) => (
                              <option key={i} value={menuItem.name}>
                                {menuItem.name} (${Number(menuItem.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setItems(items.filter((_, i) => i !== index))}
                          className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          disabled={items.length === 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              <div className="flex justify-end gap-2 p-5 border-t bg-gray-50 shrink-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Save Changes" : "Create Combo"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
