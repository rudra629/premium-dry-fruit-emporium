import { useRouterState } from "@tanstack/react-router";
import { useFlip } from "@/lib/flip-transition";
import { ArrowUpRight } from "lucide-react";

export function BrandSwitchButton() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { flipTo, phase } = useFlip();
  const onChips = pathname === "/chips";

  // Hide on admin
  if (pathname.startsWith("/admin")) return null;

  const targetPath = onChips ? "/" : "/chips";
  const busy = phase !== "idle";

  const handleClick = () => {
    if (busy) return;
    flipTo(targetPath);
  };

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-label={onChips ? "Back to Grams" : "Visit Crnch chips"}
      className={
        "fixed z-[70] bottom-5 right-5 md:bottom-6 md:right-6 group " +
        "inline-flex items-center gap-2.5 rounded-full pl-1.5 pr-4 md:pr-5 py-1.5 " +
        "text-[11px] md:text-xs font-semibold tracking-[0.14em] uppercase " +
        "border transition-all duration-300 " +
        "hover:-translate-y-0.5 active:scale-[0.97] " +
        (onChips
          ? // On chips (dark) → button matches Grams (cream/forest)
            "bg-[#f6efe1] text-[#1a2b1f] border-[#1a2b1f]/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] hover:bg-white"
          : // On main (cream) → button matches Chips (dark)
            "bg-[#0a0a0a] text-white border-white/10 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] hover:bg-black") +
        (busy ? " opacity-70 cursor-wait" : "")
      }
    >
      <span
        className={
          "grid place-items-center w-6 h-6 rounded-full font-display font-bold text-[13px] leading-none " +
          (onChips
            ? "bg-[#1a2b1f] text-[#c4ff3d]"
            : "bg-[#c4ff3d] text-black")
        }
      >
        {onChips ? "G" : "C"}
      </span>
      <span className="flex items-center gap-1.5">
        {onChips ? "Back to Grams" : "Try Crnch Chips"}
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
