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

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
        className={`mode-toggle-btn ${isCrunch ? "is-crunch" : "is-cozy"}`}
      >
        <span className="mode-toggle-inner">
          <span className="mode-toggle-sheen" aria-hidden />
          <span className="mode-toggle-disc">
            {isCrunch ? <Coffee className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </span>
          <span className="mode-toggle-label">
            {isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
          </span>
          <span className="mode-toggle-arrow" aria-hidden>
            <ArrowRight />
          </span>
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

