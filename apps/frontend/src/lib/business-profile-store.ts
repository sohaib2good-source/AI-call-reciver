import { saveStoredAiSettings, syncAiSettingsToCloud } from "./ai-settings-store";

export const BUSINESS_PROFILE_STORAGE_KEY = "ai_restaurant_business_profile_v1";
export const EVENT_BUSINESS_PROFILE_UPDATED = "business-profile-updated";

export interface BusinessProfileState {
  businessName: string;
  legalName: string;
  description: string;
  specialtyValue: string;
  phone: string;
  email: string;
  website: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressCountry: string;
  selectedIndustries: string[];
  selectedCapabilities: string[];
  updatedAt?: string;
}

export const DEFAULT_BUSINESS_PROFILE: BusinessProfileState = {
  businessName: "The Grand AI Cafe",
  legalName: "Grand AI Cafe LLC",
  description: "A futuristic dining and reception experience powered by conversational AI.",
  specialtyValue: "International",
  phone: "+1 234 567 8900",
  email: "hello@grandai.cafe",
  website: "https://grandai.cafe",
  addressStreet: "123 AI Boulevard",
  addressCity: "San Francisco",
  addressState: "CA",
  addressZip: "94103",
  addressCountry: "USA",
  selectedIndustries: ["restaurant"],
  selectedCapabilities: ["order_taker", "reservation", "book_appointment"],
};

export function getStoredBusinessProfile(): BusinessProfileState {
  if (typeof window === "undefined") return DEFAULT_BUSINESS_PROFILE;
  try {
    const raw = localStorage.getItem(BUSINESS_PROFILE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(
        BUSINESS_PROFILE_STORAGE_KEY,
        JSON.stringify(DEFAULT_BUSINESS_PROFILE)
      );
      return DEFAULT_BUSINESS_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_BUSINESS_PROFILE,
      ...parsed,
    };
  } catch {
    return DEFAULT_BUSINESS_PROFILE;
  }
}

export function saveStoredBusinessProfile(
  profile: Partial<BusinessProfileState>
): BusinessProfileState {
  const current = getStoredBusinessProfile();
  const updated: BusinessProfileState = {
    ...current,
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(BUSINESS_PROFILE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent(EVENT_BUSINESS_PROFILE_UPDATED, { detail: updated })
    );

    // Asynchronously persist to server database endpoint
    fetch("/api/restaurant/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).catch((err) => console.error("Error saving business profile to server:", err));

    // Automatically synchronize businessName & businessAddress with AI Receptionist settings!
    if (updated.businessName || updated.addressStreet) {
      const street = updated.addressStreet || "";
      const city = updated.addressCity ? `, ${updated.addressCity}` : "";
      const fullAddress = `${street}${city}`.trim();
      const nextAi = saveStoredAiSettings({
        businessName: updated.businessName,
        businessAddress: fullAddress || undefined,
      });

      // Synchronize directly with ElevenLabs cloud agent so the voice receptionist immediately speaks the new restaurant name!
      syncAiSettingsToCloud(nextAi).catch((err) =>
        console.warn("Background cloud sync note:", err)
      );
    }
  }

  return updated;
}

export async function fetchServerBusinessProfile(): Promise<BusinessProfileState> {
  if (typeof window === "undefined") return DEFAULT_BUSINESS_PROFILE;
  try {
    const res = await fetch("/api/restaurant/profile");
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const merged: BusinessProfileState = {
          ...DEFAULT_BUSINESS_PROFILE,
          ...json.data,
        };
        localStorage.setItem(BUSINESS_PROFILE_STORAGE_KEY, JSON.stringify(merged));
        window.dispatchEvent(
          new CustomEvent(EVENT_BUSINESS_PROFILE_UPDATED, { detail: merged })
        );

        // Keep ai-settings synced with the canonical business name
        if (merged.businessName || merged.addressStreet) {
          const street = merged.addressStreet || "";
          const city = merged.addressCity ? `, ${merged.addressCity}` : "";
          const fullAddress = `${street}${city}`.trim();
          saveStoredAiSettings({
            businessName: merged.businessName,
            businessAddress: fullAddress || undefined,
          });
        }

        return merged;
      }
    }
  } catch (err) {
    console.error("Failed to fetch server business profile:", err);
  }
  return getStoredBusinessProfile();
}

export function onBusinessProfileUpdated(
  callback: (profile: BusinessProfileState) => void
): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<BusinessProfileState>;
    callback(customEvent.detail || getStoredBusinessProfile());
  };
  window.addEventListener(EVENT_BUSINESS_PROFILE_UPDATED, handler);
  return () => window.removeEventListener(EVENT_BUSINESS_PROFILE_UPDATED, handler);
}
