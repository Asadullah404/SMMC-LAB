// src/lib/footerSettings.ts
import { useState, useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export interface FooterSettings {
  showFooter: boolean;        // Whether the website footer is visible
  showContactInfo: boolean;   // Whether the address & phone number are visible
  address: string;            // Physical address or clinic location
  phone: string;              // Contact telephone or mobile number
  customText: string;         // Copyright or organization tagline
  showInPdf: boolean;         // Whether to print address and phone in report PDF footers
  updatedAt?: string;
}

export const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  showFooter: true,
  showContactInfo: true,
  address: "SMMC Medical Complex, Main Boulevard, Diagnostic Services",
  phone: "+92 300 1234567",
  customText: "SMMC Laboratory Diagnostic Information Systems",
  showInPdf: true,
};

const STORAGE_KEY = "smmc_footer_settings_v1";
const EVENT_KEY = "smmc_footer_settings_changed";
const FIRESTORE_COLLECTION = "settings";
const FIRESTORE_DOC_ID = "footer";

export function parseFooterSettings(raw: any): FooterSettings {
  if (!raw) return DEFAULT_FOOTER_SETTINGS;
  return {
    showFooter: raw.showFooter ?? true,
    showContactInfo: raw.showContactInfo ?? true,
    address: typeof raw.address === "string" ? raw.address : DEFAULT_FOOTER_SETTINGS.address,
    phone: typeof raw.phone === "string" ? raw.phone : DEFAULT_FOOTER_SETTINGS.phone,
    customText: typeof raw.customText === "string" ? raw.customText : DEFAULT_FOOTER_SETTINGS.customText,
    showInPdf: raw.showInPdf ?? true,
    updatedAt: raw.updatedAt,
  };
}

/**
 * Loads footer settings synchronously from localStorage cache (for instantaneous first paint).
 */
export function getFooterSettings(): FooterSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FOOTER_SETTINGS;
    return parseFooterSettings(JSON.parse(raw));
  } catch (e) {
    console.warn("Failed to load footer settings from localStorage:", e);
    return DEFAULT_FOOTER_SETTINGS;
  }
}

/**
 * Saves footer settings to both localStorage and Firebase Firestore.
 */
export async function saveFooterSettings(settings: FooterSettings): Promise<void> {
  const payload: FooterSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  // 1. Instant local persistence & UI broadcast
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: payload }));
  } catch (e) {
    console.error("Failed to save footer settings to localStorage:", e);
  }

  // 2. Synchronize directly to Firebase Firestore
  try {
    const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
    await setDoc(docRef, payload, { merge: true });
    console.log("Footer settings successfully saved to Firebase Firestore.");
  } catch (err) {
    console.warn("Could not sync footer settings to Firebase Firestore:", err);
    throw err;
  }
}

/**
 * React hook to read and update footer settings reactively with real-time Firebase sync.
 */
export function useFooterSettings() {
  const [settings, setSettings] = useState<FooterSettings>(() => getFooterSettings());

  useEffect(() => {
    // 1. Listen for local storage & window events
    const handleLocalChange = () => {
      setSettings(getFooterSettings());
    };
    window.addEventListener(EVENT_KEY, handleLocalChange);
    window.addEventListener("storage", handleLocalChange);

    // 2. Real-time Firebase Firestore synchronization
    let unsubscribe: (() => void) | undefined;
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const firestoreData = parseFooterSettings(snap.data());
            // Cache locally so it is available offline and immediately on next visit
            localStorage.setItem(STORAGE_KEY, JSON.stringify(firestoreData));
            setSettings(firestoreData);
            window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: firestoreData }));
          }
        },
        (error) => {
          console.warn("Firestore footer settings subscription warning:", error.message);
        }
      );
    } catch (err) {
      console.warn("Could not initialize Firebase snapshot listener:", err);
    }

    return () => {
      window.removeEventListener(EVENT_KEY, handleLocalChange);
      window.removeEventListener("storage", handleLocalChange);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const updateSettings = async (partial: Partial<FooterSettings>): Promise<void> => {
    const updated: FooterSettings = {
      ...settings,
      ...partial,
    };
    setSettings(updated);
    await saveFooterSettings(updated);
  };

  const resetToDefault = async (): Promise<void> => {
    setSettings(DEFAULT_FOOTER_SETTINGS);
    await saveFooterSettings(DEFAULT_FOOTER_SETTINGS);
  };

  return { settings, updateSettings, resetToDefault };
}
