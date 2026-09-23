"""
analyze_video.py

Inspects Woman.mp4 and reports:
- width, height, fps, frame count, duration
- a coarse frame timeline (sampled frames + basic motion delta)
- approximate dominant background color (RGB + HEX)

This script does NOT modify the original video. It only reads it.
Run from the project root:

    python3 scripts/analyze_video.py
"""

import cv2
import numpy as np
import os
import json
from collections import Counter

VIDEO_PATH = os.path.join(os.path.dirname(__file__), "..", "Woman.mp4")
VIDEO_PATH = os.path.abspath(VIDEO_PATH)


def get_dominant_background_color(frame, border_fraction=0.06):
    """
    Sample pixels from a thin border around the edge of the frame
    (top/bottom/left/right strips), since the background is assumed
    to be a solid color surrounding the character in the center.
    Returns the most common (B, G, R) color found in those strips.
    """
    h, w = frame.shape[:2]
    bh = max(1, int(h * border_fraction))
    bw = max(1, int(w * border_fraction))

    strips = [
        frame[0:bh, :, :].reshape(-1, 3),           # top
        frame[h - bh:h, :, :].reshape(-1, 3),        # bottom
        frame[:, 0:bw, :].reshape(-1, 3),            # left
        frame[:, w - bw:w, :].reshape(-1, 3),        # right
    ]
    pixels = np.concatenate(strips, axis=0)

    # Quantize slightly to group near-identical compression-noise colors
    quantized = (pixels // 4 * 4).astype(int)
    tuples = [tuple(p) for p in quantized]
    counts = Counter(tuples)
    most_common_bgr, freq = counts.most_common(1)[0]
    b, g, r = most_common_bgr
    return (int(r), int(g), int(b)), freq, len(tuples)


def frame_diff_score(prev_gray, curr_gray):
    diff = cv2.absdiff(prev_gray, curr_gray)
    return float(np.mean(diff))


def main():
    if not os.path.exists(VIDEO_PATH):
        raise FileNotFoundError(f"Could not find video at {VIDEO_PATH}")

    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        raise RuntimeError(f"OpenCV could not open video at {VIDEO_PATH}")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames_reported = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Read all frames to get a true count and build a motion timeline,
    # since CAP_PROP_FRAME_COUNT can be unreliable for some containers.
    frames_bgr = []
    prev_gray = None
    motion_scores = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frames_bgr.append(frame)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        if prev_gray is not None:
            motion_scores.append(frame_diff_score(prev_gray, gray))
        else:
            motion_scores.append(0.0)
        prev_gray = gray

    cap.release()

    actual_frame_count = len(frames_bgr)
    duration = actual_frame_count / fps if fps > 0 else 0.0

    # Background color: sample border strips from several frames
    # (start, 25%, 50%, 75%, last) and take the overall most common color.
    sample_indices = sorted(set([
        0,
        actual_frame_count // 4,
        actual_frame_count // 2,
        (actual_frame_count * 3) // 4,
        actual_frame_count - 1,
    ]))

    color_votes = Counter()
    for idx in sample_indices:
        if 0 <= idx < actual_frame_count:
            (r, g, b), freq, total = get_dominant_background_color(frames_bgr[idx])
            color_votes[(r, g, b)] += freq

    bg_r, bg_g, bg_b = color_votes.most_common(1)[0][0]
    bg_hex = "#{:02X}{:02X}{:02X}".format(bg_r, bg_g, bg_b)

    # Motion timeline: find local peaks/valleys in motion score to get a
    # rough sense of where pose changes happen (valleys = held poses,
    # peaks = transitions between poses).
    motion_arr = np.array(motion_scores)

    # Simple smoothing
    if len(motion_arr) >= 5:
        kernel = np.ones(5) / 5
        smoothed = np.convolve(motion_arr, kernel, mode="same")
    else:
        smoothed = motion_arr

    # Identify low-motion "hold" regions (candidate stable poses)
    threshold = np.percentile(smoothed, 25) if len(smoothed) > 0 else 0
    hold_frames = [i for i, v in enumerate(smoothed) if v <= threshold]

    # Group consecutive hold frames into ranges
    hold_ranges = []
    if hold_frames:
        start = hold_frames[0]
        prev = hold_frames[0]
        for f in hold_frames[1:]:
            if f == prev + 1:
                prev = f
            else:
                hold_ranges.append((start, prev))
                start = f
                prev = f
        hold_ranges.append((start, prev))

    result = {
        "video_path": VIDEO_PATH,
        "width": width,
        "height": height,
        "aspect_ratio": round(width / height, 4) if height else None,
        "fps": round(fps, 3),
        "frame_count_reported_by_container": total_frames_reported,
        "frame_count_actual_decoded": actual_frame_count,
        "duration_seconds": round(duration, 3),
        "background_color_rgb": {"r": bg_r, "g": bg_g, "b": bg_b},
        "background_color_hex": bg_hex,
        "motion_timeline_sample": [round(float(v), 2) for v in motion_arr[:actual_frame_count]],
        "candidate_hold_ranges": hold_ranges,
        "num_candidate_hold_ranges": len(hold_ranges),
    }

    out_path = os.path.join(os.path.dirname(__file__), "video_analysis.json")
    with open(out_path, "w") as f:
        json.dump(result, f, indent=2)

    print("=== VIDEO ANALYSIS ===")
    print(f"Path:            {VIDEO_PATH}")
    print(f"Resolution:      {width}x{height} (aspect {result['aspect_ratio']})")
    print(f"FPS:             {result['fps']}")
    print(f"Frames (actual): {actual_frame_count}  (container reported: {total_frames_reported})")
    print(f"Duration:        {result['duration_seconds']}s")
    print(f"Background RGB:  {result['background_color_rgb']}")
    print(f"Background HEX:  {bg_hex}")
    print(f"Candidate hold/pose ranges ({len(hold_ranges)}):")
    for r in hold_ranges:
        print(f"   frames {r[0]}-{r[1]}")
    print(f"\nFull analysis written to: {out_path}")


if __name__ == "__main__":
    main()
