"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@ai-restaurant/ui";
import {
  Phone,
  PhoneCall,
  MessageSquare,
  Mic,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  Radio,
  ArrowRight,
  Info,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";

interface PhoneNumberRecord {
  id: string;
  number: string;
  friendlyName: string;
  provider: "TWILIO" | "VAPI" | "RETELL" | "WHATSAPP";
  capabilities: string[];
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  webhookUrl: string;
  assignedRestaurant: string;
  forwardNumber?: string;
}

export default function PhoneNumbersPage() {
  const [numbers, setNumbers] = useState<PhoneNumberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [appBaseUrl, setAppBaseUrl] = useState("https://aireceiver.vortexlabsworld.com");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNumber, setEditNumber] = useState("");
  const [editName, setEditName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [newProvider, setNewProvider] = useState<"TWILIO" | "VAPI" | "WHATSAPP">("TWILIO");

  const fetchNumbers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/voice/numbers");
      const data = await res.json();
      if (data.success && Array.isArray(data.numbers)) {
        setNumbers(data.numbers);
      }
    } catch (e) {
      console.error("Error fetching numbers:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
    if (typeof window !== "undefined") {
      const detected =
        process.env.NEXT_PUBLIC_APP_URL ||
        (window.location.origin.includes("localhost")
          ? "https://aireceiver.vortexlabsworld.com"
          : window.location.origin);
      setAppBaseUrl(detected);
    }
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const res = await fetch("/api/voice/numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          numberData: { id, number: editNumber, friendlyName: editName },
        }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchNumbers();
      }
    } catch (e) {
      console.error("Update failed:", e);
    }
  };

  const handleAddNumber = async () => {
    if (!newNumber.trim()) return;
    try {
      const res = await fetch("/api/voice/numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          numberData: {
            number: newNumber,
            friendlyName: newName || "New Inbound Line",
            provider: newProvider,
            capabilities: newProvider === "WHATSAPP" ? ["TEXT", "VOICE_NOTES"] : ["VOICE", "SMS"],
            webhookUrl:
              newProvider === "WHATSAPP"
                ? "/api/whatsapp/webhook"
                : "/webhook/voice/twilio/incoming",
            status: "ACTIVE",
          },
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewNumber("");
        setNewName("");
        fetchNumbers();
      }
    } catch (e) {
      console.error("Add failed:", e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/voice/numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", numberData: { id } }),
      });
      if (res.ok) {
        fetchNumbers();
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Phone className="w-6 h-6 text-emerald-600" />
            Phone Numbers & Channels
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Configure how customers reach your AI Receptionist: Cellular Voice Dialing, WhatsApp Messaging, or Browser Live Audio.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/test-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 text-sm font-semibold">
              <Mic className="w-4 h-4" /> Live Voice Test Center
            </Button>
          </Link>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> Add Phone Number
          </Button>
        </div>
      </div>

      {/* Crucial Channel Architecture Clarification Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
            <PhoneCall className="w-4 h-4 text-blue-600" />
            1. Mobile SIM / Cellular Calling (Twilio + ElevenLabs)
          </div>
          <p className="text-xs text-blue-900 leading-relaxed">
            <strong>Number Provider:</strong> Twilio &bull; <strong>Voice Engine:</strong> ElevenLabs Conversational AI (<code className="bg-blue-100 text-blue-900 px-1 py-0.5 rounded text-[10px]">agent_2001m4ha09d9e88bn4c0vmjzh0rw</code>)<br />
            <strong>How it works:</strong> Callers dial your Twilio number from any mobile or landline. Twilio streams audio directly to ElevenLabs Conversational AI via bidirectional WebSockets for human-like natural conversation.
          </p>
          <div className="mt-3 text-[11px] font-mono bg-blue-100/70 text-blue-800 p-1.5 rounded flex items-center justify-between">
            <span className="truncate">{`${appBaseUrl}/api/voice/twilio/incoming`}</span>
            <button
              onClick={() => handleCopy(`${appBaseUrl}/api/voice/twilio/incoming`, "tw_wh")}
              className="hover:text-blue-950 font-sans text-[10px] font-bold underline ml-2 shrink-0"
            >
              {copiedKey === "tw_wh" ? "Copied!" : "Copy URL"}
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            2. WhatsApp Business Channel
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            <strong>How it works:</strong> WhatsApp numbers <strong>cannot</strong> be dialed over cellular SIM networks. Customers open WhatsApp and send <strong>chat messages</strong> or <strong>Voice Notes</strong> (push-to-talk audio). The AI responds automatically.
          </p>
          <div className="mt-3">
            <Link
              href="/dashboard/whatsapp"
              className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              Open WhatsApp Manager <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-purple-800 font-bold text-sm mb-2">
            <Mic className="w-4 h-4 text-purple-600" />
            3. Instant Web Microphone Test
          </div>
          <p className="text-xs text-purple-900 leading-relaxed">
            <strong>Test right now without buying a carrier number:</strong> Open the Voice Test Center on your phone or PC browser. Press the mic button and speak directly to the AI Receptionist for <em>Biryani Master Link Road</em>.
          </p>
          <div className="mt-3">
            <Link
              href="/dashboard/test-center"
              className="text-xs text-purple-700 font-semibold hover:underline flex items-center gap-1"
            >
              Launch Live Test Now <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Numbers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-900 text-sm">Active Numbers & Inbound Gateways</h2>
            <p className="text-xs text-gray-500">All telephone numbers assigned to your restaurant tenant.</p>
          </div>
          <button
            onClick={fetchNumbers}
            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2.5 py-1 rounded border bg-white"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b text-gray-600 text-xs">
            <tr>
              <th className="p-4 font-semibold">Phone Number</th>
              <th className="p-4 font-semibold">Channel / Name</th>
              <th className="p-4 font-semibold">Provider</th>
              <th className="p-4 font-semibold">Capabilities</th>
              <th className="p-4 font-semibold">Webhook Destination</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-gray-800">
            {numbers.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-bold text-gray-900">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1 text-sm font-mono w-44"
                      value={editNumber}
                      onChange={(e) => setEditNumber(e.target.value)}
                    />
                  ) : (
                    <span>{item.number}</span>
                  )}
                </td>
                <td className="p-4">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      className="border rounded px-2 py-1 text-sm w-44"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">{item.friendlyName}</div>
                      <div className="text-[11px] text-gray-400">{item.assignedRestaurant}</div>
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.provider === "TWILIO"
                        ? "bg-blue-100 text-blue-800"
                        : item.provider === "WHATSAPP"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {item.provider}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {item.capabilities.map((cap) => (
                      <span
                        key={cap}
                        className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-mono"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-xs font-mono text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span>{item.webhookUrl}</span>
                    <button
                      onClick={() => handleCopy(item.webhookUrl, `wh_${item.id}`)}
                      className="text-gray-400 hover:text-gray-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedKey === `wh_${item.id}` && (
                      <span className="text-[10px] text-emerald-600 font-sans font-bold">Copied!</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ACTIVE
                  </span>
                </td>
                <td className="p-4 text-right">
                  {editingId === item.id ? (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="text-xs bg-emerald-600 text-white px-2 py-1 rounded font-medium hover:bg-emerald-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs text-gray-500 px-2 py-1 rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditNumber(item.number);
                          setEditName(item.friendlyName);
                        }}
                        className="text-gray-500 hover:text-blue-600 p-1"
                        title="Edit Number"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {item.id !== "num_twilio_1" && item.id !== "num_wa_1" && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How to configure Twilio step-by-step for real mobile calling */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Step-by-Step: How to Make Your Real Mobile Phone Call Ring the AI Receptionist
        </h3>
        <ol className="list-decimal list-inside space-y-2.5 text-sm text-gray-700 pl-2">
          <li>
            <strong>Get a Twilio Phone Number</strong> (e.g. from <a href="https://console.twilio.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium inline-flex items-center gap-0.5">Twilio Console <ExternalLink className="w-3 h-3" /></a>). A Twilio number can receive standard phone calls from any mobile phone in the world.
          </li>
          <li>
            <strong>In Twilio Console:</strong> Click <em>Phone Numbers &rarr; Manage &rarr; Active Numbers</em> &rarr; click your number.
          </li>
          <li>
            Under <strong>Voice Configuration &rarr; A CALL COMES IN</strong>, select <strong>Webhook</strong> and enter:
            <div className="mt-1 font-mono text-xs bg-blue-50 border border-blue-200 p-2.5 rounded-lg text-blue-800 flex items-center justify-between max-w-xl">
              <span className="truncate font-semibold">{`${appBaseUrl}/api/voice/twilio/incoming`}</span>
              <button
                onClick={() =>
                  handleCopy(
                    `${appBaseUrl}/api/voice/twilio/incoming`,
                    "guide_wh"
                  )
                }
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold px-3 py-1 rounded ml-2 shrink-0 transition-colors"
              >
                {copiedKey === "guide_wh" ? "Copied!" : "Copy Webhook URL"}
              </button>
            </div>
          </li>
          <li>
            <strong>Pick up your mobile phone</strong>, dial the Twilio phone number from your regular phone keypad, and press Call.
          </li>
          <li>
            Your AI Receptionist will immediately answer, greet you with <em>"Thank you for calling biryani master link road..."</em>, and converse naturally in real time!
          </li>
        </ol>
      </div>

      {/* Add Number Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">Add Inbound Line</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (E.164 format)</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="w-full border rounded-lg p-2 text-sm font-mono"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Friendly Name</label>
                <input
                  type="text"
                  placeholder="e.g. Biryani Master Main Inbound"
                  className="w-full border rounded-lg p-2 text-sm"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Provider Type</label>
                <select
                  className="w-full border rounded-lg p-2 text-sm"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value as any)}
                >
                  <option value="TWILIO">Twilio (Cellular Voice & SMS)</option>
                  <option value="VAPI">Vapi (AI Voice Gateway)</option>
                  <option value="WHATSAPP">WhatsApp Cloud API (Chat & Voice Notes)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddNumber}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Number
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
