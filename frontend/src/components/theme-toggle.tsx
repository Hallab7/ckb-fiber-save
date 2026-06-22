"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getThemeSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("fibersave-theme-change", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("fibersave-theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => "light");

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("fibersave.theme", nextTheme);
    window.dispatchEvent(new Event("fibersave-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 inline-flex size-12 items-center justify-center border border-[var(--border-strong)] bg-[var(--background)] text-[var(--foreground)] sm:bottom-6 sm:right-6"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
