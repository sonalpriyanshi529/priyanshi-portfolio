"""
extract_frames.py

Extracts ~64 evenly-spaced frames from Woman.mp4 for the future
cursor-tracking directional system, plus a single best neutral/front-facing
"center" frame.

Does NOT modify the original Woman.mp4.

Output:
    public/frames/frame-000.webp ... frame-063.webp
    public/center.webp

Run from the project root:

    python3 scripts/extract_frames.py
"""

import cv2
import os
import numpy as np
from PIL import Image

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
VIDEO_PATH = os.path.join(PROJECT_ROOT, "Woman.mp4")
FRAMES_DIR = os.path.join(PROJECT_ROOT, "public", "frames")
CENTER_PATH = os.path.join(PROJECT_ROOT, "public", "center.webp")

NUM_FRAMES = 64
CENTER_SOURCE_FRAME_INDEX = 0  # determined visually during analysis: cleanest
                                # neutral / front-facing pose in the source video
WEBP_QUALITY = 95


def bgr_to_pil(frame_bgr):
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(frame_rgb)


def main():
    os.makedirs(FRAMES_DIR, exist_ok=True)

    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open video at {VIDEO_PATH}")

    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames.append(frame)
    cap.release()

    total = len(frames)
    if total == 0:
        raise RuntimeError("No frames decoded from video.")

    print(f"Decoded {total} source frames.")

    # Evenly sample NUM_FRAMES indices across the full [0, total-1] range,
    # inclusive of both ends, so the extracted set spans the whole animation
    # loop (CENTER -> UP -> UP-RIGHT -> ... -> CENTER).
    sample_indices = np.linspace(0, total - 1, NUM_FRAMES)
    sample_indices = sorted(set(int(round(i)) for i in sample_indices))

    # In case rounding collapsed some duplicates, pad back up to NUM_FRAMES
    # by inserting nearby unused indices.
    used = set(sample_indices)
    i = 0
    while len(sample_indices) < NUM_FRAMES and i < total:
        if i not in used:
            sample_indices.append(i)
            used.add(i)
        i += 1
    sample_indices = sorted(sample_indices)[:NUM_FRAMES]

    orig_h, orig_w = frames[0].shape[:2]

    for out_idx, src_idx in enumerate(sample_indices):
        frame = frames[src_idx]
        h, w = frame.shape[:2]
        assert (w, h) == (orig_w, orig_h), "Frame dimensions changed mid-video unexpectedly."

        pil_img = bgr_to_pil(frame)
        out_path = os.path.join(FRAMES_DIR, f"frame-{out_idx:03d}.webp")
        pil_img.save(out_path, "WEBP", quality=WEBP_QUALITY, method=6)

    print(f"Saved {len(sample_indices)} frames to {FRAMES_DIR}")
    print(f"Source frame indices used: {sample_indices}")

    # Save center.webp from the chosen neutral frame
    center_frame = frames[CENTER_SOURCE_FRAME_INDEX]
    center_pil = bgr_to_pil(center_frame)
    center_pil.save(CENTER_PATH, "WEBP", quality=WEBP_QUALITY, method=6)
    print(f"Saved center frame (source index {CENTER_SOURCE_FRAME_INDEX}) to {CENTER_PATH}")


if __name__ == "__main__":
    main()
