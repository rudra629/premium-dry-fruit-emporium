Goal: Make the word "chill" in the hero headline cycle through a gradient that includes a white shade, so the letters briefly glow white as part of their color animation.

Current state:
- `src/routes/index.tsx` renders "chill" with `animate-hue-cycle` on each letter.
- `src/styles.css` defines `@keyframes hue-cycle` stepping through red, orange, yellow, green, cyan, purple and back to red. A white text-shadow glow was already added in a previous change, but the letter color itself never hits white.

Plan:
1. Edit `src/styles.css` `@keyframes hue-cycle` to insert a white color stop into the cycle.
   - Keep the existing 8s duration and linear timing.
   - Insert a white (`#ffffff`) keyframe around the midpoint or near the existing yellow/cyan transition so the letters briefly flash white before continuing the rainbow loop.
   - Preserve the existing layered text-shadows (white shade + colored glow + drop shadow) so the white letter color blends with the white glow.
2. Verify visually in the preview that "chill" now visibly turns white during its animation while the rest of the cycle remains smooth.

No other files need changes.