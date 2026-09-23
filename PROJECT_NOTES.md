# Project Notes — Part 1 Handoff

Generated during Part 1 (analysis + scaffolding + frame extraction).
Read this before starting Part 2 (cursor tracking + UI build).

## Detected background color (from actual video, not guessed)

- **RGB:** (212, 20, 12)
- **HEX:** `#D4140C`

Determined by sampling border-strip pixels (top/bottom/left/right edges,
6% thickness) across 5 frames spread through the video (start, 25%, 50%,
75%, end) and taking the most common quantized color. Full detail in
`scripts/video_analysis.json`.

## Video facts (source of truth: `scripts/analyze_video.py` output)

- Resolution: 1280 x 720 (16:9)
- FPS: 24.0
- Total frames (actual decoded): 192
- Duration: 8.0s

## Animation notes

The animation is a looping head-turn/gaze cycle on a mostly-stationary
character (shoulders/body barely move; head tilts and eyes redirect).
It is NOT a large full-body directional pose set — treat "directions" as
head-tilt/gaze targets, not distinct body poses.

Frame-difference motion analysis (see `candidate_hold_ranges` in
`scripts/video_analysis.json`) found low-motion "hold" clusters roughly at:

- frames 0–12 (front / neutral — used as center.webp source)
- frames 43–46
- frames 66–68
- frames 84–91
- frames 133–144
- frames 184–191

These are candidates for stable poses, but there were fewer clean holds
(6) than the 9 named waypoints in the brief (CENTER, UP, UP-RIGHT, RIGHT,
DOWN-RIGHT, DOWN, DOWN-LEFT, LEFT, UP-LEFT, CENTER) — the transitions blend
smoothly rather than holding at each compass direction. Part 2 will need
to do its own closer visual mapping of extracted frame indices to
directions when building the cursor-tracking logic; do not assume the
holds above map 1:1 to the 8 compass directions without checking the
actual extracted frames in `public/frames/`.

## Frame extraction

- 64 frames extracted, evenly spaced across all 192 source frames
  (`public/frames/frame-000.webp` ... `frame-063.webp`)
- `public/center.webp` was saved from source frame index 0 (cleanest
  front-facing/neutral pose found on visual inspection)
- All frames are 1280x720, original aspect ratio preserved, no cropping
  or distortion, red background kept as-is
- WebP quality 95, lossy method 6

## What was intentionally NOT built in Part 1

- No cursor tracking
- No custom cursor
- No navigation
- No About/Work/Contact sections
- No final portfolio UI/styling
- `src/App.jsx` is a placeholder that only proves the project boots and
  can load `/center.webp`

## Part 2 — Cursor-tracking hero (completed)

- `src/components/CharacterCanvas.jsx`: canvas renderer, preloads center.webp + 64 frames,
  rAF loop, refs only (no per-mouse React state), one frame drawn per paint, DPR-aware,
  ResizeObserver. Touch/coarse pointers always show center.webp.
- `src/lib/frameMap.js`: angle -> frame mapping + ring `lerpRing` (lerpAngle-style, shortest path).
- Draws a fixed crop of each frame (x 230..1030 of 1280) to keep the character and drop the
  small generator sparkle at the far right. Canvas edges are feathered by CSS mask.
- Dead zone: 12% of the distance from the head to the farthest hero corner.

### Part 2 frame mapping (visually verified; compass angle clockwise from up)
| Direction   | Angle | Frame |
|-------------|-------|-------|
| up          | 0     | 9     |
| up-right    | 45    | 13    |
| right       | 90    | 20    |
| lower-right | 135   | 27    |
| down        | 180   | 35    |
| lower-left  | 225   | 43    |
| left        | 270   | 50    |
| upper-left  | 315   | 56    |
| (wrap)      | 360   | 73 -> 9 (sweeps through neutral frames 60-63, 0-8) |

Frames 0-6 and 58-63 are neutral/center-like, so the upper-left -> up transition passes
through the neutral pose. Piecewise-linear keyframes; max step is 0.19 frames per 0.5 deg.

### Not built (Part 3+)
About, Work, Contact, navigation, custom cursor. Resume/Contact links are placeholders.

## Part 3C — Skills, Contact, Footer (completed)

- `src/sections/Skills.jsx` (`id="skills"`): two qualitative groups ("More comfortable",
  "Developing"). No percentages, bars, ratings or years. Filled dot = more comfortable,
  hollow ring = developing.
- `src/sections/Contact.jsx` (`id="contact"`): main line + GitHub / LinkedIn / Email links.
  GitHub and LinkedIn use `target="_blank" rel="noopener noreferrer"`; email is a `mailto:` link.
  No form, backend, resume, phone or location.
- `src/components/Footer.jsx`: one-line copyright + "Back to top".
- `App.jsx` order: Work, About, Skills, Education, Contact, Footer (matches Navbar order).
- Navbar: only change is `scrollIntoView` now respects `prefers-reduced-motion`.
- Styles appended at the end of `src/styles.css` (UTILITIES / SKILLS / CONTACT / FOOTER).
- Untouched: hero, CharacterCanvas.jsx, frameMap.js, Woman.mp4, public/frames/, center.webp.

### Known item for the final session
- Navbar pill wraps onto two rows on phone widths (CONTACT drops to row 2). Existing Part 3B
  behaviour, not addressed in 3C by request.

## Part 3D — Final polish (completed)

- `src/components/CustomCursor.jsx`: desktop-only dot + trailing ring. Enabled only for
  `(hover: hover) and (pointer: fine)` and not `prefers-reduced-motion`. Refs + rAF only (loop
  stops when the ring settles); its own pointer listeners, CharacterCanvas untouched by it.
  Ring grows over links/buttons; native cursor returns on touch and reduced-motion.
- `src/hooks/useReveal.js`: IntersectionObserver one-shot reveal for `[data-reveal]` elements
  (fade + 18px rise, small stagger via `--i`). Disabled for reduced motion; content is never
  hidden without JS.
- CharacterCanvas: only change is an IntersectionObserver that pauses per-frame work while the
  hero is off-screen. Frames, mapping, angle interpolation and dead zone are unchanged.
- App: `<main id="main">` wraps hero + sections, skip link added, hero scroll cue now targets `#work`,
  h1 exposes "Priyanshi Sahu" to screen readers. Navbar keeps hash in sync and moves focus.
- Work: four featured cards numbered/prominent, GitHub (outlined + icon) vs Live Demo (filled + arrow),
  descriptive aria-labels. All 13 project URLs unchanged. Text no longer line-clamped.
- Responsive: navbar fits one row down to 320px (monogram hidden <=440px); hero stacks (character
  above text) at <=860px instead of <=720px to avoid tablet-portrait overlap.
- Contrast: `--accent-text` (#ff6b5f) for small red text on dark; hero soft text slightly brighter.
