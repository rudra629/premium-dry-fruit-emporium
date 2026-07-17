import { useEffect, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Zap, Coffee, ArrowRight } from "lucide-react";

export function ModeToggle() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCrunch = pathname.startsWith("/crunch");
  const [phase, setPhase] = useState<"idle" | "playing">("idle");

  useEffect(() => {
    document.documentElement.classList.toggle("crunch-mode", isCrunch);
    return () => document.documentElement.classList.remove("crunch-mode");
  }, [isCrunch]);

  const handleClick = async () => {
    if (phase === "playing") return;
    if (!isCrunch && pathname !== "/") {
      await router.navigate({ to: "/" });
      await new Promise((r) => setTimeout(r, 300));
    }
    setPhase("playing");
    window.setTimeout(() => {
      router.navigate({ to: isCrunch ? "/" : "/crunch" });
    }, 800);
    window.setTimeout(() => setPhase("idle"), 1750);
  };

  const targetLabel = isCrunch ? "COZY" : "CRUNCH";
  const targetSub = isCrunch ? "Welcome home" : "Turn it up";

  // Glassmorphic surface — theme-aware via tokens.
  // Cozy (light cream): tinted white glass with forest-deep ink.
  // Crunch (dark): tinted white glass with warm cream ink.
  const surfaceClass = isCrunch
    ? "bg-white/15 hover:bg-white/25 text-cream"
    : "bg-white/30 hover:bg-white/45 text-forest-deep";

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
        className={[
          "mode-toggle-btn group fixed z-[60]",
          "right-[clamp(14px,3vw,28px)] bottom-[clamp(14px,3vw,28px)]",
          "relative inline-flex items-center justify-center gap-2",
          "rounded-full backdrop-blur-md",
          "px-5 py-3 sm:px-6 sm:py-3.5",
          "text-[11px] sm:text-xs font-semibold uppercase tracking-widest",
          "shadow-[0_8px_30px_-8px_rgba(0,0,0,0.25)]",
          "transition-all duration-300 ease-out",
          "hover:scale-[1.02] hover:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.35)]",
          "active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
          isCrunch ? "focus-visible:ring-white/60" : "focus-visible:ring-forest-deep/40",
          surfaceClass,
        ].join(" ")}
      >
        {isCrunch ? (
          <Coffee className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-[-12deg]" />
        ) : (
          <Zap className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12" />
        )}
        <span className="relative z-10">{isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}</span>
        <ArrowRight className="relative z-10 w-3.5 h-3.5 sm:w-4 sm:h-4 -ml-0.5 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
      </button>

      {phase === "playing" && (
        <div className={`curtain-stage ${isCrunch ? "to-cozy" : "to-crunch"}`} aria-hidden>
          <div className="curtain curtain-top">
            <div className="curtain-grain" />
          </div>
          <div className="curtain-bottom-wrap">
            <div className="curtain curtain-bottom">
              <div className="curtain-grain" />
            </div>
          </div>
          <div className="curtain-center">
            <div className="curtain-eyebrow">
              <span>✦</span>
              <span>Entering</span>
              <span>✦</span>
            </div>
            <div className="curtain-word" data-text={targetLabel}>
              {targetLabel.split("").map((c, i) => (
                <span key={i} style={{ animationDelay: `${0.55 + i * 0.05}s` }}>{c}</span>
              ))}
            </div>
            <div className="curtain-sub">{targetSub}</div>
          </div>
        </div>
      )}
    </>
  );
}
