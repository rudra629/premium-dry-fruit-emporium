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

/** Height of the sticky site chrome, so the hero never sits under the navbar. */
function chromeOffset() {
  if (typeof document === "undefined") return 0;
  const header = document.querySelector("header.site-chrome") as HTMLElement | null;
  return header ? Math.round(header.getBoundingClientRect().height) : 0;
}

function homeStartTop() {
  const el = document.getElementById(HOME_START_ID);
  if (!el) return 0;
  return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - chromeOffset()));
}

/** Set while a programmatic scroll is in flight, so gates stay out of the way. */
let programmaticUntil = 0;
function isProgrammatic() {
  return performance.now() < programmaticUntil;
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
  const top = homeStartTop();
  programmaticUntil = performance.now() + (jump ? 300 : 1800);
  if (lenis) {
    lenis.scrollTo(top, jump ? { immediate: true, force: true } : { duration: 1.4, force: true });
  } else {
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
    // Armed as soon as the viewport is at (or below) the home hero — including
    // on a fresh landing that skipped straight past the intro.
    let armed = window.scrollY >= homeStartTop() - 8;
    let released = false;
    let stopped = false;
    let gestures = 0;
    let lastBlocked = 0;

    const resume = () => {
      if (!stopped) return;
      stopped = false;
      getLenis()?.start();
    };

    const arm = () => {
      if (window.scrollY >= homeStartTop() - 8) armed = true;
    };
    arm();
    window.addEventListener("scroll", arm, { passive: true });

    let lastSettle = 0;

    const blockUp = (delta: number) => {
      if (isProgrammatic()) return false;
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
        if (y >= top - 8) armed = true;
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
      // Ease back to the hero instead of hard-jumping — the gate should feel
      // like a soft magnet, not a wall.
      if (now - lastSettle > 260 && Math.abs(y - top) > 2) {
        lastSettle = now;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(top, { duration: 0.55, force: true });
        else window.scrollTo({ top, behavior: "smooth" });
      }
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
      window.removeEventListener("scroll", arm);
      window.removeEventListener("wheel", onWheel, true);
      window.removeEventListener("touchstart", onTouchStart, true);
      window.removeEventListener("touchmove", onTouchMove, true);
      // Leaving home (nav to /shop etc.) counts as having seen the intro, so
      // coming back lands on the hero instead of replaying the sequence.
      if (window.scrollY > 40) markIntroSeen();
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
    <div ref={ref} className="relative bg-[#0a0a0c]">
      {/* The collapsed site-chrome strip at the very top exposes the page
          backdrop; `html.intro-active` (see styles.css) darkens it so no warm
          "brown band" shows above the intro. */}
      <GramsHero />

      <GramsSlider />
      {/* seam: fade the intro into the home hero's base colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(180deg, transparent 0%, #0a0a0c 100%)" }}
      />
      {mounted ? createPortal(skipButton, document.body) : null}
    </div>


  );
}
