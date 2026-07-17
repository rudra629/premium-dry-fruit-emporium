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
    ? "bg-white/15 hover:bg-white/25 border-white/25 text-cream"
    : "bg-white/30 hover:bg-white/45 border-white/50 text-forest-deep";

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
        className="mode-toggle-btn group focus-visible:outline-none"
      >
        <span
          className={[
            "relative inline-flex items-center justify-center gap-2",
            "rounded-full border backdrop-blur-md",
            "px-5 py-3 sm:px-6 sm:py-3.5",
            "text-[11px] sm:text-xs font-semibold uppercase tracking-widest",
            "transition-all duration-300 ease-out",
            surfaceClass,
          ].join(" ")}
        >
          {isCrunch ? (
            <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-[-12deg]" />
          ) : (
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12" />
          )}
          <span>{isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 -ml-0.5 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
        </span>
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
