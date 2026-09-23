// Frame-ring math for the cursor-tracking character.
// Frames 0..63 form a circular sequence (the source video loops through a
// neutral pose), so all interpolation is done on a ring of FRAME_COUNT.
//
// Mapping was determined by visually inspecting all 64 frames
// (see PROJECT_NOTES.md, "Part 2 frame mapping"). Compass angle is measured
// clockwise from "up" on screen (0 = up, 90 = right, 180 = down, 270 = left).
// The equal-groups assumption does NOT hold: the sequence spends many frames
// sweeping up/right and few on the lower-left, so keyframes are irregular.
export const FRAME_COUNT = 64;

export const KEYFRAMES = [
  [0, 9], //    up          (head tilted up, eyes up)
  [45, 13], //  up-right    (eyes to upper right)
  [90, 20], //  right       (head turned to viewer's right)
  [135, 27], // lower-right
  [180, 35], // down        (chin down, eyes down)
  [225, 43], // lower-left
  [270, 50], // left
  [315, 56], // upper-left
  [360, 73], // back to "up" (73 % 64 = 9) — passes through neutral frames
];

export const mod = (n, m) => ((n % m) + m) % m;

// Shortest-path interpolation on a ring (lerpAngle-style, in frame units).
export function lerpRing(current, target, t, size = FRAME_COUNT) {
  const d = mod(target - current + size / 2, size) - size / 2;
  return mod(current + d * t, size);
}

// Signed shortest distance on the ring.
export function ringDelta(a, b, size = FRAME_COUNT) {
  return mod(b - a + size / 2, size) - size / 2;
}

// Compass angle (deg, 0=up, clockwise) -> fractional frame position (0..64).
export function angleToFrame(angleDeg) {
  const a = mod(angleDeg, 360);
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const [a0, f0] = KEYFRAMES[i];
    const [a1, f1] = KEYFRAMES[i + 1];
    if (a >= a0 && a <= a1) {
      return mod(f0 + ((a - a0) / (a1 - a0)) * (f1 - f0), FRAME_COUNT);
    }
  }
  return 0;
}

export function pointToCompassAngle(dx, dy) {
  return mod((Math.atan2(dx, -dy) * 180) / Math.PI, 360);
}
