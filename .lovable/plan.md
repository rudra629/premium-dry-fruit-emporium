## Goal

Five fixes around the intro → home transition on the home page.

## 1. Side rails ("Est · 2025 · India" / "Farm · Roast · Pack · Ship")

The rail markup still exists in `src/routes/index.tsx` (fixed left/right, `z-[1]`), but it is not visible over the home hero. Cause is unconfirmed — first step is to check in the running preview whether the hero's stacking context (`section` with absolute gradient overlays and `z-10` content) paints over `z-[1]`. Fix by lifting the rails above the hero backdrop (raise z-index / move them inside the hero stacking order) and confirming visually on desktop, keeping them hidden below `lg` as today.

## 2. Brown background when scrolling up

Investigate the strip visible between the home hero and the intro: likely the `IntroSequence` wrapper (`bg-[#050b08]`) vs the hero's `linear-gradient(#0a0a0c …)` plus the intro hero's warm overlay bleeding at the seam. Fix by matching the seam colours (shared dark base behind both sections) so no brown band appears mid-scroll.

## 3. Upward hero lock should always be armed

Today `IntroSequence`'s gate only sets `armed = true` after the user has scrolled well below the hero, so on a fresh land at home the first upward gesture goes straight into the intro. Change the gate so it is armed whenever the page is at/below the home-start anchor (including on mount and after route navigation to `/`), so scrolling up always parks at the hero first and needs a second deliberate gesture to re-enter the intro.

## 4. Navbar covering the "Crunch" headline

Keep the header size unchanged. Instead give the home hero top spacing equal to the header height (announcement bar + header, ~ 80/112px via a CSS var), and use that same offset when scrolling to the home-start anchor, so the headline starts below the navbar rather than underneath it.

## 5. Returning to Home should land on the hero, not the top

`index.tsx` only skips the intro when `hasSeenIntro()` is true, and that flag is only written after scrolling past the intro — so a user who skipped or navigated early gets sent to the intro top. Mark the intro as seen as soon as the user navigates away from `/` (or lands on home content at all), and make the home-mount jump land at the hero start with the header offset applied, without breaking browser back/forward.

## Technical notes

Files involved: `src/routes/index.tsx`, `src/components/site/IntroSequence.tsx`, `src/components/showcase/GramsSlider.tsx` (release path), `src/components/site/Header.tsx` (only to expose header height as a CSS var), `src/styles.css`.

Verification: Playwright run on the live preview at desktop and mobile widths — check rails visible, no brown seam while scrolling up, headline clear of the navbar, upward gesture parking at hero, and shop → home landing on the hero.
