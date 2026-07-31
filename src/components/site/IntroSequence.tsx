import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GramsHero } from "@/components/showcase/GramsHero";
import { GramsSlider } from "@/components/showcase/GramsSlider";
import { getLenis } from "@/lib/smooth-scroll";

export const INTRO_SEEN_KEY = "grams_intro_seen";
export const HOME_START_ID = "home-start";

export function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasSeenIntro() {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Smoothly (or instantly) move the viewport to the start of the real home page. */
export function scrollToHomeStart(immediate = false) {
  const el = document.getElementById(HOME_START_ID);
  if (!el) return;
  const lenis = getLenis();
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis && !immediate && !reduced) {
    lenis.scrollTo(el, { duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: immediate || reduced ? "auto" : "smooth" });
  }
}

export function IntroSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const [showSkip, setShowSkip] = useState(true);

  // Mark the intro as seen once the user has scrolled past it, and hide the
  // skip affordance while they are below it.
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const past = window.scrollY > el.offsetHeight * 0.75;
      setShowSkip(!past);
      if (past) markIntroSeen();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const skipButton = (
    <button
      type="button"
      onClick={() => {
        markIntroSeen();
        scrollToHomeStart();
      }}
      aria-label="Skip the intro and go to the shop"
      className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 items-center gap-2 rounded-full border border-gold/40 bg-black/50 px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] text-cream backdrop-blur-xl transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-[#0a0a0c] ${
        showSkip ? "flex" : "hidden"
      }`}
    >
      Skip down
      <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
    </button>
  );

  return (
    <div ref={ref} className="relative bg-[#050b08]">
      <GramsHero />
      <GramsSlider />
      {mounted ? createPortal(skipButton, document.body) : null}
    </div>
  );
}

