## Goal
Reskin the entire "Grams" site from the current forest-green + gold + cream palette to the soft sage/mint palette from your reference (#659287 deep sage, mid sage, #B1D3B9 light sage, pale mint), done tastefully — not a blind find-and-replace.

## New palette (mapped intentionally)

| Role | Token | Hex | Where it shows |
|---|---|---|---|
| Primary deep | `--sage-deep` | `#3F6F66` (deepened from #659287 for text/contrast) | Headlines, primary buttons, header text, footer bg |
| Brand mid | `--sage` | `#659287` | Section accents, hover fills, Add-to-cart fill |
| Soft accent | `--sage-soft` | `#B1D3B9` | Cards, chips, marquee band, badges |
| Pale wash | `--mint-wash` | `#E4F1E1` | Section backgrounds, hover states |
| Warm neutral | `--cream` | `#F5F1E8` (kept, slightly cooler) | Page background base |
| Ink | `--ink` | `#1B2A26` (sage-tinted near-black) | Body copy |
| Accent pop | `--clay` | `#C97B5E` (kept terracotta, retuned warmer) | Sale price, "Best Seller" tag, small CTAs — keeps the site from going monochrome-green |

Rationale: the reference is a monotone sage stack. Using only those 4 greens would flatten hierarchy and kill the premium feel, so I keep one warm accent (retuned terracotta) for price/tags, and deepen the darkest sage for AA text contrast on cream.

## Where the change lands

1. **`src/styles.css`** — single source of truth
   - Replace `--forest-deep`, `--forest`, `--gold`, `--gold-soft`, `--cream`, `--terracotta` values with the new tokens above (keep variable *names* so no component breaks).
   - Update body background gradient: cream → pale mint wash (`#F5F1E8` → `#EAF0E4` → `#DDE8DC`) instead of the current warm sandy gradient.
   - Retune grain overlay opacity (0.22 → 0.16) since sage is cooler and grain reads heavier on green.
   - Dark (`.dark`) block: swap forest-deep bg for a deeper sage `#22403A`.
   - Curtain "to-cozy" gradient: swap gold/forest tints for sage tints so the transition matches the new brand.
   - Add-btn fill, cart-bump glow, shadow-glow: recompute against `--sage-deep`.

2. **Hero background (`src/assets/hero-bg.jpg`)** — the current dark forest-green marble will clash with sage. Regenerate as a soft sage marble with subtle brass/cream veining and the same right-weighted flat-lay composition, so the hero reads on-brand.

3. **`src/routes/index.tsx`** — audit for any hardcoded color classes (yellow marquee band, gold accents, forest text). Convert marquee band to `bg-sage-soft` with deep-sage text. The floating rating card retunes to cream-on-sage.

4. **`src/routes/crunch.tsx`** — Crunch mode is the *opposite* theme. Since cozy is now sage/mint, crunch shifts to warm charcoal + amber (already close). Retune its accents so the flip transition still feels like a true inversion.

5. **`ModeToggle`, `ProductCard`, `Header`, `Footer`** — no structural changes; they consume tokens. Only spot-fix any hardcoded `text-forest`/`bg-gold` literal utility that reads wrong after the token swap (quick visual pass, not a rewrite).

## What I will NOT do
- No layout changes, no typography changes, no component restructuring.
- No touching cart/checkout/admin logic.
- No blind global sed — each token is remapped with intent, then I visually verify hero, shop grid, product page, and crunch flip on desktop + mobile via a Playwright screenshot pass before handing back.

## Verification
Screenshot home (desktop + 390px mobile), shop, product detail, and crunch page after the swap; check contrast on headlines and Add button; confirm the hero marble reads sage, not muddy.
