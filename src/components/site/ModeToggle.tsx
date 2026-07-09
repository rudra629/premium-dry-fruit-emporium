import { useEffect, useState } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Zap, Coffee } from "lucide-react";

export function ModeToggle() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isCrunch = pathname.startsWith("/crunch");
  const [phase, setPhase] = useState<"idle" | "flipping">("idle");

  // Apply body theme class for crunch mode
  useEffect(() => {
    document.documentElement.classList.toggle("crunch-mode", isCrunch);
    return () => document.documentElement.classList.remove("crunch-mode");
  }, [isCrunch]);

  const handleClick = async () => {
    if (phase === "flipping") return;
    // If entering crunch and not already on home, go home first
    if (!isCrunch && pathname !== "/") {
      await router.navigate({ to: "/" });
      await new Promise((r) => setTimeout(r, 350));
    }
    setPhase("flipping");
    // Mid-flip, swap the route
    window.setTimeout(() => {
      router.navigate({ to: isCrunch ? "/" : "/crunch" });
    }, 550);
    // End flip
    window.setTimeout(() => setPhase("idle"), 1150);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`mode-toggle-btn ${isCrunch ? "is-crunch" : "is-cozy"}`}
        aria-label={isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
      >
        <span className="mode-toggle-inner">
          {isCrunch ? <Coffee className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          <span className="mode-toggle-label">
            {isCrunch ? "Enter Cozy Mode" : "Enter Crunch Mode"}
          </span>
        </span>
        <span className="mode-toggle-glow" aria-hidden />
      </button>

      {phase === "flipping" && (
        <div className="flip-stage" aria-hidden>
          <div className={`flip-card ${isCrunch ? "to-cozy" : "to-crunch"}`}>
            <div className="flip-face flip-front" />
            <div className="flip-face flip-back" />
          </div>
        </div>
      )}
    </>
  );
}
