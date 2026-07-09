import { useEffect } from "react";

/**
 * Wow.js-style scroll reveal.
 * Auto-tags common section-level elements inside <main> and observes them,
 * adding `.in-view` when they scroll into the viewport.
 */
export function useReveal(pathname: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Give the page a tick to render
    const rafId = requestAnimationFrame(() => {
      const root = document.querySelector("main");
      if (!root) return;

      // Tag section-level blocks + explicit opt-ins
      const selector = [
        "section",
        "article",
        "[data-reveal]",
        "main > div > section",
      ].join(",");
      const targets = new Set<Element>();
      root.querySelectorAll(selector).forEach((el) => targets.add(el));

      let i = 0;
      targets.forEach((el) => {
        if (!el.classList.contains("reveal")) {
          el.classList.add("reveal");
          (el as HTMLElement).style.setProperty("--reveal-delay", `${(i % 4) * 80}ms`);
        }
        i++;
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in-view");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
      );

      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Elements already above the fold get revealed immediately
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add("in-view");
        } else {
          io.observe(el);
        }
      });

      // store for cleanup
      (window as unknown as { __reveal_io?: IntersectionObserver }).__reveal_io = io;
    });

    return () => {
      cancelAnimationFrame(rafId);
      const w = window as unknown as { __reveal_io?: IntersectionObserver };
      w.__reveal_io?.disconnect();
    };
  }, [pathname]);
}
