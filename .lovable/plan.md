## Hero section tweaks (src/routes/index.tsx)

Scope is strictly the hero. Nothing else changes. Rating card ("Freshest cranberries…— Riya, Mumbai") stays exactly as-is.

### 1. Headline copy + RGB "chill"
Replace `Snack like nature intended.` with:

```
Crunch
chill
repeat
```

- Same font sizing/weights as current H1, three lines.
- Keep generous line-height (do not tighten the gap — use current `leading-tight md:leading-[0.92]` or slightly looser so lines don't collide).
- `chill` gets a slow RGB color cycle via a new keyframe in `src/styles.css` (`@keyframes hue-cycle` animating `color` through red → orange → yellow → green → cyan → blue → violet → red, ~8s linear infinite). Applied as a utility class (e.g. `animate-hue-cycle`) on the `chill` span, italic like current accent word. Speed intentionally slow, not flashy.
- `Crunch` and `repeat` keep current cream/italic treatment.

### 2. Replace pouch stack with a single rotating product
Reference image shows one large product locked on the right side. Rebuild the right column (both desktop `hidden lg:block` block and the mobile pouches block) as:

- One image slot, fixed position + size (desktop ~w-[420px] centered in the right column; mobile ~w-[70%] centered).
- Cycles through all `products` (or a curated 6–8 slugs incl. walnut, macadamia, mango, cranberry, pineapple, pumpkin, kiwi, hazelnut) — one product visible at a time.
- Interval: 500ms as the user asked (`setInterval` 500ms, cleaned up on unmount). No slide/carousel — just swap the `src`, with a subtle 200ms fade/scale so it doesn't feel jarring at that speed.
- Position and size stay constant across swaps.
- Floating rating card stays absolutely positioned over/next to the image, unchanged content and styling. Desktop keeps left-center placement; mobile keeps current placement.

### Technical notes

```text
src/routes/index.tsx
  - useState + useEffect for rotating index
  - new <RotatingProduct /> local component
  - replace desktop pouch-stack div (lines ~109–131)
  - replace mobile pouch composition (lines ~135–159), preserving rating card
  - update H1 markup (lines ~70–79)

src/styles.css
  - @keyframes hue-cycle { 0%,100% color red … through spectrum }
  - @utility animate-hue-cycle { animation: hue-cycle 8s linear infinite }
```

No other files, no other sections, no theme/token changes.
