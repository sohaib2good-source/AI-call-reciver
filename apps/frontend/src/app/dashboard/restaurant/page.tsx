"use client";

import { useState } from "react";
import { Button } from "@ai-restaurant/ui";
import {
  Building2,
  Bot,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Code2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  CalendarCheck,
  ShoppingBag,
  Utensils,
  Headphones,
  Briefcase,
  Layers,
} from "lucide-react";

interface IndustryOption {
  id: string;
  name: string;
  icon: string;
  dynamicLabel: string;
  placeholder: string;
}

const INDUSTRIES: IndustryOption[] = [
  {
    id: "restaurant",
    name: "Restaurant, Cafe & Food Service",
    icon: "🍽️",
    dynamicLabel: "Cuisine Type / Concept",
    placeholder: "e.g. Italian, Cafe, Fast Casual",
  },
  {
    id: "professional",
    name: "Professional Services & Consulting",
    icon: "💼",
    dynamicLabel: "Practice Areas / Services",
    placeholder: "e.g. Management Consulting, Tax Advisory, Legal",
  },
  {
    id: "medical",
    name: "Healthcare, Clinic & Wellness",
    icon: "🏥",
    dynamicLabel: "Medical Specialty / Clinic Type",
    placeholder: "e.g. Dental Care, Dermatology, Physiotherapy",
  },
  {
    id: "realestate",
    name: "Real Estate & Property Management",
    icon: "🏢",
    dynamicLabel: "Property Focus",
    placeholder: "e.g. Residential Leasing, Commercial Sales",
  },
  {
    id: "retail",
    name: "Retail & Local Commerce",
    icon: "🛍️",
    dynamicLabel: "Retail Products / Category",
    placeholder: "e.g. Fashion Boutique, Electronics, Home Decor",
  },
  {
    id: "auto",
    name: "Automotive & Repair Services",
    icon: "🚗",
    dynamicLabel: "Service Type",
    placeholder: "e.g. Auto Repair, Detailing, Tire Center",
  },
  {
    id: "salon",
    name: "Salon, Spa & Beauty Care",
    icon: "🛎️",
    dynamicLabel: "Salon Specialties",
    placeholder: "e.g. Hair Styling, Day Spa, Nails & Esthetics",
  },
  {
    id: "individual",
    name: "Solo Business Person / Executive",
    icon: "👤",
    dynamicLabel: "Professional Title / Industry",
    placeholder: "e.g. Independent Advisor, Freelancer, Architect",
  },
  {
    id: "other",
    name: "Other Business / Custom",
    icon: "🌐",
    dynamicLabel: "Business Specialization",
    placeholder: "e.g. General Commercial Services",
  },
];

interface AgentCapabilityOption {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  description: string;
  typicalTasks: string;
}

const AGENT_CAPABILITIES: AgentCapabilityOption[] = [
  {
    id: "order_taker",
    title: "Order Taker",
    icon: "📦",
    badge: "POPULAR",
    description: "Takes customer food & product orders, handles item customizations, and confirms delivery/pickup timing.",
    typicalTasks: "Menu Ordering, Add-ons & Modifiers, Delivery Details",
  },
  {
    id: "reservation",
    title: "Reservation",
    icon: "🍽️",
    badge: "DINING",
    description: "Books dining tables, party sizes, seating times, special requests, and verifies floor availability.",
    typicalTasks: "Table Bookings, Party Sizes, Seating Preferences",
  },
  {
    id: "book_appointment",
    title: "Book Appointment",
    icon: "📅",
    badge: "SERVICES",
    description: "Schedules consultations, client meetings, clinic slots, hair/spa appointments, or service visits.",
    typicalTasks: "Calendar Scheduling, Time Slots, Appointment Reminders",
  },
  {
    id: "receptionist",
    title: "Front-Desk Greeter & FAQs",
    icon: "🛎️",
    description: "Greets callers, answers operational FAQs (hours, address, parking), and routes calls to personnel.",
    typicalTasks: "Call Screening, Business Hours, Directions & FAQs",
  },
  {
    id: "customer_support",
    title: "Customer Support",
    icon: "🤝",
    description: "Assists existing clients, resolves complaints, checks order status, and answers policy questions.",
    typicalTasks: "Issue Resolution, Policy Guidance, Support Tickets",
  },
  {
    id: "personal_assistant",
    title: "Personal Assistant",
    icon: "💼",
    description: "Screens callers for solo business persons, transcribes priority memos, and alerts the owner.",
    typicalTasks: "VIP Call Filtering, Voice Memos, Urgent Notifications",
  },
];

