"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Mic,
  Square,
  Loader2,
  Bot,
  User,
  Activity,
  Sliders,
  Volume2,
  Sparkles,
  ExternalLink,
  UtensilsCrossed,
  Gauge,
  Check,
} from "lucide-react";
import { useConversation, ConversationProvider } from "@elevenlabs/react";
import {
  getStoredAiSettings,
  fetchServerAiSettings,
  onAiSettingsUpdated,
  AiSettingsState,
  DEFAULT_AI_SETTINGS,
  PERSONA_TO_ELEVENLABS_VOICE,
  SPEED_LEVEL_LABELS,
} from "@/lib/ai-settings-store";
import {
  getStoredMenuItems,
  onMenuItemsUpdated,
  MenuItem,
} from "@/lib/menu-store";
import {
  getStoredBusinessProfile,
  onBusinessProfileUpdated,
} from "@/lib/business-profile-store";

function TestCenterContent() {
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messages, setMessages] = useState<{source: 'ai' | 'user', message: string}[]>([]);
  const [micVolume, setMicVolume] = useState(0);
  const [connectionType, setConnectionType] = useState<"websocket" | "webrtc">("websocket");

  // Read live AI settings and menu items from app
  const [aiSettings, setAiSettings] = useState<AiSettingsState>(DEFAULT_AI_SETTINGS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    setAiSettings(getStoredAiSettings());
    setMenuItems(getStoredMenuItems());

    fetchServerAiSettings().then((srv) => setAiSettings(srv)).catch(() => {});

    const unsubSettings = onAiSettingsUpdated((s) => setAiSettings(s));
    const unsubMenu = onMenuItemsUpdated((m) => setMenuItems(m));
    const unsubProfile = onBusinessProfileUpdated(() => setAiSettings(getStoredAiSettings()));

    return () => {
      unsubSettings();
      unsubMenu();
      unsubProfile();
    };
  }, []);

  const conversation = useConversation({
    volume: 1, // Start with maximum volume
    onConnect: () => {
      console.log("Connected to ElevenLabs Voice Agent!");
      setConnectionError(null);
      const profile = getStoredBusinessProfile();
      const s = getStoredAiSettings();
      const currentName = profile.businessName || s.businessName || "biryani master link road";
      try {
        conversation.sendContextualUpdate(
          `System Note: The restaurant name is "${currentName}". You are answering calls for "${currentName}". Always identify yourself and the restaurant as "${currentName}".`
        );
      } catch (e) {
        console.warn("Context update notice:", e);
      }
    },
    onDisconnect: () => console.log("Disconnected"),
    onMessage: (message: any) => {
      console.log("Message:", message);
      if (message && typeof message.message === 'string') {
        setMessages(prev => [...prev, message]);
      }
    },
    // Dynamic Client Tools: reads the real menu and real restaurant info from the web app
    clientTools: {
      // Primary tool registered on ElevenLabs agent
      answere: async () => {
        const profile = getStoredBusinessProfile();
        const s = getStoredAiSettings();
        const name = profile.businessName || s.businessName || "biryani master link road";
        const addr = s.businessAddress || (profile.addressStreet ? `${profile.addressStreet}, ${profile.addressCity}` : "123 AI Boulevard, San Francisco");
        const active = getStoredMenuItems().filter((i) => i.status === "Active");
        const menuString = active.length > 0
          ? active.map((i) => `${i.name} ($${i.price})`).join(", ")
          : "Chef Specials, Biryani, Curries, Appetizers, Drinks, and Desserts";
        return `You are the AI Receptionist for ${name}, located at ${addr}. Current Menu: ${menuString}. Phone transfer: ${s.businessRules.transferPhoneNumber}. Answer customer inquiries warmly as ${name}.`;
      },
      get_menu: async () => {
        const profile = getStoredBusinessProfile();
        const s = getStoredAiSettings();
        const name = profile.businessName || s.businessName || "biryani master link road";
        const active = getStoredMenuItems().filter((i) => i.status === "Active");
        if (!active.length) return `Our menu for ${name} is currently being updated.`;
        return (
          `Our current menu for ${name} includes: ` +
          active
            .map(
              (i) =>
                `${i.name} ($${i.price}${i.tags?.length ? `, ${i.tags.join(", ")}` : ""}): ${
                  i.description || ""
                }`
            )
            .join("; ")
        );
      },
      get_restaurant_menu: async () => {
        const active = getStoredMenuItems().filter((i) => i.status === "Active");
        return active.map((i) => `${i.name} ($${i.price})`).join(", ");
      },
      check_menu: async () => {
        const active = getStoredMenuItems().filter((i) => i.status === "Active");
        return active.map((i) => `${i.name} ($${i.price})`).join(", ");
      },
      get_restaurant_info: async () => {
        const profile = getStoredBusinessProfile();
        const s = getStoredAiSettings();
        const name = profile.businessName || s.businessName || "biryani master link road";
        const addr = s.businessAddress || (profile.addressStreet ? `${profile.addressStreet}, ${profile.addressCity}` : "123 AI Boulevard, San Francisco");
        return `${name}, located at ${addr}. Pickup ring threshold: ${s.pickupRings} rings (~${s.pickupRings * 3} seconds). Transfer line: ${s.businessRules.transferPhoneNumber}.`;
      },
      get_restaurant_name: async () => {
        const profile = getStoredBusinessProfile();
        const s = getStoredAiSettings();
        return profile.businessName || s.businessName || "biryani master link road";
      },
      get_daily_specials: async () => {
        const s = getStoredAiSettings();
        return s.upselling.chefSpecialPrompt;
      },
    },
    onUnhandledClientToolCall: (toolCall: any) => {
      console.warn("AI called an unhandled tool:", toolCall);
      setMessages(prev => [...prev, { 
        source: 'ai', 
        message: `⚠️ [SYSTEM ERROR]: The AI Agent tried to execute a Client Tool named "${toolCall?.name || 'unknown'}" to read data from the app, but that specific tool name is not wired up in the code yet!` 
      }]);
    },
    onError: (error: any) => {
      console.error("Error:", error);
      setConnectionError(typeof error === 'string' ? error : error?.message || "An unknown error occurred connecting to ElevenLabs.");
    },
  });

  const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Monitor microphone volume
  useEffect(() => {
    if (conversation.status === 'connected') {
      const updateVolume = () => {
        const volume = conversation.getInputVolume();
        setMicVolume(Math.min(100, Math.max(0, volume * 100 * 3)));
        animationRef.current = requestAnimationFrame(updateVolume);
      };
      animationRef.current = requestAnimationFrame(updateVolume);
    } else {
      setMicVolume(0);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [conversation.status, conversation]);

  const startConversation = useCallback(async () => {
    try {
      setConnectionError(null);
      setMessages([]); 
      setHasMicrophonePermission(null);

      // Connect to your live ElevenLabs Receptionist Agent (settings applied directly in ElevenLabs cloud)
      await conversation.startSession({
        agentId: "agent_2001m4ha09d9e88bn4c0vmjzh0rw",
        connectionType: connectionType,
      });
      
    } catch (error: any) {
      console.error("Failed to start conversation:", error);
      const isMicError = error instanceof Error && (error.name === 'NotAllowedError' || error.message.toLowerCase().includes('microphone'));
      
      if (isMicError) {
        setHasMicrophonePermission(false);
      } else {
        setConnectionError(typeof error === 'string' ? error : error?.message || "Failed to start");
      }
    }
  }, [conversation, connectionType]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === 'connected';

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] p-6 max-w-6xl mx-auto w-full gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Voice Test Center</h1>
          <p className="text-muted-foreground mt-1">
            Test your ElevenLabs AI Agent over a live microphone connection!
          </p>
        </div>

        {/* Protocol Selector: WebSocket streams audio directly over HTTPS/TLS (bypassing laptop UDP blocking) */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-xl border text-xs">
          <span className="text-gray-500 font-medium px-2">Audio Protocol:</span>
          <button
            type="button"
            disabled={isConnected}
            onClick={() => setConnectionType("websocket")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              connectionType === "websocket"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
            } ${isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Firewall & Laptop Friendly: streams PCM audio directly over WebSocket"
          >
            WebSocket (Direct Audio / Laptop)
          </button>
          <button
            type="button"
            disabled={isConnected}
            onClick={() => setConnectionType("webrtc")}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              connectionType === "webrtc"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
            } ${isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
            title="Peer-to-peer LiveKit audio over UDP"
          >
            WebRTC (UDP)
          </button>
        </div>
      </div>

      {/* Live Synced AI Configuration Status Strip */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-xs p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-lg font-semibold border border-purple-200 dark:border-purple-800">
            <Volume2 size={13} />
            <span>Voice: {PERSONA_TO_ELEVENLABS_VOICE[aiSettings.voice.selectedAgentId]?.elevenLabsName || "Bella (Receptionist)"}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-lg font-semibold border border-indigo-200 dark:border-indigo-800">
            <Gauge size={13} />
            <span>Speed: {SPEED_LEVEL_LABELS[aiSettings.voice.speed]?.multiplier || "1.0x"} ({SPEED_LEVEL_LABELS[aiSettings.voice.speed]?.name || "Normal"})</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg font-semibold border border-blue-200 dark:border-blue-800">
            <Activity size={13} />
            <span>Pickup: {aiSettings.pickupRings} Rings (~{aiSettings.pickupRings * 3}s)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-lg font-semibold border border-emerald-200 dark:border-emerald-800">
            <UtensilsCrossed size={13} />
            <span>Live Menu: {menuItems.filter((i) => i.status === "Active").length} Dishes Connected</span>
          </div>

          {aiSettings.upselling.categoriesEnabled && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-lg font-semibold border border-amber-200 dark:border-amber-800">
              <Sparkles size={13} />
              <span>Upselling Active</span>
            </div>
          )}
        </div>

        <Link
          href="/dashboard/ai-settings"
          className="flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          <Sliders size={13} /> Edit Settings in App &rarr;
        </Link>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left Side: Voice Controls */}
        <div className="w-1/3 bg-white dark:bg-gray-800 rounded-xl border shadow-sm flex flex-col items-center p-8">
          
          <div className="text-center w-full space-y-6">
            <div className={`relative w-40 h-40 rounded-full mx-auto flex items-center justify-center border-4 transition-all duration-500 ${
              isConnected 
                ? (conversation.isSpeaking ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-[0_0_30px_rgba(59,130,246,0.5)]' : 'border-green-500 bg-green-50 animate-pulse dark:bg-green-900/20 shadow-[0_0_30px_rgba(34,197,94,0.3)]')
                : 'border-gray-200 dark:border-gray-700'
            }`}>
               <Mic size={56} className={`transition-colors duration-500 ${
                 isConnected 
                  ? (conversation.isSpeaking ? 'text-blue-500' : 'text-green-500')
                  : 'text-gray-400'
               }`} />
               
               {/* Visualizer bars when AI is speaking */}
               {conversation.isSpeaking && (
                 <div className="absolute -bottom-8 flex gap-1 items-end h-8">
                    <span className="w-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite] h-4"></span>
                    <span className="w-2 bg-blue-500 rounded-full animate-[bounce_1.2s_infinite] h-8"></span>
                    <span className="w-2 bg-blue-500 rounded-full animate-[bounce_0.8s_infinite] h-5"></span>
                    <span className="w-2 bg-blue-500 rounded-full animate-[bounce_1.5s_infinite] h-7"></span>
                    <span className="w-2 bg-blue-500 rounded-full animate-[bounce_1.1s_infinite] h-3"></span>
                 </div>
               )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">
                {!isConnected ? 'Ready to test' : (conversation.isSpeaking ? 'AI is speaking...' : 'Listening...')}
              </h2>
              <p className="text-gray-500 text-sm min-h-10">
                {!isConnected 
                  ? 'Click the button below to start a live voice call with your AI.'
                  : (conversation.isSpeaking ? 'The AI is currently responding to you.' : 'Speak into your microphone now.')}
              </p>
            </div>

            {/* Diagnostic Mic Volume Bar */}
            {isConnected && !conversation.isSpeaking && (
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden flex relative shadow-inner">
                <div 
                  className="bg-green-500 h-full transition-all duration-75" 
                  style={{ width: `${micVolume}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-500 mix-blend-difference opacity-50 uppercase tracking-widest">
                  Mic Volume
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
              {isConnected ? (
                <>
                  <button
                    onClick={() => conversation.sendUserMessage("Hello, can you hear me?")}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 mx-auto transition-all w-full border border-gray-300 shadow-sm"
                  >
                    <User size={16} />
                    Send Text "Hello" (Debug)
                  </button>
                  <button
                    onClick={stopConversation}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 mx-auto transition-all shadow-lg hover:shadow-xl w-full justify-center"
                  >
                    <Square size={20} fill="currentColor" />
                    End Call
                  </button>
                </>
              ) : (
                <button
                  onClick={startConversation}
                  disabled={conversation.status === 'connecting'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 mx-auto transition-all shadow-lg hover:shadow-xl disabled:opacity-50 w-full justify-center"
                >
                  {conversation.status === 'connecting' ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Mic size={24} />
                      Start Call
                    </>
                  )}
                </button>
              )}
            </div>
            
            {hasMicrophonePermission === false && (
              <p className="text-red-500 text-sm mt-4 bg-red-50 p-3 rounded-md text-left border border-red-200">
                Microphone access was denied! Click the lock icon next to your URL bar to allow the microphone.
              </p>
            )}
            
            {connectionError && (
              <p className="text-red-500 text-sm mt-4 bg-red-50 p-3 rounded-md border border-red-200 text-left">
                <b>Error:</b> {connectionError}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Transcription */}
        <div className="w-2/3 bg-white dark:bg-gray-800 rounded-xl border shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Live Transcript</h3>
            {isConnected && (
               <span className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  <Activity size={14} className="animate-pulse" />
                  Live {connectionType === "websocket" ? "WebSocket Audio Stream" : "WebRTC Connection"}
               </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Bot size={48} className="mb-4 opacity-50" />
                <p>No messages yet.</p>
                <p className="text-sm">Start the call and speak to see the live transcript.</p>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-4 ${msg.source === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.source === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {msg.source === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl shadow-sm ${
                  msg.source === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {conversation.isSpeaking && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 px-5 py-4 rounded-2xl rounded-tl-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            
            <div ref={transcriptEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default function TestCenterPage() {
  return (
    <ConversationProvider>
      <TestCenterContent />
    </ConversationProvider>
  );
}
