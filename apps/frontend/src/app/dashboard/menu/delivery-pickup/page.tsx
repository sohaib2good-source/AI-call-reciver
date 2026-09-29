"use client";

import { useState, useEffect } from "react";
import { Button } from "@ai-restaurant/ui";
import {
  Truck,
  ShoppingBag,
  Clock,
  DollarSign,
  MapPin,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Copy,
  Check,
  Save,
  Lock,
  Power
} from "lucide-react";

export interface DeliveryPickupConfig {
  delivery: {
    enabled: boolean;
    deliveryRadiusKm: string;
    minimumOrder: string;
    standardDeliveryFee: string;
    estimatedDeliveryMins: string;
  };
  pickup: {
    enabled: boolean;
    preparationTimeMins: string;
    pickupInstructions: string;
  };
}

const STORAGE_KEY = "delivery_pickup_settings";

const INITIAL_CONFIG: DeliveryPickupConfig = {
  delivery: {
    enabled: true,
    deliveryRadiusKm: "5",
    minimumOrder: "20",
    standardDeliveryFee: "4.99",
    estimatedDeliveryMins: "45",
  },
  pickup: {
    enabled: true,
    preparationTimeMins: "20",
    pickupInstructions: "Please wait at the pickup counter with your order number.",
  },
};

