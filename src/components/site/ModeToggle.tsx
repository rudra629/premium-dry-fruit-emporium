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

  // Light frosted glass on /crunch (dark page), premium dark glass on main site
  const themeClasses = isCrunch
    ? "bg-white/85 text-neutral-900 border border-white/60 hover:bg-white shadow-[0_10px_40px_-8px_rgba(255,178,107,0.5)]"
    : "bg-forest-deep/90 text-cream border border-gold/30 hover:bg-forest-deep shadow-[0_12px_40px_-8px_rgba(10,40,24,0.55)]";

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={handleClick}
          aria-label={isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
          className={`group relative overflow-hidden rounded-full pl-2 pr-5 py-2 font-medium text-sm transition-all duration-300 backdrop-blur-md flex items-center gap-2.5 hover:scale-[1.03] active:scale-95 ${themeClasses}`}
        >
          <span
            className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-500 group-hover:rotate-[360deg] ${
              isCrunch ? "bg-neutral-900 text-white" : "bg-gold text-forest-deep"
            }`}
          >
            {isCrunch ? <Coffee className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </span>
          <span className="tracking-wide whitespace-nowrap">
            {isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
          </span>
          <ArrowRight className="w-4 h-4 -ml-0.5 transition-transform duration-300 group-hover:translate-x-1" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
            style={{
              background: isCrunch
                ? "linear-gradient(90deg, transparent, rgba(255,178,107,0.35), transparent)"
                : "linear-gradient(90deg, transparent, rgba(233,196,106,0.25), transparent)",
            }}
          />
        </button>
      </div>

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
