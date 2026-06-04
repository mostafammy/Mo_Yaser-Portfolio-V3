/*
 * ─── ThemeProvider ────────────────────────────────────────────────────────────
 * PURPOSE:  Provides light/dark theme context to the entire app.
 *           Manages the `.dark` class on <html>, persists preference to localStorage,
 *           and respects system `prefers-color-scheme` on first visit.
 *
 * WHEN TO USE:
 *   - Wrap once in the root layout — every consumer (e.g. FancyDarkModeToggle) gets
 *     theme state via `useTheme()`.
 *   - ⚠️ DO NOT wrap again inside pages or components — this is a singleton provider.
 *
 * API:
 *   const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();
 *   - theme:         'light' | 'dark' — the user's explicit choice (null before mount).
 *   - resolvedTheme: 'light' | 'dark' — the effective theme (falls back to system).
 *   - toggleTheme(): flips between light/dark.
 *   - setTheme(t):   forces a specific theme.
 * ──────────────────────────────────────────────────────────────────────────────
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme | null;
  resolvedTheme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    return null;
  }
  return null;
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme | null>(null);

  const resolvedTheme: Theme = theme ?? getSystemTheme();

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyThemeClass(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* localStorage may be restricted */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  /* --- Hydrate from storage / system on mount --- */
  useEffect(() => {
    const stored = getStoredTheme();
    const initial = stored ?? getSystemTheme();
    setThemeState(initial);
    applyThemeClass(initial);
  }, []);

  /* --- Listen for system preference changes when no explicit theme is set --- */
  useEffect(() => {
    if (theme) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const sys = mq.matches ? "dark" : "light";
      setThemeState(sys);
      applyThemeClass(sys);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, toggleTheme, setTheme }),
    [theme, resolvedTheme, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}