export default function DeliveryPickupPage() {
  const [activeTab, setActiveTab] = useState<"delivery" | "pickup" | "json">("delivery");
  const [config, setConfig] = useState<DeliveryPickupConfig>(INITIAL_CONFIG);
  const [isCopied, setIsCopied] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setConfig(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse delivery config", e);
        }
      }
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!mounted) return null;

  const isDeliveryOn = config.delivery.enabled;
  const isPickupOn = config.pickup.enabled;

  const hasDeliveryTime = config.delivery.estimatedDeliveryMins.trim() !== "";
  const hasPickupTime = config.pickup.preparationTimeMins.trim() !== "";

  // The exact AI Agent script preview based on switch state & blank rule
  let deliveryAiResponse = "";
  if (!isDeliveryOn) {
    deliveryAiResponse =
      "[Delivery OFF]: The AI Agent will inform callers: \"I apologize, but our restaurant is currently not accepting delivery orders at this time.\"";
  } else if (hasDeliveryTime) {
    deliveryAiResponse = `Our estimated delivery time is approximately ${config.delivery.estimatedDeliveryMins} minutes${
      config.delivery.standardDeliveryFee ? ` with a $${config.delivery.standardDeliveryFee} delivery fee` : ""
    }${config.delivery.minimumOrder ? ` (minimum order: $${config.delivery.minimumOrder})` : ""}.`;
  } else {
    deliveryAiResponse =
      "[Space Left Blank]: The AI Agent will NOT state or quote any delivery duration to callers. If a customer asks how long it takes, the AI will say: \"Delivery times vary depending on current kitchen order volume and road traffic. Our team will keep you updated as soon as your order is dispatched.\"";
  }

  let pickupAiResponse = "";
  if (!isPickupOn) {
    pickupAiResponse =
      "[Pickup OFF]: The AI Agent will inform callers: \"I apologize, but pickup and takeaway orders are currently unavailable at this time.\"";
  } else if (hasPickupTime) {
    pickupAiResponse = `Pickup orders are typically ready in about ${config.pickup.preparationTimeMins} minutes. ${config.pickup.pickupInstructions}`;
  } else {
    pickupAiResponse =
      "[Space Left Blank]: The AI Agent will NOT tell any pickup time to callers. If asked, the AI will say: \"Your order will be prepared fresh, and our team will notify you as soon as it is ready for collection at our counter.\"";
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">
            Delivery & Pickup JSON settings saved & synced with AI Agent
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Delivery & Pickup</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              AI-Aligned JSON
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Toggle services ON or OFF. Turning OFF dulls all fields and locks editing, and instructs the AI to state service is unavailable.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("json")}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded-lg hover:bg-gray-50 text-gray-700 bg-white"
          >
            <Code2 size={15} />
            <span>Inspect JSON</span>
          </button>
          <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Save size={16} />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "delivery"
              ? "text-blue-600 border-blue-600 bg-blue-50/40 rounded-t-lg"
              : "text-gray-500 border-transparent hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("delivery")}
        >
          <Truck size={16} />
          <span>Delivery Settings</span>
          <span
            className={`w-2 h-2 rounded-full ml-1 ${isDeliveryOn ? "bg-emerald-500" : "bg-gray-400"}`}
          />
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "pickup"
              ? "text-blue-600 border-blue-600 bg-blue-50/40 rounded-t-lg"
              : "text-gray-500 border-transparent hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("pickup")}
        >
          <ShoppingBag size={16} />
          <span>Pickup Settings</span>
          <span
            className={`w-2 h-2 rounded-full ml-1 ${isPickupOn ? "bg-emerald-500" : "bg-gray-400"}`}
          />
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2.5 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "json"
              ? "text-purple-600 border-purple-600 bg-purple-50/40 rounded-t-lg"
              : "text-gray-500 border-transparent hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("json")}
        >
          <Code2 size={16} />
          <span>JSON Structure</span>
        </button>
      </div>

      {/* TAB 1: DELIVERY SETTINGS */}
      {activeTab === "delivery" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            {/* MASTER TOGGLE BAR FOR DELIVERY */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50/80 border border-gray-200">
              <div className="flex items-center gap-3.5">
                {/* Modern Switch */}
                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      delivery: { ...config.delivery, enabled: !config.delivery.enabled },
                    })
                  }
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isDeliveryOn ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={isDeliveryOn}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isDeliveryOn ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {isDeliveryOn ? "Delivery Service Enabled" : "Delivery Service Disabled"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        isDeliveryOn
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-gray-200 text-gray-700 border border-gray-300"
                      }`}
                    >
                      {isDeliveryOn ? "ON (Editable)" : "OFF (Dulled & Locked)"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isDeliveryOn
                      ? "Turn OFF to dull all fields and instruct AI to tell callers delivery is unavailable."
                      : "Turn ON to unlock fields and allow customer delivery orders."}
                  </p>
                </div>
              </div>

              {!isDeliveryOn && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0">
                  <Lock size={13} />
                  <span>Fields Locked</span>
                </div>
              )}
            </div>

            {/* DULL / LOCK WARNING BANNER WHEN OFF */}
            {!isDeliveryOn && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs leading-relaxed animate-in fade-in duration-200">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Delivery Service is Currently OFF</strong>
                  Nothing below is editable. All input fields are dulled and protected from modification. Callers asking about delivery will be informed that delivery is unavailable. Click the switch above to <strong>ON</strong> to make edits.
                </div>
              </div>
            )}

            {/* FORM FIELDS (DULLED WHEN OFF) */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-5 transition-all duration-200 ${
                isDeliveryOn
                  ? "opacity-100"
                  : "opacity-40 pointer-events-none select-none filter grayscale-[35%]"
              }`}
            >
              {/* Delivery Radius */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-500" />
                  <span>Delivery Radius (km)</span>
                </label>
                <input
                  disabled={!isDeliveryOn}
                  type="number"
                  step="0.5"
                  min="0"
                  value={config.delivery.deliveryRadiusKm}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      delivery: { ...config.delivery, deliveryRadiusKm: e.target.value },
                    })
                  }
                  placeholder="e.g. 5 (leave blank if unrestricted)"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">Leave blank if no strict kilometer radius is enforced.</p>
              </div>

              {/* Minimum Order */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-blue-500" />
                  <span>Minimum Order ($)</span>
                </label>
                <input
                  disabled={!isDeliveryOn}
                  type="number"
                  step="0.5"
                  min="0"
                  value={config.delivery.minimumOrder}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      delivery: { ...config.delivery, minimumOrder: e.target.value },
                    })
                  }
                  placeholder="e.g. 20 (leave blank if no minimum)"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">Leave blank if orders of any subtotal are accepted.</p>
              </div>

              {/* Standard Delivery Fee */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-blue-500" />
                  <span>Standard Delivery Fee ($)</span>
                </label>
                <input
                  disabled={!isDeliveryOn}
                  type="number"
                  step="0.01"
                  min="0"
                  value={config.delivery.standardDeliveryFee}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      delivery: { ...config.delivery, standardDeliveryFee: e.target.value },
                    })
                  }
                  placeholder="e.g. 4.99"
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">Base delivery fee added to checkout total.</p>
              </div>

              {/* Estimated Delivery Time (mins) */}
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" />
                    <span>Estimated Delivery Time (mins)</span>
                  </label>
                  {hasDeliveryTime && isDeliveryOn ? (
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={11} /> AI Will Tell
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle size={11} /> {isDeliveryOn ? "Left Blank (AI Muted)" : "Service Disabled"}
                    </span>
                  )}
                </div>
                <input
                  disabled={!isDeliveryOn}
                  type="number"
                  min="0"
                  value={config.delivery.estimatedDeliveryMins}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      delivery: { ...config.delivery, estimatedDeliveryMins: e.target.value },
                    })
                  }
                  placeholder="e.g. 45 (or leave empty)"
                  className="w-full border border-blue-300 rounded-lg px-3.5 py-2 text-sm bg-white font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="text-[11px] text-blue-800 mt-1.5 leading-relaxed">
                  <strong>AI Policy:</strong> If filled, AI will quote this time to callers. If left blank, the AI Agent will strictly <strong>not tell any delivery time</strong> to callers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PICKUP SETTINGS */}
      {activeTab === "pickup" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            {/* MASTER TOGGLE BAR FOR PICKUP */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50/80 border border-gray-200">
              <div className="flex items-center gap-3.5">
                {/* Modern Switch */}
                <button
                  type="button"
                  onClick={() =>
                    setConfig({
                      ...config,
                      pickup: { ...config.pickup, enabled: !config.pickup.enabled },
                    })
                  }
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isPickupOn ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                  role="switch"
                  aria-checked={isPickupOn}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isPickupOn ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {isPickupOn ? "Pickup Counter Service Enabled" : "Pickup Counter Service Disabled"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        isPickupOn
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-gray-200 text-gray-700 border border-gray-300"
                      }`}
                    >
                      {isPickupOn ? "ON (Editable)" : "OFF (Dulled & Locked)"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isPickupOn
                      ? "Turn OFF to dull all fields and instruct AI to inform callers pickup is unavailable."
                      : "Turn ON to unlock fields and allow customer counter pickups."}
                  </p>
                </div>
              </div>

              {!isPickupOn && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0">
                  <Lock size={13} />
                  <span>Fields Locked</span>
                </div>
              )}
            </div>

            {/* DULL / LOCK WARNING BANNER WHEN OFF */}
            {!isPickupOn && (
              <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs leading-relaxed animate-in fade-in duration-200">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold mb-0.5">Pickup Counter Service is Currently OFF</strong>
                  Nothing below is editable. All input fields are dulled and protected from modification. Callers asking for takeaway or pickup will be told it is currently unavailable. Click the switch above to <strong>ON</strong> to make edits.
                </div>
              </div>
            )}

            {/* FORM FIELDS (DULLED WHEN OFF) */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-5 transition-all duration-200 ${
                isPickupOn
                  ? "opacity-100"
                  : "opacity-40 pointer-events-none select-none filter grayscale-[35%]"
              }`}
            >
              {/* Preparation Time (mins) */}
              <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-200 sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={14} className="text-purple-600" />
                    <span>Kitchen Preparation Time (mins)</span>
                  </label>
                  {hasPickupTime && isPickupOn ? (
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={11} /> AI Will Tell
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle size={11} /> {isPickupOn ? "Left Blank (AI Muted)" : "Service Disabled"}
                    </span>
                  )}
                </div>
                <input
                  disabled={!isPickupOn}
                  type="number"
                  min="0"
                  value={config.pickup.preparationTimeMins}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pickup: { ...config.pickup, preparationTimeMins: e.target.value },
                    })
                  }
                  placeholder="e.g. 20 (or leave empty)"
                  className="w-full border border-purple-300 rounded-lg px-3.5 py-2 text-sm bg-white font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="text-[11px] text-purple-800 mt-1.5 leading-relaxed">
                  <strong>AI Policy:</strong> If filled, AI will quote this preparation time when callers ask. If left blank, the AI Agent will strictly <strong>not tell any pickup ready time</strong>.
                </p>
              </div>

              {/* Pickup Instructions */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Pickup Instructions to Customer
                </label>
                <textarea
                  disabled={!isPickupOn}
                  rows={2}
                  value={config.pickup.pickupInstructions}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      pickup: { ...config.pickup, pickupInstructions: e.target.value },
                    })
                  }
                  placeholder="e.g. Please wait at the front counter with your order number."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">Read by AI Agent upon finalizing a phone pickup order.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JSON STRUCTURE INSPECTOR */}
      {activeTab === "json" && (
        <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 size={18} className="text-purple-400" />
              <h3 className="font-mono text-sm font-semibold">AI_FULFILLMENT_SCHEMA.json</h3>
            </div>
            <button
              onClick={copyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 transition-colors"
            >
              {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{isCopied ? "Copied!" : "Copy JSON"}</span>
            </button>
          </div>

          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-4 bg-gray-950 rounded-xl leading-relaxed">
            {JSON.stringify(
              {
                tenantFulfillmentConfig: {
                  delivery: {
                    enabled: config.delivery.enabled,
                    radiusKm: config.delivery.deliveryRadiusKm ? parseFloat(config.delivery.deliveryRadiusKm) : null,
                    minimumOrderUsd: config.delivery.minimumOrder ? parseFloat(config.delivery.minimumOrder) : null,
                    standardFeeUsd: config.delivery.standardDeliveryFee ? parseFloat(config.delivery.standardDeliveryFee) : null,
                    estimatedDeliveryMins: hasDeliveryTime && isDeliveryOn ? parseInt(config.delivery.estimatedDeliveryMins) : null,
                  },
                  pickup: {
                    enabled: config.pickup.enabled,
                    preparationTimeMins: hasPickupTime && isPickupOn ? parseInt(config.pickup.preparationTimeMins) : null,
                    instructions: config.pickup.pickupInstructions || null,
                  },
                  aiPolicyRules: {
                    allowDisclosingDeliveryTime: hasDeliveryTime && isDeliveryOn,
                    allowDisclosingPickupTime: hasPickupTime && isPickupOn,
                    isDeliveryOff: !isDeliveryOn,
                    isPickupOff: !isPickupOn,
                    fallbackBehaviorIfBlank: "STRICT_SILENCE: Do not quote duration if field is null/blank or service is off.",
                  },
                },
              },
              null,
              2
            )}
          </pre>
        </div>
      )}

      {/* LIVE AI AGENT BEHAVIOR PREVIEW CARD (Visible on all tabs) */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Live AI Agent Phone Voice Simulation</h3>
              <p className="text-xs text-gray-500">Preview what callers hear when asking fulfillment questions.</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            Real-Time Audio Script
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Caller Question 1: Delivery Time */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Caller: "How much time is required for delivery?"</span>
              {!isDeliveryOn ? (
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  Delivery OFF
                </span>
              ) : hasDeliveryTime ? (
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  Time Quoted
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Time Withheld (Blank)
                </span>
              )}
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 text-gray-800 leading-relaxed font-medium">
              🎙️ AI: "{deliveryAiResponse}"
            </div>
          </div>

          {/* Caller Question 2: Pickup Prep Time */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Caller: "When will my pickup order be ready?"</span>
              {!isPickupOn ? (
                <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                  Pickup OFF
                </span>
              ) : hasPickupTime ? (
                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  Time Quoted
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Time Withheld (Blank)
                </span>
              )}
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200 text-gray-800 leading-relaxed font-medium">
              🎙️ AI: "{pickupAiResponse}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
