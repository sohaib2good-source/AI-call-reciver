// Centralized Menu Store for AI Restaurant Receptionist
// Provides reactive cross-page synchronization via LocalStorage & Custom Events

export interface MenuItem {
  id: string;
  name: string;
  sku: string;
  categoryPath: string[]; // e.g. ["Main Course", "Burgers"]
  price: string;
  description?: string;
  tags: string[]; // e.g. ["Halal", "Vegan", "Gluten Free", "Chef Special", "Spicy"]
  status: "Active" | "Out of Stock" | "Draft";
  addons: string[]; // array of addon ids
  aiVoiceNote?: string; // Guidance for AI Receptionist when describing dish to caller
  createdAt: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  subcategories?: MenuCategory[];
}

export interface MenuAddon {
  id: string;
  name: string;
  price: number;
}

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Classic Gourmet Cheeseburger",
    sku: "ITEM-1001",
    categoryPath: ["Main Course", "Burgers"],
    price: "13.99",
    description: "Prime Angus beef patty, melted aged cheddar, crisp lettuce, vine-ripened tomatoes, and house aioli on a toasted brioche bun.",
    tags: ["Popular", "Halal"],
    status: "Active",
    addons: ["1", "2", "3", "5"],
    aiVoiceNote: "Our #1 best-selling burger, made with 100% Halal Angus beef.",
    createdAt: "2026-09-01T10:00:00.000Z"
  },
  {
    id: "item-2",
    name: "Artisan Truffle Mushroom Pizza",
    sku: "ITEM-1002",
    categoryPath: ["Main Course", "Pizzas"],
    price: "18.50",
    description: "Hand-stretched sourdough crust, wild forest mushrooms, truffle cream sauce, fresh fior di latte mozzarella, and fresh thyme.",
    tags: ["Vegetarian", "Chef Special"],
    status: "Active",
    addons: ["1", "10"],
    aiVoiceNote: "Signature wood-fired artisan pizza with authentic white truffle essence.",
    createdAt: "2026-09-01T10:05:00.000Z"
  },
  {
    id: "item-3",
    name: "Fiery Buffalo Wings (8 pcs)",
    sku: "ITEM-1003",
    categoryPath: ["Starters"],
    price: "10.99",
    description: "Crispy jumbo chicken wings tossed in tangy house hot glaze, served with cool ranch dip and celery sticks.",
    tags: ["Halal", "Spicy Level 3"],
    status: "Active",
    addons: ["12", "13"],
    aiVoiceNote: "Spicy and tangy, gluten-free upon request.",
    createdAt: "2026-09-01T10:10:00.000Z"
  },
  {
    id: "item-4",
    name: "Creamy Chicken Alfredo Pasta",
    sku: "ITEM-1004",
    categoryPath: ["Main Course", "Pasta"],
    price: "16.25",
    description: "Fettuccine tossed in rich garlic parmesan cream sauce, topped with sliced grilled herb chicken breast and freshly cracked black pepper.",
    tags: ["Halal"],
    status: "Active",
    addons: ["1", "6"],
    aiVoiceNote: "Hearty Italian classic made with real heavy cream and 24-month aged parmesan.",
    createdAt: "2026-09-01T10:15:00.000Z"
  },
  {
    id: "item-5",
    name: "Crispy Calamari Rings",
    sku: "ITEM-1005",
    categoryPath: ["Starters"],
    price: "11.50",
    description: "Lightly battered tender calamari seasoned with lemon pepper, served with spicy marinara and garlic lemon aioli.",
    tags: ["Seafood"],
    status: "Active",
    addons: ["14"],
    aiVoiceNote: "Light, crispy starter, best paired with chilled beverages.",
    createdAt: "2026-09-01T10:20:00.000Z"
  },
  {
    id: "item-6",
    name: "Molten Belgian Lava Cake",
    sku: "ITEM-1006",
    categoryPath: ["Desserts"],
    price: "8.99",
    description: "Warm dark chocolate sponge cake with an oozing molten center, dusted with powdered sugar and served with vanilla gelato.",
    tags: ["Vegetarian", "Popular"],
    status: "Active",
    addons: [],
    aiVoiceNote: "Baked fresh to order, please allow 10 minutes prep time.",
    createdAt: "2026-09-01T10:25:00.000Z"
  },
  {
    id: "item-7",
    name: "Fresh Mint Lemonade Cooler",
    sku: "ITEM-1007",
    categoryPath: ["Beverages", "Cold Drinks"],
    price: "5.50",
    description: "Freshly squeezed lemons, crushed garden mint, chilled sparkling water, and pure cane syrup over crushed ice.",
    tags: ["Vegan", "Gluten Free"],
    status: "Active",
    addons: [],
    aiVoiceNote: "Refreshing house specialty mocktail, great palate cleanser.",
    createdAt: "2026-09-01T10:30:00.000Z"
  },
  {
    id: "item-8",
    name: "Spicy Jalapeno Smash Burger",
    sku: "ITEM-1008",
    categoryPath: ["Main Course", "Burgers"],
    price: "14.50",
    description: "Double smashed patties with seared pickled jalapenos, pepper jack cheese, and chipotle crema.",
    tags: ["Halal", "Spicy Level 2"],
    status: "Out of Stock",
    addons: ["1", "2", "8"],
    aiVoiceNote: "Currently marked out of stock by kitchen manager.",
    createdAt: "2026-09-01T10:35:00.000Z"
  }
];

