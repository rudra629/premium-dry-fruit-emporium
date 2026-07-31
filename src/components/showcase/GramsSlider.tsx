import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";

import brazilAsset from "@/assets/products/Hazelnuts_F.asset.json";
import chiaAsset from "@/assets/products/Pumpkin_Seeds_F.asset.json";
import kiwiAsset from "@/assets/products/Dried_Kiwi_F.asset.json";
import prunesAsset from "@/assets/products/Dreid_Mango_F.asset.json";
import raisinsAsset from "@/assets/products/Dried_Cranberry_F.asset.json";
import { ParticleBurst } from "./ParticleBurst";
import { IngredientHalo } from "./IngredientHalo";

type Slide = {
  image: string;
  ingredient: "brazil" | "chia" | "kiwi" | "prune" | "raisin";
  title: string;
  eyebrow: string;
  description: string;
  bg: string;
  accent: string;
  ink: string;
  soft: string;
};

const SLIDES: Slide[] = [
  {
    image: brazilAsset.url,
    ingredient: "brazil",
    eyebrow: "Hand-picked · Turkish groves",
    title: "Roasted Hazelnuts",
    description:
      "Deeply roasted, buttery and vitamin-E rich — the crunch that starts every Grams ritual.",
    bg: "#2a1b3d",
    accent: "#e9d8b4",
    ink: "#f6ecd8",
    soft: "#8b6fb0",
  },
  {
    image: chiaAsset.url,
    ingredient: "chia",
    eyebrow: "Cold-pressed superfood",
    title: "Pumpkin Seeds",
    description:
      "Magnesium, zinc and clean plant protein. Small green engines for a long working day.",
    bg: "#3d2817",
    accent: "#f0d9a8",
    ink: "#f7ead0",
    soft: "#c48a5a",
  },
  {
    image: kiwiAsset.url,
    ingredient: "kiwi",
    eyebrow: "Sun-dried · No preservatives",
    title: "Dried Kiwi Slices",
    description:
      "Tangy, sweet, and perfectly chewy. A vibrant burst of Vitamin C with zero artificial preservatives.",
    bg: "#1e3d2f",
    accent: "#d4e8b8",
    ink: "#eaf5d8",
    soft: "#6ea86a",
  },
  {
    image: prunesAsset.url,
    ingredient: "prune",
    eyebrow: "Orchard-sourced · Ratnagiri",
    title: "Dried Mango Strips",
    description:
      "Slow sun-dried at peak ripeness. Naturally sweet, undeniably rich, nothing added.",
    bg: "#4a1d3e",
    accent: "#f2c8dc",
    ink: "#f8dfea",
    soft: "#b56592",
  },
  {
    image: raisinsAsset.url,
    ingredient: "raisin",
    eyebrow: "Antioxidant-rich · Small batch",
    title: "Dried Cranberries",
    description:
      "Tart, jewel-bright and packed with antioxidants — the finish to your daily handful.",
    bg: "#1a1b3d",
    accent: "#d8cff0",
    ink: "#ece7f8",
    soft: "#6a5fa8",
  },
];


const EASE = [0.16, 1, 0.3, 1] as const;

const textVariants: Variants = {
  initial: { y: 80, opacity: 0, filter: "blur(8px)" },
  enter: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: 0.25 + i * 0.11, duration: 1.1, ease: EASE },
  }),
  exit: (i: number) => ({
    y: -50,
    opacity: 0,
    filter: "blur(6px)",
    transition: { delay: i * 0.05, duration: 0.5, ease: EASE },
  }),
};

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

