import { useLayoutEffect } from "react";

/**
 * Lightweight scroll reveal.
 * Elements marked with `data-reveal` get `.is-revealed` once they enter the
 * viewport (one-shot). Hidden-until-revealed styling only applies when the
 * `js-reveal` class is present AND the user has not asked for reduced motion
 * (see styles.css), so content is never hidden without JS or for reduced motion.
 */
export default function useReveal() {
  useLayoutEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.classList.remove("js-reveal");
      els.forEach((el) => el.classList.remove("is-revealed"));
    };
  }, []);
}
