import { useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Flame, Leaf } from "lucide-react";

const BANDS = 6;
const BAND_STAGGER = 75; // ms
const BAND_DURATION = 520; // ms
const COVER_TOTAL = BAND_DURATION + (BANDS - 1) * BAND_STAGGER;

export function BrandSwitchButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"idle" | "cover" | "hold" | "uncover">("idle");
  const onChips = pathname === "/chips";

  // Hide on admin so it doesn't clash with editing UI
  const hidden = pathname.startsWith("/admin");

  const targetPath = onChips ? "/" : "/chips";
  const label = onChips ? "Back to Grams" : "Try our Chips";
  const Icon = onChips ? Leaf : Flame;

  // Overlay uses the destination theme color (what's about to appear).
  const overlayBg = onChips ? "var(--cream)" : "#0a0a0a";
  const overlayAccent = onChips ? "var(--forest-deep)" : "#ff5b2e";

  const handleClick = useCallback(async () => {
    if (phase !== "idle") return;

    // If we're not on home when leaving the main site, hop home first so the
    // flip transitions from the hero, per the requested feel.
    if (!onChips && pathname !== "/") {
      navigate({ to: "/" });
      await new Promise((r) => setTimeout(r, 420));
    }

    setPhase("cover");
    await new Promise((r) => setTimeout(r, COVER_TOTAL));

    setPhase("hold");
    navigate({ to: targetPath });
    await new Promise((r) => setTimeout(r, 90));

    setPhase("uncover");
    await new Promise((r) => setTimeout(r, COVER_TOTAL + 40));

    setPhase("idle");
  }, [phase, onChips, pathname, navigate, targetPath]);

  if (hidden) return null;

  const busy = phase !== "idle";

  return (
    <>
      {/* Floating switcher button */}
      <button
        onClick={handleClick}
        disabled={busy}
        aria-label={label}
        className={
          "fixed z-[60] bottom-5 right-5 md:bottom-7 md:right-7 group " +
          "inline-flex items-center gap-2 rounded-full px-4 py-2.5 md:px-5 md:py-3 " +
          "text-xs md:text-sm font-semibold tracking-wide " +
          "shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md " +
          "border transition-all duration-300 " +
          "hover:-translate-y-0.5 active:scale-95 " +
          (onChips
            ? "bg-cream text-forest-deep border-forest-deep/20 hover:bg-white"
            : "bg-[#0a0a0a] text-white border-white/10 hover:bg-black") +
          (busy ? " opacity-70 cursor-wait" : "")
        }
      >
        <span
          className={
            "grid place-items-center w-5 h-5 rounded-full transition-transform duration-500 group-hover:rotate-[20deg] " +
            (onChips ? "bg-forest-deep text-gold" : "bg-[#ff5b2e] text-black")
          }
        >
          <Icon className="w-3 h-3" />
        </span>
        <span>{label}</span>
        <span
          className={
            "ml-0.5 h-1.5 w-1.5 rounded-full animate-pulse " +
            (onChips ? "bg-forest-deep" : "bg-[#ff5b2e]")
          }
        />
      </button>

      {/* Flip overlay */}
      {phase !== "idle" && (
        <div
          aria-hidden
          className="fixed inset-0 z-[80] pointer-events-none flex flex-col"
          style={{ perspective: "1400px" }}
        >
          {Array.from({ length: BANDS }).map((_, i) => {
            const isCovering = phase === "cover";
            const isUncovering = phase === "uncover";
            const isHold = phase === "hold";
            const delay =
              (isCovering ? i : BANDS - 1 - i) * BAND_STAGGER;

            const initial = isCovering
              ? "rotateX(-92deg)"
              : "rotateX(0deg)";
            const finalT = isCovering || isHold
              ? "rotateX(0deg)"
              : "rotateX(92deg)";

            return (
              <div
                key={i}
                className="flip-band"
                style={{
                  flex: 1,
                  background: overlayBg,
                  borderTop: i === 0 ? "none" : `1px solid ${overlayAccent}12`,
                  transformOrigin: "top center",
                  transform: isHold ? "rotateX(0deg)" : initial,
                  animation: isHold
                    ? undefined
                    : `${isCovering ? "flip-cover" : "flip-uncover"} ${BAND_DURATION}ms cubic-bezier(.7,.05,.2,1) ${delay}ms forwards`,
                  boxShadow: `inset 0 1px 0 ${overlayAccent}18`,
                }}
              >
                {/* Accent stripe for a little style */}
                <div
                  className="w-full h-[2px]"
                  style={{ background: overlayAccent, opacity: 0.35 }}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
