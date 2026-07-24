
## 1. Product detail page — full-screen hero with auto-slideshow

**File:** `src/routes/product.$slug.tsx`

Restructure the top of the page so the **first viewport = only image + title/description/origin**. Everything else (price, weights, qty, add-to-cart, badges, shipping strip, story, nutrition, related) moves below the fold.

- Wrap current hero in a `min-h-[calc(100vh-<header>)]` section, 2-column grid on desktop (`lg:grid-cols-2`), stacked on mobile.
- **Left**: large product image, fills the column height. Fades between `slides[i].image` (200–300ms cross-fade, same slot/size).
- **Right**: vertically centered
  - Category eyebrow
  - `h1` = current slide's `title` (falls back to `product.name`)
  - Slide `description` paragraph
  - **Origin** stays fixed (never changes across slides)
  - Slide dots / progress bar for the auto-swipe
- Auto-advance every ~4s via `setInterval`; pause on hover; reset on manual dot click. Cleaned up on unmount + slug change.
- Everything currently under the hero (price block, weight chips, qty + Add-to-bag button, wishlist/share, badges chips, shipping/freshness/recyclable strip, Story, Nutrition, "You might also love") stays intact but rendered **after** the hero section so the user must scroll for it. Add a small scroll-cue chevron at the bottom of the hero.

### Slide data source (admin-editable)

Extend the `Product` type in `src/lib/products.ts`:

```ts
slides?: { image: string; title: string; description: string }[];
```

Fallback logic in the page: if `slides` is empty/undefined, synthesise a single slide from `{ image: product.image, title: product.name, description: product.tagline }` — so existing products keep working with zero migration.

### Admin editor

In `src/routes/admin.tsx` `AddProductForm`:
- New "Detail slideshow" section (below the main image field).
- Repeating rows: image upload (FileReader → dataURL, same helper as main image) + title input + description textarea + remove button + "Add slide".
- On submit, include `slides` in the constructed `Product`.

`site-store` needs no schema change (products are persisted as-is in `grams:extra-products`).

For the baked-in `products` array we won't seed slides — they'll just use the single-image fallback until an admin edits them. (Editing baseline products is out of scope; only newly added products get custom slides, matching how the admin panel already works.)

## 2. Cart per-item cap of 30

**File:** `src/lib/cart-store.tsx`
- In `add`: cap `qty` at 30 when merging (`Math.min(30, existing.qty + i.qty)`); if already at 30, toast "Max 30 per product".
- In `setQty`: clamp to `Math.min(30, Math.max(1, qty))`.

**Files with qty inputs** — clamp UI + show inline hint:
- `src/routes/product.$slug.tsx` — the +/- qty stepper (disable `+` at 30).
- `src/routes/cart.tsx` — same clamp on its qty stepper.

Uses `sonner` toast (already imported across the app) for the max-reached feedback.

## 3. Hide ugly scrollbars in chatbot + admin

**File:** `src/styles.css` — add a utility:

```css
@utility no-scrollbar {
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}
```

Apply `no-scrollbar` to:
- `src/components/site/HealthChat.tsx` — the messages scroll container.
- `src/routes/admin.tsx` — the horizontal tabs strip (line 39, `overflow-x-auto`) and any `overflow-x-auto` table wrappers.

Scrolling still works; just the visible track/thumb are hidden.

## Out of scope
- No theme/color changes, no changes to header/footer/home hero.
- Base catalog products won't get pre-authored slideshows this pass.
