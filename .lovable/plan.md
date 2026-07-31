## Goal

Bring the uploaded `grams-scroll-showcase` animation into the live site as a cinematic **intro sequence that sits above the homepage**. First visit lands on the intro; after scrolling through it you arrive at the normal home page. Returning to `/` from Shop/other pages skips straight to home. Scrolling up from the top of home takes you back into the intro. A "Skip down" control auto-scrolls to home.

## What gets added

The uploaded project contains a sticky 300vh scroll hero (`GramsHero`) plus an ingredient slider (`GramsSlider`), built on `framer-motion`, with supporting parts: `IngredientHalo`, `ParticleBurst`, `MagneticButton`, and 10 image assets (brazil nuts, chia, kiwi, prunes, raisins + ingredient cut-outs).

Steps:

1. **Dependency** — install `framer-motion` (the current site uses GSAP/Lenis; both can coexist).
2. **Assets** — the uploaded asset pointers belong to a different project, so their URLs won't resolve here. Re-register each image into this project's asset store and regenerate the pointer JSONs under `src/assets/showcase/`.
3. **Components** — copy `GramsHero`, `GramsSlider`, `IngredientHalo`, `ParticleBurst`, `MagneticButton` into `src/components/showcase/`. Drop `MagneticCursor` (the custom `cursor: none` override would fight the rest of the site).
4. **Styling fit** — the showcase is designed on black; the site's dark theme matches, so only the surrounding wrapper background and font families get aligned (Fraunces / Manrope / Space Mono).

## Intro behaviour

A new `IntroSequence` wrapper renders above the home content inside `src/routes/index.tsx`:

```text
┌──────────── #intro (300vh sticky hero + slider) ───────────┐
│  scroll ↓ …  animation scrubs …  [ Skip down ▾ ]           │
└─────────────────────────────────────────────────────────────┘
┌──────────── #home-start (existing homepage) ───────────────┐
```

- **First visit** (no `grams_intro_seen` flag in sessionStorage): page stays at scroll 0, intro plays as you scroll.
- **Flag set** once the user passes into the home block or hits Skip.
- **Return to `/` from another route**: on mount, if the flag is set, jump instantly (no animation) to `#home-start` before paint, so there's no flash of the intro.
- **Scroll up from top of home**: nothing special needed — the intro is the same document above home, so scrolling up naturally re-enters it bottom-to-top.
- **Skip down button**: fixed, bottom-centre, styled to match the site's frosted-pill aesthetic; smooth-scrolls (via Lenis) to `#home-start` and sets the flag. Hidden once past the intro.
- **Header / Footer / Crunch toggle / chat button** are hidden or faded out while the intro is on screen, then fade in at the handoff.
- **Reduced motion**: intro is bypassed entirely (page starts at home) for `prefers-reduced-motion`.

## Technical notes

- `PageTransition` in `src/routes/__root.tsx` currently smooth-scrolls to top on every route change; it needs a home-specific branch that targets `#home-start` instead of `0` when the intro has already been seen, and still respects back/forward (`popstate`).
- Lenis smooth scroll stays active; Framer's `useScroll` reads window scroll, so scrubbing stays in sync in both directions.
- The intro block only mounts on `/`; no other route is touched.
- Scroll flag uses `sessionStorage` so a fresh browser session replays the intro once.

## Files

- new: `src/components/showcase/*` (5 components), `src/components/site/IntroSequence.tsx`, `src/assets/showcase/*.asset.json`
- edited: `src/routes/index.tsx`, `src/routes/__root.tsx`, `src/styles.css`, `package.json`
