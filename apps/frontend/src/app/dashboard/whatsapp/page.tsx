"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Phone,
  PhoneCall,
  PhoneIncoming,
  Volume2,
  Play,
  Square,
  Check,
  Copy,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  ExternalLink,
  Loader2,
  Bot,
  HelpCircle,
  RefreshCw,
  Radio,
  Clock,
  ArrowRight,
  Send,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@ai-restaurant/ui";

interface WhatsAppConfig {
  phoneNumberId: string;
  businessAccountId: string;
  verifyToken: string;
  accessToken?: string;
  autoPickCalls: boolean;
  voiceRepliesEnabled: boolean;
  businessName: string;
  compiledGreeting: string;
  activePersona: string;
  transferPhoneNumber: string;
  webhookUrl: string;
}

interface WhatsAppLog {
  id: string;
  callId: string;
  callerNumber: string;
  type: "CALL" | "VOICE_NOTE" | "TEXT_MESSAGE";
  direction: string;
  status: string;
  timestamp: string;
  durationSeconds: number;
  callerInput: string;
  agentResponse: string;
  outcome: string;
  audioUrl?: string;
}

export default function WhatsAppIntegrationPage() {
  const [config, setConfig] = useState<WhatsAppConfig>({
    phoneNumberId: "1284705801403358",
    businessAccountId: "1689894745896050",
    verifyToken: "my_super_secret_verify_token_123",
    autoPickCalls: true,
    voiceRepliesEnabled: true,
    businessName: "biryani master link road",
    compiledGreeting:
      "Thank you for calling biryani master link road. How may I assist you with your order, reservation, or appointment today?",
    activePersona: "female_receptionist",
    transferPhoneNumber: "+1 (555) 019-2834",
    webhookUrl: "/api/whatsapp/webhook",
  });

  const [logs, setLogs] = useState<WhatsAppLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showMetaGuide, setShowMetaGuide] = useState(false);

  // Simulation state
  const [simCallerNumber, setSimCallerNumber] = useState("+1 (555) 849-2041");
  const [simQuery, setSimQuery] = useState(
    "Hi, I would like to reserve a table for 4 guests tonight at 8 PM at Biryani Master Link Road."
  );
  const [isSimulatingCall, setIsSimulatingCall] = useState(false);
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const [simResult, setSimResult] = useState<{
    type: string;
    agentResponse: string;
    audioUrl?: string;
  } | null>(null);

  // Audio player
  const [playingLogId, setPlayingLogId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchConfigAndLogs();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const fetchConfigAndLogs = async () => {
    try {
      setLoading(true);
      const [configRes, logsRes] = await Promise.all([
        fetch("/api/whatsapp/config"),
        fetch("/api/whatsapp/logs"),
      ]);

      if (configRes.ok) {
        const cData = await configRes.json();
        if (cData.success && cData.config) {
          setConfig((prev) => ({ ...prev, ...cData.config }));
        }
      }

      if (logsRes.ok) {
        const lData = await logsRes.json();
        if (lData.success && Array.isArray(lData.logs)) {
          setLogs(lData.logs);
        }
      }
    } catch (err) {
      console.warn("Could not load WhatsApp initial state:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, isUrl: boolean) => {
    const fullText = isUrl ? `${window.location.origin}${text}` : text;
    navigator.clipboard.writeText(fullText);
    if (isUrl) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/whatsapp/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlayAudio = (id: string, url?: string, fallbackText?: string) => {
    if (playingLogId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingLogId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    const speakWithFallback = () => {
      if (fallbackText && typeof window !== "undefined" && "speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(fallbackText);
        u.onstart = () => setPlayingLogId(id);
        u.onend = () => setPlayingLogId(null);
        u.onerror = () => setPlayingLogId(null);
        window.speechSynthesis.speak(u);
      } else {
        setPlayingLogId(null);
      }
    };

    if (url && (url.startsWith("data:audio") || url.startsWith("http"))) {
      try {
        const audio = new Audio(url);
        audioRef.current = audio;
        setPlayingLogId(id);
        audio.onended = () => setPlayingLogId(null);
        audio.onerror = () => speakWithFallback();
        audio.play().catch(() => speakWithFallback());
        return;
      } catch {
        speakWithFallback();
        return;
      }
    }

    speakWithFallback();
  };

  const handleSimulateCall = async () => {
    try {
      setIsSimulatingCall(true);
      setSimResult(null);

      const res = await fetch("/api/whatsapp/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "incoming_call",
          callerNumber: simCallerNumber,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSimResult({
          type: "INCOMING_CALL_ANSWERED",
          agentResponse: data.agentResponse,
          audioUrl: data.audioUrl,
        });

        // Play exact agent greeting audio
        handlePlayAudio("sim_active", data.audioUrl, data.agentResponse);

        // Refresh log list
        fetchConfigAndLogs();
      }
    } catch (err) {
      console.error("Call simulation failed:", err);
    } finally {
      setIsSimulatingCall(false);
    }
  };

  const handleSimulateVoiceNote = async () => {
    if (!simQuery.trim()) return;
    try {
      setIsSimulatingVoice(true);
      setSimResult(null);

      const res = await fetch("/api/whatsapp/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "voice_note",
          callerNumber: simCallerNumber,
          userInput: simQuery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSimResult({
          type: "VOICE_NOTE_PROCESSED",
          agentResponse: data.agentResponse,
          audioUrl: data.audioUrl,
        });

        if (data.audioUrl) {
          handlePlayAudio("sim_active", data.audioUrl);
        }

        fetchConfigAndLogs();
      }
    } catch (err) {
      console.error("Voice note simulation failed:", err);
    } finally {
      setIsSimulatingVoice(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-16">
      {/* Page Title & Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
              <PhoneCall size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  WhatsApp Voice &amp; Calling Receptionist
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Meta Cloud API
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Connect your WhatsApp Business number so incoming voice calls and voice notes are automatically answered by your AI Receptionist.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchConfigAndLogs}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-gray-700 shadow-2xs transition"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 text-xs rounded-lg shadow-sm cursor-pointer"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            <span>{isSaving ? "Saving..." : "Save Settings"}</span>
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>WhatsApp Receptionist Settings saved and active for live calls!</span>
        </div>
      )}

      {/* 1. META CONNECTION STATUS CARD */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Connected to Meta WhatsApp Cloud API
              </span>
            </div>

            <h2 className="text-xl font-bold text-white">
              AI Voice Auto-Pickup is Active for {config.businessName}
            </h2>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              When callers ring your WhatsApp Business number, your configured receptionist answers with the restaurant greeting, takes reservations, answers menu questions, and replies with authentic speech audio.
            </p>
          </div>

          {/* Quick Metrics Badge Group */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-slate-300 font-medium">Phone Number ID</div>
              <div className="text-xs font-mono font-bold text-white mt-0.5 truncate">{config.phoneNumberId}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
              <div className="text-[10px] text-slate-300 font-medium">WABA Account ID</div>
              <div className="text-xs font-mono font-bold text-white mt-0.5 truncate">{config.businessAccountId}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-300 font-medium">Live Voice Persona</div>
              <div className="text-xs font-bold text-emerald-300 mt-0.5 capitalize truncate">
                {config.activePersona.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>

        {/* Webhook Configuration Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80 flex items-center justify-between gap-3">
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Public Live Webhook URL (Internet Active)
              </div>
              <div className="text-xs font-mono text-emerald-300 truncate mt-0.5">
                https://integration-common-giant-seemed.trycloudflare.com/api/whatsapp/webhook
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("https://integration-common-giant-seemed.trycloudflare.com/api/whatsapp/webhook", true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer"
            >
              {copiedUrl ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedUrl ? "Copied" : "Copy URL"}</span>
            </button>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-700/80 flex items-center justify-between gap-3">
            <div className="overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-slate-400">Webhook Verify Token</div>
              <div className="text-xs font-mono text-emerald-300 truncate mt-0.5">{config.verifyToken}</div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(config.verifyToken, false)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition shrink-0 cursor-pointer"
            >
              {copiedToken ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedToken ? "Copied" : "Copy Token"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. META DEVELOPER SETUP GUIDE ACCORDION */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowMetaGuide(!showMetaGuide)}
          className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <HelpCircle size={17} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                How to connect this Webhook in Meta Developer Portal
              </h3>
              <p className="text-xs text-gray-500">
                Follow these 4 simple steps to link incoming WhatsApp calls and messages to your AI Receptionist.
              </p>
            </div>
          </div>
          {showMetaGuide ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>

        {showMetaGuide && (
          <div className="p-5 border-t border-gray-200 bg-white space-y-3.5 text-xs text-gray-700">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-gray-900">Open Meta App Dashboard:</strong> Go to{" "}
                <a
                  href="https://developers.facebook.com/apps"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5"
                >
                  developers.facebook.com <ExternalLink size={10} />
                </a>{" "}
                and select your WhatsApp Business Application.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-gray-900">Navigate to WhatsApp Configuration:</strong> In the left navigation menu, expand <strong>WhatsApp</strong> and click on <strong>Configuration</strong>.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-gray-900">Paste Callback URL and Verify Token:</strong> Under <strong>Webhook</strong>, click <strong>Edit</strong>. Paste your <strong>Callback URL</strong> and <strong>Verify Token</strong> from the card above, then click <strong>Verify and Save</strong>.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-gray-900">Subscribe to Call &amp; Message Events:</strong> Under Webhook Fields, click <strong>Manage</strong> and check the boxes for <strong>messages</strong> and <strong>calls</strong>. Incoming WhatsApp calls and customer audio will now automatically trigger your AI receptionist!
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. CALL PICKUP & VOICE BEHAVIOR SETTINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Call &amp; Voice Behavior
              </h3>
            </div>
            <Link
              href="/dashboard/ai-settings"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Edit Voice in AI Settings</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Auto Pick Calls Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <div className="text-xs font-bold text-gray-900">Auto-Answer WhatsApp Calls</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Automatically answers incoming WhatsApp voice calls with your AI receptionist.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={config.autoPickCalls}
                onChange={(e) => setConfig({ ...config, autoPickCalls: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Voice Note Replies Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <div className="text-xs font-bold text-gray-900">Synthesize Voice Audio Notes (ElevenLabs)</div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Replies to callers with spoken audio notes matching your selected persona.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={config.voiceRepliesEnabled}
                onChange={(e) => setConfig({ ...config, voiceRepliesEnabled: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          {/* Active Greeting Box */}
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200">
            <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Bot size={13} className="text-blue-600" />
              <span>Active Restaurant Greeting</span>
            </div>
            <p className="text-xs text-blue-950 font-medium italic mt-1 leading-relaxed">
              &ldquo;{config.compiledGreeting}&rdquo;
            </p>
          </div>

          {/* Escalation Phone Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Staff Escalation Transfer Number
            </label>
            <input
              type="text"
              value={config.transferPhoneNumber}
              onChange={(e) => setConfig({ ...config, transferPhoneNumber: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="+1 (555) 019-2834"
            />
          </div>
        </div>

        {/* 4. LIVE WHATSAPP CALL & VOICE SIMULATOR */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <PhoneIncoming size={16} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Interactive Call &amp; Voice Simulator
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Live Testing Center
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Simulated Caller Phone Number
            </label>
            <input
              type="text"
              value={simCallerNumber}
              onChange={(e) => setSimCallerNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
              placeholder="+1 (555) 849-2041"
            />
          </div>

          {/* Test Action 1: Incoming WhatsApp Call */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-emerald-950">Test 1: Incoming WhatsApp Voice Call</div>
              <div className="text-[11px] text-emerald-800">
                Simulates an incoming WhatsApp call. Agent picks up and speaks the greeting.
              </div>
            </div>
            <Button
              type="button"
              onClick={handleSimulateCall}
              disabled={isSimulatingCall}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              {isSimulatingCall ? <Loader2 size={13} className="animate-spin" /> : <PhoneCall size={13} />}
              <span>{isSimulatingCall ? "Calling..." : "Simulate Call"}</span>
            </Button>
          </div>

          {/* Test Action 2: Caller Speaks Voice Note */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Test 2: Caller Inquiry / Voice Note Content
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={simQuery}
                onChange={(e) => setSimQuery(e.target.value)}
                placeholder="e.g. Can I book a table for 4 tonight at 8 PM?"
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                type="button"
                onClick={handleSimulateVoiceNote}
                disabled={isSimulatingVoice}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                {isSimulatingVoice ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                <span>{isSimulatingVoice ? "Processing..." : "Send Note"}</span>
              </Button>
            </div>
          </div>

          {/* Active Simulation Result Banner */}
          {simResult && (
            <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Call Handled by AI Receptionist
                </span>
                {simResult.agentResponse && (
                  <button
                    type="button"
                    onClick={() => handlePlayAudio("sim_active", simResult.audioUrl, simResult.agentResponse)}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition cursor-pointer"
                  >
                    {playingLogId === "sim_active" ? (
                      <>
                        <Square size={10} className="fill-current" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={12} />
                        <span>Listen Voice Reply</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                &ldquo;{simResult.agentResponse}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5. RECENT WHATSAPP ACTIVITY & CALL LOGS TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Recent WhatsApp Calls &amp; Voice Logs
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            {logs.length} logged interactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100/70 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Caller Number</th>
                <th className="p-3.5">Interaction Type</th>
                <th className="p-3.5">Caller Input / Query</th>
                <th className="p-3.5">AI Receptionist Response</th>
                <th className="p-3.5">Outcome</th>
                <th className="p-3.5 text-right">Voice Audio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/60 transition">
                  <td className="p-3.5 font-mono font-bold text-gray-900 whitespace-nowrap">
                    {log.callerNumber}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.type === "CALL"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-gray-600 max-w-xs truncate" title={log.callerInput}>
                    {log.callerInput}
                  </td>
                  <td className="p-3.5 text-gray-900 font-medium max-w-sm truncate" title={log.agentResponse}>
                    {log.agentResponse}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="text-emerald-700 font-semibold text-[11px]">
                      {log.outcome}
                    </span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    {log.audioUrl ? (
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(log.id, log.audioUrl, log.agentResponse)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          playingLogId === log.id
                            ? "bg-emerald-600 text-white shadow-xs animate-pulse"
                            : "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200"
                        }`}
                      >
                        {playingLogId === log.id ? (
                          <>
                            <Square size={10} className="fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={12} className="text-emerald-600" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-[10px]">Text Only</span>
                    )}
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    No WhatsApp call logs yet. Click &ldquo;Simulate Call&rdquo; above to test.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
