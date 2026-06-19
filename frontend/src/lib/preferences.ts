import type { WalletProfile } from "@/types/fibersave";

const STORAGE_KEY = "fibersave.preferences.v1";

type PreferredCurrency = WalletProfile["preferredCurrency"];
type Preferences = Record<string, PreferredCurrency>;

function readPreferences(): Preferences {
  if (typeof window === "undefined") return {};

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getPreferredCurrency(ownerAddress?: string | null): PreferredCurrency {
  const key = ownerAddress ?? "default";
  return readPreferences()[key] ?? "USD";
}

export function setPreferredCurrency(
  currency: PreferredCurrency,
  ownerAddress?: string | null,
) {
  const key = ownerAddress ?? "default";
  const preferences = readPreferences();
  preferences[key] = currency;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export function clearPreferences(ownerAddress?: string) {
  if (typeof window === "undefined") return;

  if (!ownerAddress) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  const preferences = readPreferences();
  delete preferences[ownerAddress];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}
