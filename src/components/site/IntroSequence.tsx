import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { GramsHero } from "@/components/showcase/GramsHero";
import { GramsSlider } from "@/components/showcase/GramsSlider";
import { getLenis } from "@/lib/smooth-scroll";
import { setIntroActive } from "@/lib/intro-visibility";

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

function homeStartTop() {
  const el = document.getElementById(HOME_START_ID);
  if (!el) return 0;
  return Math.round(el.getBoundingClientRect().top + window.scrollY);
}

/** Smoothly (or instantly) move the viewport to the start of the real home page. */
export function scrollToHomeStart(immediate = false) {
  const el = document.getElementById(HOME_START_ID);
  if (!el) return;
  const lenis = getLenis();
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const jump = immediate || reduced;
  if (lenis) {
    lenis.scrollTo(el, jump ? { immediate: true } : { duration: 1.4 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: jump ? "auto" : "smooth" });
  }
}


export function IntroSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const [showSkip, setShowSkip] = useState(true);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Track whether the intro fills the viewport (hides the site chrome), and
  // remember it as "seen" once the user has scrolled past it.
  useEffect(() => {
    let raf = 0;
    const evaluate = () => {
      raf = 0;
      const top = homeStartTop();
      const past = window.scrollY > top - 8;
      setShowSkip(!past);
      setIntroActive(!past);
      document.documentElement.classList.toggle("intro-active", !past);
      if (past) markIntroSeen();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      setIntroActive(false);
      document.documentElement.classList.remove("intro-active");
    };
  }, []);

  // Upward gate: scrolling up inside home parks at the top of the hero. Only a
  // second, deliberate upward gesture unlocks the intro again.
  useEffect(() => {
    let armed = false; // becomes true once the user is properly inside home
    let released = false;
    let stopped = false;
    let gestures = 0;
    let lastBlocked = 0;

    const resume = () => {
      if (!stopped) return;
      stopped = false;
      getLenis()?.start();
    };

    const blockUp = (delta: number) => {
      const top = homeStartTop();
      const y = window.scrollY;

      if (y > top + 160) {
        armed = true;
        released = false;
        gestures = 0;
        resume();
        return false;
      }
      if (delta >= 0) {
        resume();
        return false;
      }
      if (!armed || released) return false;

      const now = performance.now();
      if (now - lastBlocked > 420) gestures += 1;
      lastBlocked = now;
      if (gestures >= 2) {
        released = true;
        resume();
        return false;
      }
      const lenis = getLenis();
      if (lenis) {
        lenis.stop();
        stopped = true;
        lenis.scrollTo(top, { immediate: true, force: true });
      }
      window.scrollTo({ top, behavior: "auto" });
      return true;
    };



    const onWheel = (e: WheelEvent) => {
      if (blockUp(e.deltaY)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = startY - e.touches[0].clientY;
      if (Math.abs(dy) < 10) return;
      if (blockUp(dy)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
    };
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
