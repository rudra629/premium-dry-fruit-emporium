# Rebrand: Forest Green → Espresso & Amber

Swap the primary brand direction from forest greens to a warm, premium "Espresso & Amber" palette across the entire site. Purely a visual/theming change — no logic, layout, or copy changes.

## New palette

- Espresso (primary deep): `#2A1810` — replaces `--forest-deep`
- Cocoa (primary mid): `#4A2C1A` — replaces `--forest`
- Amber (accent): `#D4A24C` — refines `--gold` to be warmer/richer
- Amber soft: `#EBC98A` — refines `--gold-soft`
- Cream bg: `#F5E9D0` (already close, keep warm)
- Terracotta accent: keep (harmonizes)

## Changes

### 1. `src/styles.css` — token layer (single source of truth)
- Redefine `--forest-deep`, `--forest`, `--gold`, `--gold-soft` in `:root` to the new oklch values matching hex above.
- Keep the token *names* (`--forest`, `--forest-deep`, `color-forest*`) so every component that references `bg-forest-deep`, `text-forest`, etc. updates automatically without touching JSX.
- Update body radial gradient (`#FDFAF6 → #F6ECD8 → #F0E5D1`) to a slightly warmer creamy caramel tone that pairs with espresso (keep same brightness so texture/noise still reads).
- Update `.dark` overrides that reference forest hues to espresso equivalents.
- Update `.add-btn-fill` background from `var(--forest-deep)` (already token-based, auto-updates).
- Curtain "to-cozy" gradient greens → swap the `rgba(46,70,55,...)` moss tint to a warm espresso `rgba(74,44,26,...)`.
- Fruit loader core gradient — uses tokens, auto-updates.

### 2. Hardcoded color audit (grep + fix)
Scan and replace any hardcoded green hex/rgb literals in:
- `src/routes/*.tsx` (index, shop, product.$slug, cart, checkout, order-success, profile, admin, contact, story, auth, crunch)
- `src/components/site/*.tsx` (Header, Footer, ProductCard, ModeToggle, FruitLoader)
- Any inline `style={{ background: '#...green...' }}`, `shadow-[...]` with green, `from-green-*`/`to-emerald-*` Tailwind classes, `rgba(46,70,...)` moss tints.
Replace with the token classes (`bg-forest-deep` etc., which now render as espresso) or with new amber/cream tokens where a green literal was used for accent.

### 3. Hero background image
The current `src/assets/hero-bg.jpg` is dark forest-green marble. Regenerate as **dark espresso-brown marble with golden amber veins** and the same brass tray of nuts/dried fruits + left-side negative space. Save to same path so no import changes needed.

### 4. Favicon / theme-color meta
If a `theme-color` meta exists in `__root.tsx` head with a green hex, update to `#2A1810`. (Verify during implementation; skip if absent.)

## Out of scope
- No layout, spacing, typography, animation, copy, or component-structure changes.
- Terracotta, cream, ink tokens stay as-is.
- Crunch mode (dark inverted theme) stays as-is except where a green literal appears in the curtain gradient.

## Verification
- Build passes.
- Playwright screenshot of `/` at desktop + mobile viewport — confirm no green remains in header, hero, marquee, product cards, buttons, footer.
- Screenshot of `/shop`, `/product/walnut-whole-cali`, `/cart`, `/checkout`, `/admin` — spot-check same.
