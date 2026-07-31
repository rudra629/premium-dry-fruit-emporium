## Goal

Make the opening sequence (hero → "scroll to explore" products → home) feel like one continuous, buttery scroll: no brown band, no bouncing back up to the products after "Skip down", no snappy jerks.

## What's wrong today

The product showcase does not scroll — it fakes scrolling. `GramsSlider` listens to `wheel`/`touchmove` in capture phase, calls `preventDefault()`, stops Lenis, force-jumps the page back to the section top on every event, and swaps slides with a hard 850ms cooldown. That is exactly what "choppy / cheap" feels like: every gesture is either swallowed or teleported, and the slide change is a discrete jump instead of a scrub.

The same mechanism causes the snap-back: after "Skip down" moves you to the home hero, a downward wheel event can still be read as "section visible", and `pin()` yanks the page back to the products.

The brown band above the home hero is a seam colour mismatch between the intro stage (dark green mesh + warm blob) and the home hero background. Exact source will be confirmed in the browser before it's changed (the intro wrapper, the hero mesh gradient's warm radial, and the home hero's own top gradient are the three candidates).

## The fix

**1. Replace scroll-jacking with a real pinned track (the core change)**

Rewrite the scroll mechanics of `src/components/showcase/GramsSlider.tsx` to use the same technique `GramsHero` already uses successfully:

- The section becomes a tall track (`height: (N+1) × 100vh`, N = 5 products) containing a `sticky top-0 h-screen` stage.
- `useScroll({ target, offset: ["start start", "end end"] })` gives `scrollYProgress`; a light `useSpring` smooths it.
- Active slide = `progress × N`, so the browser's own (Lenis-smoothed) scroll drives the sequence. Scroll speed, direction, momentum, trackpad, touch and keyboard all just work.
- Transitions become crossfades/scrubs tied to the fractional part of progress rather than `AnimatePresence` jump-cuts on a discrete index, so a slow scroll shows a slow, continuous blend.
- Delete every `preventDefault`, `lenis.stop()`, `pin()`, `advance()` cooldown and the touch handlers. No event is ever swallowed.

Consequences: the user can never get stuck, can never be teleported, and "the lock" becomes the natural result of the sticky stage — you must scroll the full track to pass the last product, which is the requested behaviour, achieved smoothly.

**2. Skip down / scroll-back correctness**

- With the pin gone, `scrollToHomeStart()` is a plain Lenis scroll to the `#home-start` anchor; nothing can pull it back.
- `src/components/site/IntroSequence.tsx`: keep the "park at the hero on the first upward gesture" gate, but soften it — instead of `lenis.stop()` + hard `scrollTo(immediate)`, clamp with a short eased `scrollTo`, and drop the gate entirely while a programmatic scroll (skip-down) is in flight, so the two systems can't fight.

**3. Brown seam**

- Verify in the browser which layer paints the band, then remove it: align the intro stage's exit colour, the `IntroSequence` seam gradient, and the home hero's top colour to one shared value so the handoff is a single continuous surface (likely tightening the warm `rgba(120,90,55,…)` radial in the hero mesh and extending the seam fade).

**4. Verification**

Playwright pass at desktop and mobile widths: scroll through the whole intro capturing frames (confirm no brown band, continuous slide blending), press "Skip down" then scroll down (confirm the page continues into home and never returns to the products), and scroll up twice from the home hero (confirm park-then-enter still works).

## Technical notes

- Files touched: `src/components/showcase/GramsSlider.tsx` (scroll mechanics rewrite, visuals kept), `src/components/site/IntroSequence.tsx` (gate softening, seam), `src/components/showcase/GramsHero.tsx` and/or `src/styles.css` (seam colour only).
- No changes to routing, product data, admin, cart, or any other page.
- Lenis stays as the global smooth-scroll driver; the sequence stops fighting it instead of stopping it.
