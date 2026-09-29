"use client";

import { useState, useEffect } from "react";
import { Button } from "@ai-restaurant/ui";
import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Bot,
  UtensilsCrossed,
  Tag,
  Layers,
  ArrowUpDown,
  Filter
} from "lucide-react";
import {
  MenuItem,
  getStoredMenuItems,
  upsertMenuItem,
  deleteMenuItem,
  toggleMenuItemStatus,
  getStoredCategories,
  getStoredAddons,
  onMenuItemsUpdated,
  calculateCategoryItemCount
} from "@/lib/menu-store";

const DIETARY_PRESETS = [
  "Halal",
  "Vegetarian",
  "Vegan",
  "Gluten Free",
  "Popular",
  "Chef Special",
  "Spicy Level 1",
  "Spicy Level 2",
  "Spicy Level 3"
];

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [addons, setAddons] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"ALL" | "Active" | "Out of Stock">("ALL");
  const [selectedTagFilter, setSelectedTagFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategoryPath, setFormCategoryPath] = useState<string[]>([]);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<"Active" | "Out of Stock">("Active");
  const [formAddonIds, setFormAddonIds] = useState<string[]>([]);
  const [formAiVoiceNote, setFormAiVoiceNote] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setItems(getStoredMenuItems());
    setCategories(getStoredCategories());
    setAddons(getStoredAddons());

    // Subscribe to cross-page/component menu updates
    const unsubscribe = onMenuItemsUpdated((updatedItems) => {
      setItems(updatedItems);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormSku(`ITEM-${1000 + items.length + 1}`);
    setFormPrice("");
    setFormDescription("");
    setFormCategoryPath(["Main Course"]);
    setFormTags([]);
    setFormStatus("Active");
    setFormAddonIds([]);
    setFormAiVoiceNote("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormSku(item.sku);
    setFormPrice(item.price);
    setFormDescription(item.description || "");
    setFormCategoryPath(item.categoryPath || ["Main Course"]);
    setFormTags(item.tags || []);
    setFormStatus(item.status === "Out of Stock" ? "Out of Stock" : "Active");
    setFormAddonIds(item.addons || []);
    setFormAiVoiceNote(item.aiVoiceNote || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim()) return;

    const saved = upsertMenuItem({
      id: editingItem ? editingItem.id : undefined,
      name: formName.trim(),
      sku: formSku.trim() || `ITEM-${Date.now().toString().slice(-4)}`,
      categoryPath: formCategoryPath.length > 0 ? formCategoryPath : ["Main Course"],
      price: parseFloat(formPrice).toFixed(2),
      description: formDescription.trim(),
      tags: formTags,
      status: formStatus,
      addons: formAddonIds,
      aiVoiceNote: formAiVoiceNote.trim()
    });

    setItems(getStoredMenuItems());
    closeModal();
    showToast(editingItem ? `Updated "${saved.name}" successfully` : `Added "${saved.name}" to menu catalog`);
  };

  const handleToggleStatus = (id: string, name: string) => {
    const updated = toggleMenuItemStatus(id);
    if (updated) {
      setItems(getStoredMenuItems());
      showToast(`"${name}" is now marked as ${updated.status}`);
    }
  };

  const handleDelete = (id: string, name: string) => {
    deleteMenuItem(id);
    setItems(getStoredMenuItems());
    setDeleteConfirmId(null);
    showToast(`Removed "${name}" from menu catalog`);
  };

  if (!mounted) return null;

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.categoryPath.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === "ALL" ||
      (item.categoryPath && item.categoryPath.includes(selectedCategoryFilter));

    const matchesStatus =
      selectedStatusFilter === "ALL" || item.status === selectedStatusFilter;

    const matchesTag =
      selectedTagFilter === "ALL" || (item.tags && item.tags.includes(selectedTagFilter));

    return matchesSearch && matchesCategory && matchesStatus && matchesTag;
  });

  const activeCount = items.filter((i) => i.status === "Active").length;
  const outOfStockCount = items.filter((i) => i.status === "Out of Stock").length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Master Catalog
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Central repository for all dishes, beverages, and specials. Changes reflect across dining orders, combos, and AI voice prompts.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          <Plus size={18} />
          <span>Add Menu Item</span>
        </Button>
      </div>

      {/* Live KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Menu Items</span>
            <UtensilsCrossed size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{items.length}</p>
          <p className="text-xs text-gray-400 mt-1">Active in catalog database</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active & In Stock</span>
            <CheckCircle2 size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-2">{activeCount}</p>
          <p className="text-xs text-gray-400 mt-1">Ready for order & AI caller recommendation</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Out of Stock</span>
            <AlertCircle size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{outOfStockCount}</p>
          <p className="text-xs text-gray-400 mt-1">Temporarily suspended from kitchen</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories Covered</span>
            <Layers size={18} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600 mt-2">{categories.length}</p>
          <p className="text-xs text-gray-400 mt-1">Root menu sections configured</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, tags, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({calculateCategoryItemCount(cat.name, items)})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            >
              <option value="ALL">Status: All Items</option>
              <option value="Active">Status: Active Only</option>
              <option value="Out of Stock">Status: Out of Stock Only</option>
            </select>
          </div>
        </div>

        {/* Dietary Tag Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
          <span className="text-gray-400 font-medium mr-1 flex items-center gap-1">
            <Filter size={12} /> Tags:
          </span>
          <button
            onClick={() => setSelectedTagFilter("ALL")}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              selectedTagFilter === "ALL"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({items.length})
          </button>
          {DIETARY_PRESETS.map((tag) => {
            const count = items.filter((i) => i.tags && i.tags.includes(tag)).length;
            if (count === 0) return null;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? "ALL" : tag)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  selectedTagFilter === tag
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {tag} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Item & Details</th>
                <th className="py-3.5 px-4">Category Path</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Dietary & Tags</th>
                <th className="py-3.5 px-4">Add-ons</th>
                <th className="py-3.5 px-4">AI Guidance</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  {/* Name & SKU */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-[11px] text-gray-600">
                        {item.sku}
                      </span>
                      {item.description && (
                        <span className="truncate max-w-xs text-gray-500" title={item.description}>
                          {item.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Category Path */}
                  <td className="py-4 px-4 text-gray-600">
                    <div className="flex items-center text-xs flex-wrap gap-1">
                      {item.categoryPath?.map((cat, idx) => (
                        <span key={idx} className="flex items-center">
                          {idx > 0 && <span className="mx-1 text-gray-300">/</span>}
                          <span
                            className={
                              idx === item.categoryPath.length - 1
                                ? "font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded"
                                : "text-gray-500"
                            }
                          >
                            {cat}
                          </span>
                        </span>
                      )) || <span className="text-gray-400">-</span>}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 font-bold text-gray-900">
                    ${parseFloat(item.price).toFixed(2)}
                  </td>

                  {/* Tags */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.tags && item.tags.length > 0 ? (
                        item.tags.map((t) => (
                          <span
                            key={t}
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              t.includes("Spicy")
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : t === "Halal"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : t === "Vegan" || t === "Vegetarian"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </div>
                  </td>

                  {/* Addons */}
                  <td className="py-4 px-4">
                    {item.addons && item.addons.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        {item.addons.length} Extras
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>

                  {/* AI Note */}
                  <td className="py-4 px-4">
                    {item.aiVoiceNote ? (
                      <div
                        className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded max-w-xs truncate"
                        title={item.aiVoiceNote}
                      >
                        <Bot size={13} className="shrink-0 text-amber-600" />
                        <span className="truncate">{item.aiVoiceNote}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">Default prompt</span>
                    )}
                  </td>

                  {/* Status Switch */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(item.id, item.name)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        item.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      }`}
                      title="Click to toggle availability"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "Active" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {item.status}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit item"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <UtensilsCrossed size={36} className="mx-auto text-gray-300 mb-3" />
                    <p className="font-medium text-gray-700">No menu items match your criteria</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search terms or filters.</p>
                    <Button
                      onClick={openAddModal}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      + Add New Item
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={24} />
              <h3 className="font-bold text-gray-900">Delete Menu Item?</h3>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to remove this item from the catalog? It will be removed from all active menus, combos, and AI voice responses.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const target = items.find((i) => i.id === deleteConfirmId);
                  if (target) handleDelete(target.id, target.name);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50/70 shrink-0">
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={20} className="text-blue-600" />
                <h2 className="font-bold text-lg text-gray-900">
                  {editingItem ? `Edit Menu Item: ${editingItem.name}` : "Create New Menu Item"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItem} className="flex flex-col min-h-0 overflow-hidden flex-1">
              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Name, SKU, and Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Item Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Traditional Chicken Karahi"
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Base Price ($) *
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="14.99"
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                {/* SKU & Category Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">SKU / Item Code</label>
                    <input
                      type="text"
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-mono bg-white"
                      placeholder="ITEM-1009"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Root Category *</label>
                    <select
                      value={formCategoryPath[0] || ""}
                      onChange={(e) => {
                        const newRoot = e.target.value;
                        setFormCategoryPath(newRoot ? [newRoot] : []);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory</label>
                    {(() => {
                      const rootCat = categories.find((c) => c.name === formCategoryPath[0]);
                      const subs = rootCat?.subcategories || [];
                      return (
                        <select
                          disabled={subs.length === 0}
                          value={formCategoryPath[1] || ""}
                          onChange={(e) => {
                            const sub = e.target.value;
                            if (sub) {
                              setFormCategoryPath([formCategoryPath[0], sub]);
                            } else {
                              setFormCategoryPath([formCategoryPath[0]]);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="">None / Direct Root</option>
                          {subs.map((s: any) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      );
                    })()}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Dish Description
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe ingredients, cooking style, portion size, or accompaniments..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>

                {/* AI Receptionist Phone Voice Note */}
                <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wider">
                    <Bot size={15} className="text-amber-600" />
                    <span>AI Voice Receptionist Guidance</span>
                  </div>
                  <p className="text-xs text-amber-700">
                    What should the AI say when a caller asks for dish recommendations, ingredients, or allergens?
                  </p>
                  <input
                    type="text"
                    value={formAiVoiceNote}
                    onChange={(e) => setFormAiVoiceNote(e.target.value)}
                    placeholder="e.g. Mention that this dish is 100% Halal and served with complimentary basmati rice."
                    className="w-full border border-amber-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-800"
                  />
                </div>

                {/* Dietary Tags Checkboxes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Dietary & Promotional Badges
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {DIETARY_PRESETS.map((tag) => (
                      <label
                        key={tag}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          formTags.includes(tag)
                            ? "bg-blue-50/80 border-blue-300 text-blue-800 font-medium"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formTags.includes(tag)}
                          onChange={(e) => {
                            if (e.target.checked) setFormTags([...formTags, tag]);
                            else setFormTags(formTags.filter((t) => t !== tag));
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Available Add-ons Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Link Optional Add-ons & Toppings
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-36 overflow-y-auto p-3 bg-gray-50 rounded-xl border border-gray-200">
                    {addons.length === 0 ? (
                      <span className="text-gray-400 italic">No add-ons created.</span>
                    ) : (
                      addons.map((addon) => (
                        <label
                          key={addon.id}
                          className="flex items-center justify-between p-1.5 hover:bg-white rounded cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formAddonIds.includes(addon.id)}
                              onChange={(e) => {
                                if (e.target.checked) setFormAddonIds([...formAddonIds, addon.id]);
                                else setFormAddonIds(formAddonIds.filter((id) => id !== addon.id));
                              }}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-800 font-medium">{addon.name}</span>
                          </div>
                          <span className="text-gray-400 font-mono">+${Number(addon.price).toFixed(2)}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Status Toggle in Modal */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-xs font-semibold text-gray-800 block">Initial Kitchen Status</span>
                    <span className="text-xs text-gray-500">
                      {formStatus === "Active" ? "Item is active and available immediately" : "Item marked Out of Stock"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStatus("Active")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        formStatus === "Active"
                          ? "bg-green-600 text-white shadow-sm"
                          : "bg-white text-gray-600 border"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStatus("Out of Stock")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        formStatus === "Out of Stock"
                          ? "bg-red-600 text-white shadow-sm"
                          : "bg-white text-gray-600 border"
                      }`}
                    >
                      Out of Stock
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/70 shrink-0">
                <Button type="button" variant="outline" onClick={closeModal} className="text-gray-600">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                  {editingItem ? "Save Changes" : "Create Menu Item"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
