## Plan

### Goal
Increase the size of the Product of the Month walnut pouch image on mobile view only, while keeping the desktop layout unchanged.

### Current State
- In `src/routes/index.tsx`, the Product of the Month section uses:
  - `w-full max-w-[210px] sm:max-w-[220px] md:max-w-md`
- The user previously requested a mobile-only increase to `max-w-[210px]`, but reports it is still too small.

### Change
Update the Product of the Month image classes to use a larger mobile-only max-width while preserving the existing `sm` and `md` breakpoints:

```
w-full max-w-[260px] sm:max-w-[280px] md:max-w-md
```

This targets the mobile viewport (below `sm` / 640px) with a larger pouch, keeps the small-tablet step modest, and leaves desktop untouched.

### Verification
After the edit, preview the home page on a 390px mobile viewport to confirm the walnut pouch is visibly larger and still proportionally balanced with the text block.