"use client";

import { useState, useEffect } from "react";
import { Button } from "@ai-restaurant/ui";
import { X } from "lucide-react";

type Item = {
  name: string;
  categoryPath: string[];
  price: string;
  tags: string[];
  status: string;
  addons: string[];
};

const INITIAL_ITEMS: Item[] = [
  { name: "Classic Cheeseburger", categoryPath: ["Main Course", "Burgers"], price: "12.99", tags: ["Popular"], status: "Active", addons: ["1", "2"] },
  { name: "Vegan Pizza", categoryPath: ["Main Course", "Pizzas"], price: "15.99", tags: ["Vegan", "Gluten Free"], status: "Active", addons: ["11"] },
  { name: "Spicy Wings", categoryPath: ["Starters"], price: "9.99", tags: ["Spicy Level 3"], status: "Out of Stock", addons: [] }
];

const MOCK_CATEGORIES = [
  { id: "1", name: "Starters", subcategories: [] },
  { 
    id: "2", name: "Main Course", 
    subcategories: [
      { id: "2-1", name: "Burgers" },
      { id: "2-2", name: "Pizzas" },
      { id: "2-3", name: "Pasta" }
    ] 
  },
  { id: "3", name: "Desserts", subcategories: [] },
  { 
    id: "4", name: "Beverages", 
    subcategories: [
      { id: "4-1", name: "Hot Drinks" },
      { id: "4-2", name: "Cold Drinks" }
    ]
  }
];

export default function MenuItemsPage() {
  const [items, setItems] = useState<Item[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("menu_items");
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_ITEMS;
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [availableAddons, setAvailableAddons] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>(MOCK_CATEGORIES);

  useEffect(() => {
    localStorage.setItem("menu_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const savedCats = localStorage.getItem("menu_categories");
    if (savedCats) {
      try { setAvailableCategories(JSON.parse(savedCats)); } catch(e){}
    }

    const saved = localStorage.getItem("menu_addons");
    if (saved) {
      try { setAvailableAddons(JSON.parse(saved)); } catch(e){}
    } else {
      setAvailableAddons([
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
      ]);
    }
  }, []);

  const closeModal = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setName("");
    setCategoryPath([]);
    setSelectedAddonIds([]);
    setPrice("");
  };

  const openEditModal = (index: number) => {
    const item = items[index];
    setName(item.name);
    setCategoryPath(item.categoryPath || []);
    setSelectedAddonIds(item.addons || []);
    setPrice(item.price);
    setEditingIndex(index);
    setIsAdding(true);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || categoryPath.length === 0 || !price.trim()) return;

    const newItem: Item = {
      name: name.trim(),
      categoryPath: [...categoryPath],
      price: price.trim(),
      tags: editingIndex !== null ? items[editingIndex].tags : [],
      status: editingIndex !== null ? items[editingIndex].status : "Active",
      addons: selectedAddonIds
    };

    if (editingIndex !== null) {
      setItems(prev => {
        const copy = [...prev];
        copy[editingIndex] = newItem;
        return copy;
      });
    } else {
      setItems(prev => [...prev, newItem]);
    }
    
    closeModal();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Items</h1>
        <Button onClick={() => setIsAdding(true)}>+ Create Item</Button>
      </div>

      <div className="flex gap-4 mb-4">
        <input 
          type="search" 
          placeholder="Search by name, SKU, or barcode..." 
          className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="border rounded p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Categories</option>
          <option>Starters</option>
          <option>Main Course</option>
        </select>
        <select className="border rounded p-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Status: All</option>
          <option>Available</option>
          <option>Out of Stock</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-600">Item</th>
              <th className="p-4 font-medium text-gray-600">Category Path</th>
              <th className="p-4 font-medium text-gray-600">Add-ons</th>
              <th className="p-4 font-medium text-gray-600">Price</th>
              <th className="p-4 font-medium text-gray-600">Dietary</th>
              <th className="p-4 font-medium text-gray-600">Status</th>
              <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500">SKU: ITEM-{1000 + i}</div>
                </td>
                <td className="p-4 text-gray-600">
                  <div className="flex items-center text-sm flex-wrap gap-1">
                    {item.categoryPath?.map((cat, idx) => (
                      <span key={idx} className="flex items-center">
                        {idx > 0 && <span className="mx-1 text-gray-300 text-xs">/</span>}
                        <span className={idx === item.categoryPath.length - 1 ? "font-medium text-gray-800" : ""}>{cat}</span>
                      </span>
                    )) || "-"}
                  </div>
                </td>
                <td className="p-4 text-gray-600">
                  {item.addons?.length > 0 ? (
                    <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded-full">{item.addons.length} Add-ons</span>
                  ) : <span className="text-gray-400 text-sm">-</span>}
                </td>
                <td className="p-4 font-medium">${parseFloat(item.price).toFixed(2)}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {item.tags.length > 0 ? item.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{t}</span>
                    )) : <span className="text-gray-400 text-sm">-</span>}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => openEditModal(i)}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No items found. Click "Create Item" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Item Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b shrink-0">
              <h3 className="font-semibold text-lg">{editingIndex !== null ? "Edit Menu Item" : "Create Menu Item"}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateItem} className="flex flex-col min-h-0 overflow-hidden">
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Garlic Bread"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="col-span-4 mb-1">
                  <label className="block text-sm font-semibold text-gray-800">Category Selection *</label>
                  <p className="text-xs text-gray-500">Select up to 4 levels of category depth.</p>
                </div>
                {[0, 1, 2, 3].map(depth => {
                  let currentList = availableCategories;
                  let validOptions = true;
                  
                  for (let i = 0; i < depth; i++) {
                    const selectedName = categoryPath[i];
                    const selectedNode = currentList.find((c: any) => c.name === selectedName);
                    if (selectedNode?.subcategories?.length) {
                      currentList = selectedNode.subcategories;
                    } else {
                      validOptions = false;
                      break;
                    }
                  }

                  const options = validOptions ? currentList : [];
                  const isDisabled = depth > 0 && categoryPath.length < depth;

                  return (
                    <div key={depth}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {depth === 0 ? "Root Category" : `Subcategory Level ${depth}`}
                      </label>
                      <select 
                        required={depth === 0}
                        value={categoryPath[depth] || ""}
                        onChange={e => {
                          const newPath = categoryPath.slice(0, depth);
                          if (e.target.value) newPath.push(e.target.value);
                          setCategoryPath(newPath);
                        }}
                        disabled={isDisabled || (depth > 0 && options.length === 0)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">{depth === 0 ? "Select Root" : "None"}</option>
                        {options.map((cat: any) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Add-ons</label>
                <div className="grid grid-cols-2 gap-2 text-sm max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {availableAddons.length === 0 ? (
                    <div className="col-span-2 text-gray-400 text-xs italic">No add-ons created.</div>
                  ) : (
                    availableAddons.map(addon => (
                      <label key={addon.id} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedAddonIds.includes(addon.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedAddonIds([...selectedAddonIds, addon.id]);
                            else setSelectedAddonIds(selectedAddonIds.filter(id => id !== addon.id));
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate" title={addon.name}>{addon.name} <span className="text-gray-400">(${Number(addon.price).toFixed(2)})</span></span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              </div>
              <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 shrink-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingIndex !== null ? "Save Changes" : "Create Item"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
