import { useEffect, useRef } from "react";
import {
  FRAME_COUNT,
  angleToFrame,
  lerpRing,
  ringDelta,
  pointToCompassAngle,
} from "../lib/frameMap.js";

const CENTER_SRC = "/center.webp";
const frameSrc = (i) => `/frames/frame-${String(i).padStart(3, "0")}.webp`;

// The source frames are 1280x720 with the character in the middle and a small
// generator sparkle at the far right. We draw a fixed crop that keeps the whole
// character and excludes the sparkle. Aspect ratio is preserved exactly.
const SRC_X = 230;
const SRC_W = 800;
const SRC_H = 720;

// Where the head/eyes sit inside the canvas (fraction of width/height).
const HEAD_X = 0.5;
const HEAD_Y = 0.4;

const DEAD_ZONE = 0.12; // fraction of available radius
const SMOOTHING = 9; // higher = snappier

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });

export default function CharacterCanvas({ heroRef, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    const hero = heroRef?.current ?? canvas.parentElement;

    // Mutable, high-frequency values live in refs/closures — no React state.
    const s = {
      frames: new Array(FRAME_COUNT).fill(null),
      center: null,
      ready: false,
      cssW: 0,
      cssH: 0,
      pointer: { x: 0, y: 0, active: false },
      current: 0, // fractional frame position on the ring
      target: 0,
      drawnKey: null,
      raf: 0,
      last: 0,
      alive: true,
      visible: true, // paused while the hero is scrolled out of view
    };

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      s.cssW = rect.width;
      s.cssH = rect.height;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      s.drawnKey = null; // force redraw
    }

    function draw(key, img) {
      if (s.drawnKey === key || !img) return;
      s.drawnKey = key;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      // Exactly one image per paint; the crop has the same aspect as the canvas.
      ctx.drawImage(img, SRC_X, 0, SRC_W, SRC_H, 0, 0, canvas.width, canvas.height);
    }

    function updateTarget() {
      if (!finePointer.matches || !s.pointer.active) {
        s.target = 0;
        s.inDead = true;
        return;
      }
      const c = canvas.getBoundingClientRect();
      const h = hero.getBoundingClientRect();
      const cx = c.left + c.width * HEAD_X;
      const cy = c.top + c.height * HEAD_Y;
      const dx = s.pointer.x - cx;
      const dy = s.pointer.y - cy;
      // Available radius: distance from the head to the farthest hero corner.
      const R = Math.max(
        Math.hypot(h.left - cx, h.top - cy),
        Math.hypot(h.right - cx, h.top - cy),
        Math.hypot(h.left - cx, h.bottom - cy),
        Math.hypot(h.right - cx, h.bottom - cy)
      );
      const dist = Math.hypot(dx, dy);
      if (dist < R * DEAD_ZONE) {
        s.target = 0;
        s.inDead = true;
      } else {
        s.target = angleToFrame(pointToCompassAngle(dx, dy));
        s.inDead = false;
      }
    }

    function tick(now) {
      if (!s.alive) return;
      const dt = Math.min(0.05, (now - (s.last || now)) / 1000);
      s.last = now;

      if (s.ready && s.visible) {
        updateTarget();
        const t = 1 - Math.exp(-SMOOTHING * dt);
        s.current = lerpRing(s.current, s.target, t);
        // Snap when essentially arrived to avoid endless micro-updates.
        if (Math.abs(ringDelta(s.current, s.target)) < 0.02) s.current = s.target;

        const idx = Math.round(s.current) % FRAME_COUNT;
        if (idx === 0 && s.inDead) {
          draw("center", s.center);
        } else {
          draw(idx, s.frames[idx] || s.center);
        }
      }
      s.raf = requestAnimationFrame(tick);
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      s.pointer.x = e.clientX;
      s.pointer.y = e.clientY;
      s.pointer.active = true;
    };
    const onLeave = () => {
      s.pointer.active = false;
    };

    // Load center first so something shows immediately, then all 64 frames.
    loadImage(CENTER_SRC)
      .then((img) => {
        if (!s.alive) return;
        s.center = img;
        s.ready = true;
        s.drawnKey = null;
      })
      .catch(console.error);

    const tasks = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      tasks.push(
        loadImage(frameSrc(i)).then((img) => {
          if (s.alive) s.frames[i] = img;
        })
      );
    }
    Promise.all(tasks).catch(console.error);

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
    });
    io.observe(hero);
    s.raf = requestAnimationFrame(tick);

    return () => {
      s.alive = false;
      io.disconnect();
      cancelAnimationFrame(s.raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [heroRef]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Illustrated portrait of Priyanshi whose gaze follows your cursor"
    />
  );
}
