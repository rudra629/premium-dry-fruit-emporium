import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

type Phase = "idle" | "out" | "in";

type Ctx = {
  phase: Phase;
  flipTo: (path: string) => void;
};

const FlipCtx = createContext<Ctx>({ phase: "idle", flipTo: () => {} });

export const useFlip = () => useContext(FlipCtx);

const OUT_MS = 520;
const IN_MS = 560;

export function FlipProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const runningRef = useRef(false);

  // Backdrop color = the destination's theme, so during the edge-on moment
  // there's no white flash.
  const [backdrop, setBackdrop] = useState<string>("transparent");

  const flipTo = useCallback(
    async (path: string) => {
      if (runningRef.current) return;
      if (path === pathname) return;
      runningRef.current = true;

      // Set backdrop to destination background before flipping
      const isChipsTarget = path === "/chips";
      setBackdrop(isChipsTarget ? "#0a0a0a" : "var(--cream)");

      setPhase("out");
      await new Promise((r) => setTimeout(r, OUT_MS));

      navigate({ to: path });
      // let the new route commit
      await new Promise((r) => setTimeout(r, 40));

      setPhase("in");
      await new Promise((r) => setTimeout(r, IN_MS));

      setPhase("idle");
      setBackdrop("transparent");
      runningRef.current = false;
    },
    [navigate, pathname],
  );

  // Reset if user navigates via other means mid-flip (safety)
  useEffect(() => {
    return () => {
      runningRef.current = false;
    };
  }, []);

  return (
    <FlipCtx.Provider value={{ phase, flipTo }}>
      <div className="flip-stage" data-flip-phase={phase}>
        <div
          aria-hidden
          className="flip-backdrop"
          style={{ background: backdrop, opacity: phase === "idle" ? 0 : 1 }}
        />
        <div className="flip-card">{children}</div>
      </div>
    </FlipCtx.Provider>
  );
}
