## Scope

Ten linked changes across branding, home, auth, a new gifting page, a new AI chatbot, and admin.

---

### 1. Logo enlargement
- `src/components/site/Header.tsx`: bump logo mark + wordmark heights (mark ~44px mobile / 56px desktop, wordmark scales to match). Adjust header height so nav still aligns.
- `src/components/site/Footer.tsx`: matching enlargement.

### 2. Typography system
- Load **Fraunces** (italic 400/600), **Manrope** (400/500/600/700), **Space Mono** (400/700) via `<link>` tags in `src/routes/__root.tsx` head (per Tailwind v4 remote-font rule).
- `src/styles.css` `@theme`: set `--font-display: "Fraunces"`, `--font-sans: "Manrope"`, add `--font-mono: "Space Mono"`. Retain Instrument Serif only if still used, else drop.
- Sweep components: headlines/logo/product names use `font-display italic` where branded; body/nav uses default sans (Manrope); prices, lot numbers, tickers get `font-mono`.
  - Files touched: `ProductCard.tsx`, `index.tsx`, `product.$slug.tsx`, `shop.tsx`, `cart.tsx`, `checkout.tsx`, `order-success.tsx`, `admin.tsx`, `Header.tsx`, `Footer.tsx`.

### 3. Hero + home highlights redesign
- `src/routes/index.tsx`: rebuild hero with two rotating "mode" pills ("Crunch" / "Chill") and a prominent promo banner ("Flat 20% off — code CRUNCH20"). Keep dark theme + existing pouch composition but restructure headline block.
- Add new **Product Highlights** row(s): "Bestsellers" and "New Arrivals" carousels/grids sourced from `products.ts` flags.
- Price rendering: helper component `<Price original compareAt />` — cut price with strikethrough + offer price, both in Space Mono. Roll out to `ProductCard`, `product.$slug`, cart, checkout.

### 4. Gifting page (dark, admin-editable)
- New route `src/routes/gifting.tsx` — permanently darker palette (deeper black surface, gold accents) even though site is already dark; use luxe blacks + gold foil borders to differentiate.
- Three categories: Corporate, Birthday, Festive. Each shows curated gift boxes (title, subtitle, price, image, contents list, CTA).
- Data source: `SiteProvider` (`src/lib/site-store.tsx`) gains a `giftBoxes` array persisted to localStorage with default seed.
- `src/routes/admin.tsx`: new "Gifting" section — add/edit/delete boxes with category selector, image URL, price, description, contents.
- Header nav: add "Gifting" link under Company/main nav.

### 5. Home yellow band (already admin-editable per earlier work) — no change unless it breaks after theme sweep.

### 6. AI Health Chatbot
- New floating widget `src/components/site/HealthChat.tsx`, mounted globally in `__root.tsx` (bottom-left so it doesn't collide with the Cozy/Crunch toggle bottom-right).
- Flow:
  1. Greeting → "What health or daily issue are you facing?" with quick-reply chips: Low energy, Digestion, Skin, Memory, Workout recovery, Sleep, Immunity, Other (free text).
  2. Rule-based mapping (no external AI needed) `src/lib/health-map.ts`: issue → { explanation, recommendedSlugs[] }.
     - Memory → Walnuts, Almonds/Hazelnuts
     - Digestion → Dried Pineapple (bromelain), Cranberries
     - Skin → Sunflower seeds (vit E), Macadamia
     - Energy → Dried Mango, Cranberries
     - Recovery → Pumpkin seeds, Pecans
     - etc.
  3. Renders explanation + inline **product cards** with image, name, mono-price, and "Add to cart" CTA wired to `useCart().add`.
- Purely client-side, no API keys, no backend. Persistable minimal chat state in component.

### 7. Social login modal
- Rebuild `src/routes/auth.tsx` (or wrap as modal component `AuthModal.tsx` triggered from Header account icon) with:
  - Continue with Google (primary)
  - Facebook, Instagram, X (Twitter) icon buttons
  - Divider → email register/sign-in form
- Style: matches current dark theme, glassmorphism card, Fraunces italic heading, Manrope body.
- Buttons are UI-only (no OAuth backend hookup — matches existing mock auth pattern). Note in closing message.

### 8. Ratings & reviews (post-order)
- Extend cart/orders in `SiteProvider`: after an order reaches status `Delivered`, `src/routes/profile.tsx` "My orders" shows a "Rate this order" panel per line item → 1–5 stars + optional text review.
- Store reviews in `SiteProvider.reviews: { productSlug, rating, text, user, orderId, createdAt }[]` persisted to localStorage.
- Product page (`product.$slug.tsx`) reads reviews list and averages user reviews with the seeded rating; shows reviews list under nutrition.
- Admin panel new "Reviews" section: list all reviews, filter by product, delete/hide.

### 9. Admin panel additions
- New tabs/sections in `src/routes/admin.tsx`: **Gifting** (CRUD), **Reviews** (moderate).
- Existing order-status editing preserved.

### 10. Data + store changes
- `src/lib/site-store.tsx`: add `giftBoxes`, `reviews`, plus CRUD actions; keep backward-compatible localStorage read.
- `src/lib/health-map.ts`: new.
- No backend / no Lovable Cloud enablement — everything client-side as with existing store.

---

### Technical notes

```text
routes/
  __root.tsx         (fonts, mount <HealthChat />)
  index.tsx          (hero redesign, highlights, Price component)
  gifting.tsx        (NEW)
  auth.tsx           (social buttons)
  admin.tsx          (Gifting + Reviews tabs)
  profile.tsx        (post-delivery rating UI)
  product.$slug.tsx  (reviews section, mono prices)
components/site/
  HealthChat.tsx     (NEW)
  Price.tsx          (NEW)
  AuthModal.tsx      (optional wrapper)
  Header.tsx / Footer.tsx (bigger logo, Gifting link)
lib/
  site-store.tsx     (+giftBoxes, +reviews)
  health-map.ts      (NEW)
styles.css           (font tokens)
```

Fonts loaded via `<link>` in `__root.tsx` head (Fraunces italic, Manrope, Space Mono) — never `@import` remote URLs in `styles.css`.

Chatbot is rule-based to stay dependency-free; can be upgraded to Lovable AI Gateway later if you want real LLM answers — say the word and I'll wire it in a follow-up.

No new backend; all persistence stays in localStorage via `SiteProvider`, matching current architecture.