export function GramsSlider() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const isMobile = useIsMobile();

  const slide = SLIDES[index];

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);
  };

  // Scroll-jacking on desktop
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top <= 10 && rect.bottom >= window.innerHeight - 10;
      if (!inView) return;

      const goingDown = e.deltaY > 0;
      const atEnd = goingDown ? index === SLIDES.length - 1 : index === 0;
      if (atEnd) return; // release scroll at edges

      e.preventDefault();
      if (lockRef.current) return;
      if (Math.abs(e.deltaY) < 8) return;
      lockRef.current = true;
      go(goingDown ? 1 : -1);
      window.setTimeout(() => (lockRef.current = false), 900);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") go(1);
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    // Touch-based scroll-jacking on mobile: convert vertical swipes into slide changes
    let touchStartY = 0;
    let touchLockedDir = 0;
    const onTouchStartNative = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchLockedDir = 0;
    };
    const onTouchMoveNative = (e: TouchEvent) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top <= 10 && rect.bottom >= window.innerHeight - 10;
      if (!inView) return;
      const dy = touchStartY - e.touches[0].clientY;
      const goingDown = dy > 0;
      const atEnd = goingDown ? index === SLIDES.length - 1 : index === 0;
      if (atEnd) return;
      if (Math.abs(dy) < 40) return;
      e.preventDefault();
      if (lockRef.current) return;
      const dir = goingDown ? 1 : -1;
      if (touchLockedDir === dir) return;
      touchLockedDir = dir;
      lockRef.current = true;
      go(dir);
      window.setTimeout(() => (lockRef.current = false), 900);
    };
    if (isMobile) {
      window.addEventListener("touchstart", onTouchStartNative, { passive: true });
      window.addEventListener("touchmove", onTouchMoveNative, { passive: false });
    }
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStartNative);
      window.removeEventListener("touchmove", onTouchMoveNative);
    };
  }, [index, isMobile]);

  // Mouse parallax
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      mx.set(x);
      my.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile, mx, my]);

  const floaters = useMemo(
    () => [
      { size: 140, x: "10%", y: "18%", depth: 40, blur: 8, rot: -12 },
      { size: 90, x: "42%", y: "72%", depth: 60, blur: 4, rot: 22 },
      { size: 180, x: "55%", y: "12%", depth: 25, blur: 14, rot: 8 },
      { size: 70, x: "8%", y: "78%", depth: 80, blur: 2, rot: -30 },
    ],
    [],
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: "100svh" }}
    >
      {/* Morphing background */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${index}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{
            background: `radial-gradient(120% 80% at 20% 30%, ${slide.soft}55 0%, ${slide.bg} 55%, ${slide.bg} 100%)`,
          }}
        />
      </AnimatePresence>

      {/* Grain / vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Subtle noise grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="grams-slider-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grams-slider-noise)" />
        </svg>
      </div>

      {/* Ingredient halo — mid/background layers (behind product) */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <IngredientHalo
          ingredient={slide.ingredient}
          mx={smx}
          my={smy}
          variant="back"
          isMobile={isMobile}
        />
      </div>

      {/* Dynamic spotlight — tinted by the active product */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`spot-${index}`}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{
            background: `radial-gradient(38% 46% at 30% 55%, ${slide.soft}55, ${slide.soft}11 45%, transparent 72%)`,
          }}
        />
      </AnimatePresence>

      {/* Particle burst — colored by the active slide's theme, replays on index change */}
      <ParticleBurst
        triggerKey={index}
        colors={[slide.accent, slide.soft, slide.ink]}
      />

      {/* Ingredient halo — extreme foreground (over product edges) */}
      {!isMobile && (
        <div className="pointer-events-none absolute inset-0 z-[45]">
          <IngredientHalo
            ingredient={slide.ingredient}
            mx={smx}
            my={smy}
            variant="front"
            isMobile={false}
          />
        </div>
      )}

      {/* Top nav */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-14 md:py-8">
        <div className="flex items-center gap-2" style={{ color: slide.ink }}>
          <span className="font-display text-2xl font-semibold tracking-tight">Grams</span>
          <span className="hidden text-[10px] uppercase tracking-[0.25em] opacity-70 md:inline">
            Beyond snack, it's a lifestyle
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto grid h-full max-w-[1400px] grid-cols-1 grid-rows-[1fr_auto] items-center gap-2 px-5 pb-24 pt-20 md:grid-cols-2 md:grid-rows-1 md:gap-4 md:px-14 md:pb-0 md:pt-0">
        {/* Product */}
        <div className="relative flex min-h-0 items-center justify-center md:h-full">
          {/* Floaters */}
          {!isMobile &&
            floaters.map((f, i) => (
              <Floater
                key={`f-${i}-${index}`}
                f={f}
                i={i}
                mx={smx}
                my={smy}
                accent={slide.accent}
                soft={slide.soft}
              />
            ))}

          {/* Giant word backdrop */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`word-${index}`}
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <span
                className="font-display whitespace-nowrap text-[28vw] font-bold leading-none tracking-tighter md:text-[16vw]"
                style={{ color: slide.ink }}
              >
                {slide.title.split(" ").slice(-1)[0]}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Product image */}
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={`img-${index}`}
              custom={direction}
              className="relative z-10 transform-gpu"
              data-cursor="lens"
              initial={{
                opacity: 0,
                scale: 0.7,
                rotate: direction * 18,
                y: 80,
                filter: "blur(20px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                y: [0, -18, 0],
                filter: "blur(0px)",
                transition: {
                  opacity: { duration: 0.9, ease: EASE },
                  scale: { duration: 1.3, ease: EASE },
                  rotate: { duration: 1.3, ease: EASE },
                  filter: { duration: 0.9, ease: EASE },
                  y: {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  },
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.75,
                rotate: -direction * 16,
                y: -60,
                filter: "blur(16px)",
                transition: { duration: 0.75, ease: EASE },
              }}
              style={{
                x: useTransform(smx, (v) => v * -45),
                y: useTransform(smy, (v) => v * -25),
              }}
            >
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="h-[42vh] w-auto max-w-none select-none object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)] md:h-[78vh]"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text */}
        <motion.div
          className="relative flex flex-col justify-center"
          style={{
            color: slide.ink,
            x: useTransform(smx, (v) => v * 18),
            y: useTransform(smy, (v) => v * 12),
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div key={`text-${index}`} className="max-w-xl">
              <div className="overflow-hidden">
                <motion.p
                  custom={0}
                  variants={textVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="mb-3 text-[10px] uppercase tracking-[0.3em] md:mb-6 md:text-[11px] md:tracking-[0.35em]"
                  style={{ color: slide.accent }}
                >
                  — {slide.eyebrow}
                </motion.p>
              </div>

              <div className="overflow-hidden">
                <motion.h2
                  custom={1}
                  variants={textVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="font-display text-3xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
                >
                  {slide.title}
                </motion.h2>
              </div>

              <div className="mt-3 overflow-hidden md:mt-6">
                <motion.p
                  custom={2}
                  variants={textVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="max-w-md text-sm leading-relaxed opacity-85 md:text-lg"
                >
                  {slide.description}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Progress ticks */}
      <div
        className="absolute bottom-6 right-5 z-30 flex items-center gap-1 md:bottom-10 md:right-14 md:gap-2"
        style={{ color: slide.ink }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className="group relative h-8 w-8"
          >
            <span
              className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 transition-all"
              style={{
                width: i === index ? 24 : 12,
                background: slide.ink,
                opacity: i === index ? 1 : 0.35,
              }}
            />
          </button>
        ))}
      </div>

      {/* Hint */}
      <div
        className="absolute bottom-10 left-1/2 z-30 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] opacity-60 md:block"
        style={{ color: slide.ink }}
      >
        Scroll to explore
      </div>
    </section>
  );
}

export default GramsSlider;

type FloaterProps = {
  f: { size: number; x: string; y: string; depth: number; blur: number; rot: number };
  i: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  accent: string;
  soft: string;
};

function Floater({ f, i, mx, my, accent, soft }: FloaterProps) {
  const tx = useTransform(mx, (v) => v * f.depth);
  const ty = useTransform(my, (v) => v * f.depth);
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: f.x,
        top: f.y,
        width: f.size,
        height: f.size,
        x: tx,
        y: ty,
        filter: `blur(${f.blur}px)`,
        background: `radial-gradient(circle at 30% 30%, ${accent}cc, ${soft}44 60%, transparent 75%)`,
      }}
      initial={{ opacity: 0, scale: 0.6, rotate: f.rot - 20 }}
      animate={{ opacity: 0.9, scale: 1, rotate: f.rot }}
      transition={{ duration: 1.4, ease: EASE, delay: 0.1 + i * 0.08 }}
    />
  );
}