export default function BusinessProfilePage() {
  // Business Organization Info
  const [businessName, setBusinessName] = useState<string>("The Grand AI Cafe");
  const [legalName, setLegalName] = useState<string>("Grand AI Cafe LLC");
  const [description, setDescription] = useState<string>(
    "A futuristic dining and reception experience powered by conversational AI."
  );
  const [specialtyValue, setSpecialtyValue] = useState<string>("International");
  const [phone, setPhone] = useState<string>("+1 234 567 8900");
  const [email, setEmail] = useState<string>("hello@grandai.cafe");
  const [website, setWebsite] = useState<string>("https://grandai.cafe");

  // Address Info
  const [addressStreet, setAddressStreet] = useState<string>("123 AI Boulevard");
  const [addressCity, setAddressCity] = useState<string>("San Francisco");
  const [addressState, setAddressState] = useState<string>("CA");
  const [addressZip, setAddressZip] = useState<string>("94103");
  const [addressCountry, setAddressCountry] = useState<string>("USA");

  // AI Agent Configuration (Below the Organization Box)
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(["restaurant"]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([
    "order_taker",
    "reservation",
    "book_appointment",
  ]);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [showJson, setShowJson] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const currentIndustries = INDUSTRIES.filter((i) => selectedIndustries.includes(i.id));
  const primaryIndustry = currentIndustries[0] || INDUSTRIES[0];

  const currentCapabilities = AGENT_CAPABILITIES.filter((c) =>
    selectedCapabilities.includes(c.id)
  );

  const handleToggleIndustry = (id: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleToggleCapability = (id: string) => {
    setSelectedCapabilities((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const capabilityLabels = currentCapabilities.map((c) => c.title);
  const greetingTasks = capabilityLabels.join(", ");
  const callerGreeting = `Thank you for calling ${businessName || "[Business Name]"}. I am your AI Assistant. I can assist you with ${greetingTasks}. How may I help you today?`;

  const profileJsonConfig = {
    business_profile: {
      display_name: businessName,
      legal_name: legalName,
      industries: selectedIndustries,
      industry_labels: currentIndustries.map((i) => i.name),
      primary_industry: primaryIndustry.name,
      specialty: specialtyValue,
      description: description,
      contact: {
        phone,
        email,
        website: website || null,
      },
      location: {
        street: addressStreet,
        city: addressCity,
        state: addressState,
        postal_code: addressZip,
        country: addressCountry,
      },
    },
    ai_agent_capabilities: {
      active_services: selectedCapabilities,
      service_labels: capabilityLabels,
      caller_greeting: callerGreeting,
    },
    telephony_prompt_context: {
      system_instructions: `You are the AI Assistant for ${businessName} (${currentIndustries.map((i) => i.name).join(", ")}). You are empowered with the following active capabilities: ${capabilityLabels.join("; ")}. Maintain a professional, polite, and helpful conversational tone.`,
    },
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(profileJsonConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="w-full max-w-5xl space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Multi-Business & Solo
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Configure your business details and specify the capabilities your AI agent performs for callers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1 font-medium animate-in fade-in">
              <CheckCircle2 size={16} /> Saved
            </span>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving Changes..." : "Save Profile"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* UPPER PORTION: Organization & Contact Info */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <div className="flex items-center gap-2.5 border-b pb-4">
            <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Organization & Contact Info</h2>
              <p className="text-xs text-gray-500">
                Primary business identity, background description, and caller contact details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Business / Display Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Consulting, The Grand AI Cafe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Legal Entity Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="e.g. Apex Holdings LLC"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Business Description / Overview
            </label>
            <textarea
              className="w-full border rounded-lg p-2.5 text-gray-800"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the AI what your business does so it can accurately answer caller questions..."
            />
            <p className="text-xs text-gray-400 mt-1">
              The AI receptionist uses this background knowledge to answer caller inquiries about your services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dynamic Specialty Label */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {currentIndustries.length === 1
                  ? currentIndustries[0].dynamicLabel
                  : `Specialty & Focus (${currentIndustries.map((i) => i.name.split(" ")[0]).join(", ")})`}
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={specialtyValue}
                onChange={(e) => setSpecialtyValue(e.target.value)}
                placeholder={primaryIndustry.placeholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Primary Phone Number
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Official Email
              </label>
              <input
                type="email"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@yourcompany.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Website URL (Optional)
            </label>
            <input
              type="url"
              className="w-full md:w-1/2 border rounded-lg p-2.5 text-gray-800"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </div>
        </section>

        {/* Office / Physical Address */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <MapPin size={20} className="text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Office / Physical Address</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Street Address / Suite
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={addressStreet}
                onChange={(e) => setAddressStreet(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                State / Province
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={addressState}
                onChange={(e) => setAddressState(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Postal / Zip Code
              </label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={addressZip}
                onChange={(e) => setAddressZip(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Country</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2.5 text-gray-800"
                value={addressCountry}
                onChange={(e) => setAddressCountry(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* LOWER PORTION: AI Agent Identity & Capabilities (Brought down below Organization box) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 ring-1 ring-blue-100 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                AI Agent Identity & Capabilities
              </h2>
              <p className="text-xs text-gray-500">
                Configure what tasks and services your AI receptionist performs for callers across your chosen industries.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* 1. Industry / Business Types (Multi-Select Checkboxes) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <label className="block text-sm font-bold text-gray-900">
                    Business Type / Industry (Select One or More)
                  </label>
                  <p className="text-xs text-gray-500">
                    Check all categories that apply to your business or solo practice.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  {selectedIndustries.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                {INDUSTRIES.map((ind) => {
                  const isChecked = selectedIndustries.includes(ind.id);
                  return (
                    <label
                      key={ind.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                        isChecked
                          ? "bg-blue-50/80 border-blue-500 text-blue-950 font-medium ring-1 ring-blue-200 shadow-2xs"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50/80 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleIndustry(ind.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-lg">{ind.icon}</span>
                      <span className="text-xs font-semibold">{ind.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 2. AI Agent Capabilities / Buttons: Order Taker, Reservation, Book Appointment, etc. */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <label className="block text-sm font-bold text-gray-900">
                    AI Agent Services & Tasks (Click to Enable / Disable)
                  </label>
                  <p className="text-xs text-gray-500">
                    Choose what actions the AI receptionist will perform when customers call.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                  {selectedCapabilities.length} Active Services
                </span>
              </div>

              {/* Interactive Service Buttons / Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {AGENT_CAPABILITIES.map((cap) => {
                  const isActive = selectedCapabilities.includes(cap.id);
                  return (
                    <button
                      key={cap.id}
                      type="button"
                      onClick={() => handleToggleCapability(cap.id)}
                      className={`flex flex-col text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                        isActive
                          ? "border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-200"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cap.icon}</span>
                          <span className="text-sm font-bold text-gray-900">
                            {cap.title}
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => {}} // handled by button onClick
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 pointer-events-none mt-0.5"
                        />
                      </div>

                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {cap.description}
                      </p>

                      <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-gray-500 font-medium">Tasks:</span>
                        <span className="font-semibold text-gray-700 truncate max-w-[170px]">
                          {cap.typicalTasks}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Agent Persona Preview Box */}
          <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold flex items-center gap-1.5 text-blue-900">
                <Sparkles size={14} className="text-blue-600" />
                Active Agent Services: {capabilityLabels.join(" • ")}
              </span>
              <div className="flex flex-wrap gap-1">
                {currentIndustries.map((ind) => (
                  <span
                    key={ind.id}
                    className="bg-white/90 px-2 py-0.5 rounded text-[10px] font-semibold text-blue-800 border border-blue-200"
                  >
                    {ind.icon} {ind.name.split(" ")[0]}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-700">
              The AI receptionist will automatically offer callers: <strong>{greetingTasks}</strong>.
            </p>
            <div className="pt-2 border-t border-blue-200/60 font-mono text-[11px] text-blue-800 bg-white/70 p-2 rounded">
              💬 <em>Caller Greeting: &quot;{callerGreeting}&quot;</em>
            </div>
          </div>
        </section>

        {/* SECTION: Standardized AI Agent JSON Structure */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <Code2 size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">
                    AI Agent Business Profile JSON
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Machine-Readable
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Standardized JSON structure ingested by telephony bots (Twilio, Vapi, Retell) and LLM system prompts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 font-medium cursor-pointer"
              >
                {showJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showJson ? "Hide JSON" : "Show JSON"}
              </button>

              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-gray-900 text-white hover:bg-gray-800 transition cursor-pointer shadow-xs"
              >
                {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                <span>{copied ? "Copied!" : "Copy JSON"}</span>
              </button>
            </div>
          </div>

          {showJson && (
            <div className="space-y-2">
              <pre className="bg-gray-950 text-emerald-400 p-4 rounded-lg text-xs font-mono overflow-x-auto border border-gray-800 leading-relaxed shadow-inner max-h-80">
                <code>{JSON.stringify(profileJsonConfig, null, 2)}</code>
              </pre>
              <div className="text-[11px] text-gray-500 flex items-center justify-between">
                <span>API Endpoint: <code className="text-gray-700 font-bold">GET /restaurant/profile/agent-context</code></span>
                <span className="text-green-600 font-medium">✓ Updates dynamically as you type or change capabilities</span>
              </div>
            </div>
          )}
        </section>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