export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: "cat-1", name: "Starters", subcategories: [] },
  {
    id: "cat-2",
    name: "Main Course",
    subcategories: [
      { id: "cat-2-1", name: "Burgers" },
      { id: "cat-2-2", name: "Pizzas" },
      { id: "cat-2-3", name: "Pasta" }
    ]
  },
  { id: "cat-3", name: "Desserts", subcategories: [] },
  {
    id: "cat-4",
    name: "Beverages",
    subcategories: [
      { id: "cat-4-1", name: "Hot Drinks" },
      { id: "cat-4-2", name: "Cold Drinks" }
    ]
  }
];

export const INITIAL_ADDONS: MenuAddon[] = [
  { id: "1", name: "Extra Melted Cheese", price: 1.50 },
  { id: "2", name: "Beef Bacon Strips", price: 2.25 },
  { id: "3", name: "Fresh Hass Avocado", price: 1.75 },
  { id: "4", name: "Gluten-Free Bun", price: 2.50 },
  { id: "5", name: "Extra Angus Patty", price: 4.50 },
  { id: "6", name: "Sauteed Mushrooms", price: 1.25 },
  { id: "7", name: "Caramelized Onions", price: 0.95 },
  { id: "8", name: "Pickled Jalapenos", price: 0.75 },
  { id: "9", name: "Fried Farm Egg", price: 1.50 },
  { id: "10", name: "White Truffle Oil Drizzle", price: 3.00 },
  { id: "11", name: "Vegan Cheddar Slice", price: 2.00 },
  { id: "12", name: "House Ranch Dip", price: 0.75 },
  { id: "13", name: "Smoky BBQ Glaze", price: 0.75 },
  { id: "14", name: "Roasted Garlic Aioli", price: 0.85 },
];

const ITEMS_STORAGE_KEY = "menu_items";
const CATEGORIES_STORAGE_KEY = "menu_categories";
const ADDONS_STORAGE_KEY = "menu_addons";
const EVENT_ITEMS_UPDATED = "menu_items_updated";

