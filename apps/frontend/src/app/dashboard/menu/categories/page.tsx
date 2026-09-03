"use client";

import { useState, useEffect } from "react";
import { Button } from "@ai-restaurant/ui";
import { ChevronRight, Plus, Settings2, Trash2, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  itemCount: number;
  subcategories?: Category[];
  sku?: string;
};

const INITIAL_CATEGORIES: Category[] = [
  { 
    id: "1", 
    name: "Starters", 
    itemCount: 12 
  },
  { 
    id: "2", 
    name: "Main Course", 
    itemCount: 45,
    subcategories: [
      { id: "2-1", name: "Burgers", itemCount: 15 },
      { 
        id: "2-2", 
        name: "Pizzas", 
        itemCount: 20,
        subcategories: [
          { id: "2-2-1", name: "Classic", itemCount: 8 },
          { id: "2-2-2", name: "Premium", itemCount: 12 }
        ]
      },
      { id: "2-3", name: "Pasta", itemCount: 10 }
    ] 
  },
  { 
    id: "3", 
    name: "Desserts", 
    itemCount: 8 
  },
  { 
    id: "4", 
    name: "Beverages", 
    itemCount: 25,
    subcategories: [
      { id: "4-1", name: "Hot Drinks", itemCount: 10 },
      { id: "4-2", name: "Cold Drinks", itemCount: 15 }
    ]
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("menu_categories");
      if (saved) return JSON.parse(saved);
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem("menu_categories", JSON.stringify(categories));
  }, [categories]);

  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  
  // Add category state
  const [addingTo, setAddingTo] = useState<string | null | undefined>(undefined);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  
  const [newCatName, setNewCatName] = useState("");
  const [newCatSku, setNewCatSku] = useState("");

  // Delete category state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteCountdown, setDeleteCountdown] = useState<number>(0);
  const [deleteConfirmingId, setDeleteConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (deletingId && deleteCountdown > 0) {
      timer = setTimeout(() => {
        setDeleteCountdown(c => c - 1);
      }, 1000);
    } else if (deletingId && deleteCountdown === 0) {
      setDeleteConfirmingId(deletingId);
      setDeletingId(null);
    }
    return () => clearTimeout(timer);
  }, [deletingId, deleteCountdown]);

  const initiateDelete = (id: string) => {
    setDeletingId(id);
    setDeleteCountdown(10);
    setDeleteConfirmingId(null);
  };

  const cancelDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeletingId(null);
    setDeleteCountdown(0);
    setDeleteConfirmingId(null);
  };

  const deleteCategoryFromTree = (list: Category[], idToRemove: string): Category[] => {
    return list.filter(c => c.id !== idToRemove).map(c => {
      if (c.subcategories) return { ...c, subcategories: deleteCategoryFromTree(c.subcategories, idToRemove) };
      return c;
    });
  };

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCategories(prev => deleteCategoryFromTree(prev, id));
    cancelDelete();
  };

  const addCategoryToTree = (list: Category[], parentId: string | null, newCat: Category): Category[] => {
    if (parentId === null) return [...list, newCat];
    return list.map(c => {
      if (c.id === parentId) return { ...c, subcategories: [...(c.subcategories || []), newCat] };
      if (c.subcategories) return { ...c, subcategories: addCategoryToTree(c.subcategories, parentId, newCat) };
      return c;
    });
  };

  const updateCategoryInTree = (list: Category[], categoryId: string, updatedData: Partial<Category>): Category[] => {
    return list.map(c => {
      if (c.id === categoryId) return { ...c, ...updatedData };
      if (c.subcategories) return { ...c, subcategories: updateCategoryInTree(c.subcategories, categoryId, updatedData) };
      return c;
    });
  };

  const resetModal = () => {
    setAddingTo(undefined);
    setEditingCategory(undefined);
    setNewCatName("");
    setNewCatSku("");
  };

  const openEditModal = (cat: Category) => {
    setNewCatName(cat.name);
    setNewCatSku(cat.sku || "");
    setEditingCategory(cat);
  };

  const handleConfirmAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    if (editingCategory) {
      setCategories(prev => updateCategoryInTree(prev, editingCategory.id, {
        name: newCatName.trim(),
        sku: newCatSku.trim()
      }));
    } else if (addingTo !== undefined) {
      const newCategory: Category = {
        id: Math.random().toString(36).substring(2, 9),
        name: newCatName.trim(),
        itemCount: 0,
        subcategories: [],
        sku: newCatSku.trim()
      };
      setCategories(prev => addCategoryToTree(prev, addingTo, newCategory));
    }
    resetModal();
  };

  const columns: Category[][] = [categories];
  let currentList = categories;
  for (const selectedId of selectedPath) {
    if (columns.length >= 4) break;
    const selected = currentList.find(c => c.id === selectedId);
    if (selected?.subcategories?.length) {
      columns.push(selected.subcategories);
      currentList = selected.subcategories;
    } else break;
  }

  const handleSelect = (depth: number, categoryId: string) => {
    const newPath = selectedPath.slice(0, depth);
    newPath.push(categoryId);
    setSelectedPath(newPath);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-500 text-sm">Manage infinite depth category hierarchies.</p>
        </div>
        <Button onClick={() => setAddingTo(null)} className="flex items-center gap-2">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-x-auto overflow-y-hidden flex relative">
        {columns.map((column, depth) => (
          <div 
            key={depth} 
            className="w-72 flex-shrink-0 border-r bg-gray-50/30 flex flex-col h-full max-h-full"
          >
            <div className="p-3 border-b bg-white flex justify-between items-center shrink-0">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {depth === 0 ? "Root Categories" : "Subcategories"}
              </span>
              {depth > 0 && (
                <button 
                  onClick={() => setAddingTo(selectedPath[depth - 1])}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            
            <div className="p-2 overflow-y-auto flex-1 space-y-1">
              {column.map(cat => {
                const isSelected = selectedPath[depth] === cat.id;
                const hasChildren = depth < 3 && (cat.subcategories && cat.subcategories.length > 0);
                const isDeleting = deletingId === cat.id;
                const isConfirmingDelete = deleteConfirmingId === cat.id;
                
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleSelect(depth, cat.id)}
                    className={`
                      group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all border
                      ${isSelected 
                        ? "bg-blue-50 border-blue-200 shadow-sm" 
                        : "bg-white border-transparent hover:border-gray-200 hover:shadow-sm"
                      }
                    `}
                  >
                    <div 
                      className="flex-1 min-w-0" 
                      onDoubleClick={(e) => { 
                        e.stopPropagation(); 
                        if (!isDeleting && !isConfirmingDelete) openEditModal(cat);
                      }}
                    >
                      {isDeleting ? (
                        <div className="flex items-center justify-between bg-red-50 p-1.5 rounded-md border border-red-200" onClick={e => e.stopPropagation()}>
                          <span className="text-xs text-red-600 font-medium animate-pulse">Deleting in {deleteCountdown}s...</span>
                          <button onClick={cancelDelete} className="text-xs px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded text-gray-700 font-medium shadow-sm transition-colors">Cancel</button>
                        </div>
                      ) : isConfirmingDelete ? (
                        <div className="flex items-center gap-2 bg-red-50 p-1.5 rounded-md border border-red-200" onClick={e => e.stopPropagation()}>
                          <span className="text-xs text-red-600 font-bold flex-1">Delete forever?</span>
                          <button onClick={cancelDelete} className="text-xs px-2 py-1 bg-white hover:bg-gray-50 border border-gray-200 rounded text-gray-700 shadow-sm transition-colors">Cancel</button>
                          <button onClick={(e) => confirmDelete(e, cat.id)} className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium shadow-sm transition-colors">Confirm</button>
                        </div>
                      ) : (
                        <>
                          <div className={`text-sm font-medium truncate ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
                            {cat.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {cat.itemCount} items
                            {cat.sku && <span className="ml-1 text-gray-500 font-medium tracking-wide border-l border-gray-300 pl-1">SKU: {cat.sku}</span>}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {!isDeleting && !isConfirmingDelete && (
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity mr-1 shrink-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(cat);
                          }}
                          className="p-1 hover:bg-white rounded text-gray-400 hover:text-blue-600"
                          title="Edit Category"
                        >
                          <Settings2 size={14} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            initiateDelete(cat.id);
                          }}
                          className="p-1 hover:bg-white rounded text-gray-400 hover:text-red-600"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    <div className={`text-gray-400 transition-colors shrink-0 ${isSelected ? "text-blue-500" : ""}`}>
                      {hasChildren ? <ChevronRight size={16} /> : <div className="w-4" />}
                    </div>
                  </div>
                );
              })}
              
              {column.length === 0 && (
                <div className="text-center p-4 text-xs text-gray-400">
                  No categories found.
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Placeholder column if last selected item has no children */}
        {selectedPath.length > 0 && selectedPath.length < 4 && !currentList.find(c => c.id === selectedPath[selectedPath.length - 1])?.subcategories?.length && (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 text-gray-400 min-w-[200px]">
            <div className="bg-white p-4 rounded-full border shadow-sm mb-3">
              <Plus size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No subcategories</p>
            <button 
              onClick={() => setAddingTo(selectedPath[selectedPath.length - 1])}
              className="text-sm text-blue-600 mt-2 hover:underline"
            >
              Add subcategory here
            </button>
          </div>
        )}
      </div>

      {/* Sleek Add/Edit Modal */}
      {(addingTo !== undefined || editingCategory !== undefined) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-lg">
                {editingCategory ? "Edit Category" : addingTo === null ? "Add Category" : "Add Subcategory"}
              </h3>
              <button 
                onClick={resetModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleConfirmAdd} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input 
                  type="text" 
                  autoFocus
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Seasonal Specials"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU (Optional)
                </label>
                <input 
                  type="text" 
                  value={newCatSku}
                  onChange={e => setNewCatSku(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  placeholder="e.g. CAT-001"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetModal}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? "Update Category" : "Save Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
