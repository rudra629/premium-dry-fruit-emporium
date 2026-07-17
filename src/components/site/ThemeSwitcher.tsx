import { useEffect, useState } from "react";
import { Palette, Check, X } from "lucide-react";

type ThemeKey = "default" | "saffron" | "orchard" | "royal";

const THEMES: { key: ThemeKey; label: string; blurb: string; swatch: string[] }[] = [
  { key: "default", label: "Grams Original", blurb: "Cream · Forest · Gold",           swatch: ["#FFF6E4", "#0A3B24", "#D4A24C"] },
  { key: "saffron", label: "Saffron & Spice", blurb: "Peach · Terracotta · Saffron",   swatch: ["#FFE8D2", "#8A2E1A", "#E4A020"] },
  { key: "orchard", label: "Lush Orchard",    blurb: "Pistachio · Forest · Emerald",   swatch: ["#DDEBD1", "#0F3B24", "#0F9D58"] },
  { key: "royal",   label: "Royal Harvest",   blurb: "Blush · Plum · Berry",           swatch: ["#F3E4EF", "#3D1E4A", "#B5195E"] },
];

const STORAGE_KEY = "grams:theme";

function applyTheme(theme: ThemeKey) {
  const html = document.documentElement;
  html.classList.remove("theme-saffron", "theme-orchard", "theme-royal");
  if (theme === "default") {
    html.removeAttribute("data-theme");
  } else {
    html.classList.add(`theme-${theme}`);
    html.setAttribute("data-theme", theme);
  }
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeKey>("default");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeKey | null) ?? "default";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const pick = (t: ThemeKey) => {
    setTheme(t);
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  return (
    <div className="fixed z-[55] left-4 bottom-4 md:left-6 md:bottom-6 pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-start gap-3">
        {open && (
          <div
            className="w-[280px] rounded-2xl border shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)] p-3 animate-fade-up backdrop-blur-xl"
            style={{
              background: "rgb(var(--color-surface) / 0.65)",
              borderColor: "rgb(var(--color-surface) / 0.6)",
              color: "rgb(var(--color-text-primary))",
            }}
            role="dialog"
            aria-label="Theme picker"
          >
            <div className="flex items-center justify-between px-1 pb-2">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase opacity-70">Client Review</p>
                <p className="font-display text-sm">Select a theme</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 hover:bg-black/5 tx"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {THEMES.map((t) => {
                const active = theme === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => pick(t.key)}
                    className="group flex items-center gap-3 rounded-xl px-2.5 py-2 text-left tx border"
                    style={{
                      borderColor: active ? "rgb(var(--color-text-primary) / 0.3)" : "transparent",
                      background: active ? "rgb(var(--color-surface) / 0.85)" : "transparent",
                    }}
                  >
                    <div className="flex -space-x-1.5">
                      {t.swatch.map((c, i) => (
                        <span
                          key={i}
                          className="h-6 w-6 rounded-full ring-2 ring-white/80 shadow-sm"
                          style={{ background: c }}
                        />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[13px] leading-tight truncate">{t.label}</p>
                      <p className="text-[10.5px] opacity-60 truncate">{t.blurb}</p>
                    </div>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 px-1 pt-1 text-[9.5px] opacity-50 tracking-wider uppercase">
              Preview only · not saved to production
            </p>
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="glass-pill"
          aria-expanded={open}
        >
          <Palette className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Client Review:</span> Themes
        </button>
      </div>
    </div>
  );
}
