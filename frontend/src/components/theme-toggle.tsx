"use client";

import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("fibersave.theme", theme);
}

export function ThemeToggle() {
  function toggleTheme() {
    applyTheme(readTheme() === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 inline-flex size-12 items-center justify-center border border-[var(--border-strong)] bg-[var(--background)] text-[var(--foreground)] sm:bottom-6 sm:right-6"
      aria-label="Toggle color theme"
      title="Toggle light and dark mode"
    >
      <Moon className="theme-icon-light" size={18} />
      <Sun className="theme-icon-dark" size={18} />
    </button>
  );
}