// Helper: Get Items
export function getStoredMenuItems(): MenuItem[] {
  if (typeof window === "undefined") return INITIAL_MENU_ITEMS;
  try {
    const raw = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(INITIAL_MENU_ITEMS));
      return INITIAL_MENU_ITEMS;
    }
    const parsed = JSON.parse(raw);
    // Ensure all items have necessary fields
    return parsed.map((item: any, idx: number) => ({
      id: item.id || `item-${idx + 1}`,
      name: item.name || "Untitled Item",
      sku: item.sku || `ITEM-${1000 + idx}`,
      categoryPath: Array.isArray(item.categoryPath) ? item.categoryPath : ["Main Course"],
      price: String(item.price || "0.00"),
      description: item.description || "",
      tags: Array.isArray(item.tags) ? item.tags : [],
      status: item.status || "Active",
      addons: Array.isArray(item.addons) ? item.addons : [],
      aiVoiceNote: item.aiVoiceNote || "",
      createdAt: item.createdAt || new Date().toISOString()
    }));
  } catch (err) {
    console.error("Failed to load menu items from storage", err);
    return INITIAL_MENU_ITEMS;
  }
}

// Helper: Save Items & Notify
export function saveStoredMenuItems(items: MenuItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(EVENT_ITEMS_UPDATED, { detail: items }));
  } catch (err) {
    console.error("Failed to save menu items", err);
  }
}

// Helper: Add or Update Item
export function upsertMenuItem(item: Partial<MenuItem> & { name: string; price: string }): MenuItem {
  const current = getStoredMenuItems();
  let updatedItem: MenuItem;

  if (item.id) {
    const index = current.findIndex(i => i.id === item.id);
    if (index >= 0) {
      updatedItem = {
        ...current[index],
        ...item,
      };
      current[index] = updatedItem;
    } else {
      updatedItem = {
        id: item.id,
        name: item.name,
        sku: item.sku || `ITEM-${1000 + current.length + 1}`,
        categoryPath: item.categoryPath || ["Main Course"],
        price: item.price,
        description: item.description || "",
        tags: item.tags || [],
        status: item.status || "Active",
        addons: item.addons || [],
        aiVoiceNote: item.aiVoiceNote || "",
        createdAt: new Date().toISOString()
      };
      current.unshift(updatedItem);
    }
  } else {
    updatedItem = {
      id: `item-${Date.now()}`,
      name: item.name,
      sku: item.sku || `ITEM-${1000 + current.length + 1}`,
      categoryPath: item.categoryPath || ["Main Course"],
      price: item.price,
      description: item.description || "",
      tags: item.tags || [],
      status: item.status || "Active",
      addons: item.addons || [],
      aiVoiceNote: item.aiVoiceNote || "",
      createdAt: new Date().toISOString()
    };
    current.unshift(updatedItem);
  }

  saveStoredMenuItems(current);
  return updatedItem;
}

// Helper: Delete Item
export function deleteMenuItem(id: string): void {
  const current = getStoredMenuItems();
  const filtered = current.filter(i => i.id !== id);
  saveStoredMenuItems(filtered);
}

// Helper: Toggle Item Status
export function toggleMenuItemStatus(id: string): MenuItem | null {
  const current = getStoredMenuItems();
  const item = current.find(i => i.id === id);
  if (!item) return null;
  item.status = item.status === "Active" ? "Out of Stock" : "Active";
  saveStoredMenuItems(current);
  return item;
}

// Helper: Categories
export function getStoredCategories(): MenuCategory[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CATEGORIES;
  }
}

// Helper: Add-ons
export function getStoredAddons(): MenuAddon[] {
  if (typeof window === "undefined") return INITIAL_ADDONS;
  try {
    const raw = localStorage.getItem(ADDONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ADDONS_STORAGE_KEY, JSON.stringify(INITIAL_ADDONS));
      return INITIAL_ADDONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ADDONS;
  }
}

// Helper: Calculate Item Count for Category (Recursive)
export function calculateCategoryItemCount(categoryName: string, items: MenuItem[]): number {
  return items.filter(item => item.categoryPath && item.categoryPath.includes(categoryName)).length;
}

// Event Subscription Helper
export function onMenuItemsUpdated(callback: (items: MenuItem[]) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<MenuItem[]>;
    callback(customEvent.detail || getStoredMenuItems());
  };
  window.addEventListener(EVENT_ITEMS_UPDATED, handler);
  return () => window.removeEventListener(EVENT_ITEMS_UPDATED, handler);
}
