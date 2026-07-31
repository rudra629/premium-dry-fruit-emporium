## 1. Forgot password page (`/forgot-password`)

A three-step flow on one page, matching the existing `/auth` glass-card styling (gold accents, cream text, `IconField` inputs):

1. **Email step** — user enters email, clicks "Send OTP". Validates email format, then generates a 6-digit demo OTP.
2. **OTP step** — 6-digit input with resend option and a "change email" link. Since this is the existing demo/local auth (no email backend), the generated OTP is shown to the user in a toast/inline hint so the flow is testable. Wrong code shows an error; code expires after 10 minutes.
3. **New password step** — "New password" and "Confirm new password" fields with a live requirements checklist. On success, the password is saved locally, the user is signed in, and they're redirected to `/profile`.

A "Forgot password?" link is added under the password field on the sign-in form in `src/routes/auth.tsx`.

## 2. Password requirements

Rules: minimum 6 characters, at least 1 number, at least 1 special character.

- Shared validator helper in `src/lib/auth-store.tsx` (or a small `password.ts`) so one rule set is used everywhere.
- Live checklist UI (tick/cross per rule) shown on the Sign-up form and on the reset-password step.
- Submit blocked with an inline/toast error until all rules pass; confirm-password must match.
- Applied to sign-up and password reset. Sign-in keeps just "enter your password" so existing demo accounts don't break.

## 3. Stop "chill" from jumping

In `src/styles.css`, the `letter-wave` keyframes translate and rotate each letter (lines 253-259). The per-letter motion is removed so the letters sit still; the color/glow `hue-cycle` animation stays untouched, so "chill" keeps its glowing gradient look without any bouncing.

## Technical notes

- Auth remains the current local/demo store (`src/lib/auth-store.tsx`, localStorage) — no real email is sent; the OTP is client-generated and displayed. If you later want real email OTP delivery, that needs Lovable Cloud.
- New file: `src/routes/forgot-password.tsx`. Edited: `src/routes/auth.tsx`, `src/lib/auth-store.tsx`, `src/styles.css`.
- The new route gets its own `head()` with a unique title and description.
