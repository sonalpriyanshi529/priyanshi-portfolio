import { useEffect, useRef } from "react";

const INTERACTIVE = "a[href], button, [role='button'], summary, input, select, textarea, label";
const RING_LERP = 0.2;

/**
 * Subtle desktop-only cursor: a small dot plus a softly trailing ring.
 * - Only enabled for (hover: hover) and (pointer: fine), and never with
 *   prefers-reduced-motion (the native cursor stays in those cases).
 * - All movement happens through refs + requestAnimationFrame: no React state
 *   or re-renders on mouse move.
 * - Uses its own passive pointermove listener; it never touches or replaces the
 *   listeners used by CharacterCanvas.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const root = document.documentElement;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let teardown = null;

    function enable() {
      if (teardown) return;
      const st = { x: 0, y: 0, rx: 0, ry: 0, seen: false, raf: 0 };

      const setVisible = (v) => {
        dot.classList.toggle("is-visible", v);
        ring.classList.toggle("is-visible", v);
      };

      const loop = () => {
        st.rx += (st.x - st.rx) * RING_LERP;
        st.ry += (st.y - st.ry) * RING_LERP;
        dot.style.transform = `translate3d(${st.x}px, ${st.y}px, 0)`;
        ring.style.transform = `translate3d(${st.rx}px, ${st.ry}px, 0)`;
        if (Math.abs(st.x - st.rx) > 0.1 || Math.abs(st.y - st.ry) > 0.1) {
          st.raf = requestAnimationFrame(loop);
        } else {
          st.raf = 0; // settled: stop the loop until the next movement
        }
      };
      const kick = () => {
        if (!st.raf) st.raf = requestAnimationFrame(loop);
      };

      const onMove = (e) => {
        if (e.pointerType && e.pointerType !== "mouse") return;
        st.x = e.clientX;
        st.y = e.clientY;
        if (!st.seen) {
          st.seen = true;
          st.rx = st.x;
          st.ry = st.y;
          setVisible(true);
        }
        kick();
      };
      const onOver = (e) => {
        const t = e.target;
        const hit = t instanceof Element && !!t.closest(INTERACTIVE);
        ring.classList.toggle("is-hover", hit);
      };
      const onDown = () => ring.classList.add("is-down");
      const onUp = () => ring.classList.remove("is-down");
      const onLeave = () => setVisible(false);
      const onEnter = () => {
        if (st.seen) setVisible(true);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointerenter", onEnter);
      window.addEventListener("blur", onLeave);
      root.classList.add("has-custom-cursor");

      teardown = () => {
        cancelAnimationFrame(st.raf);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        root.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("pointerenter", onEnter);
        window.removeEventListener("blur", onLeave);
        root.classList.remove("has-custom-cursor");
        setVisible(false);
        ring.classList.remove("is-hover", "is-down");
        teardown = null;
      };
    }

    function sync() {
      if (fine.matches && !reduce.matches) enable();
      else if (teardown) teardown();
    }

    sync();
    fine.addEventListener("change", sync);
    reduce.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduce.removeEventListener("change", sync);
      if (teardown) teardown();
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={ringRef} className="cursor cursor--ring" />
      <div ref={dotRef} className="cursor cursor--dot" />
    </div>
  );
}
