"""Shared layout pieces for banners, posts and sheets."""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import brand as B
import typeset as T


def wrap(text, key, size, tracking, max_width):
    words, lines, cur = text.split(), [], ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if T.width(trial, key, size, tracking) <= max_width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def text_block(text, key, size, x, y, color, max_width=None, tracking=0.0,
               leading=1.22, anchor="start", opacity=None):
    """Word-wrapped text as outlines. `y` is the first baseline.
    Returns (markup, height_of_block, last_baseline)."""
    lines = wrap(text, key, size, tracking, max_width) if max_width else [text]
    step = size * leading
    out = []
    for i, line in enumerate(lines):
        p, _ = T.path(line, key, size, tracking, x, y + i * step, color,
                      anchor=anchor, opacity=opacity)
        out.append(p)
    return "".join(out), step * (len(lines) - 1), y + step * (len(lines) - 1)


def ripple_field(cx, cy, color, start=140, step=115, rings=9, stroke=3,
                 opacity=0.16, fade=True):
    """Oversized concentric echoes of the mark - the house background texture."""
    out = []
    for i in range(rings):
        r = start + i * step
        op = opacity * (1 - i / (rings + 2)) if fade else opacity
        out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" '
                   f'fill="none" stroke="{color}" stroke-width="{stroke}" '
                   f'opacity="{op:.3f}"/>')
    return "".join(out)


def eyebrow(text, x, y, color, size=20, tracking=0.22, key="sans-semibold",
            anchor="start"):
    p, w = T.path(text, key, size, tracking, x, y, color, anchor=anchor)
    return p, w


def rule(x1, y, x2, color, w=2, opacity=0.35):
    return (f'<line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="{color}" '
            f'stroke-width="{w}" opacity="{opacity}" stroke-linecap="round"/>')


def pill(text, x, y, fill, text_color, size=20, tracking=0.16,
         key="sans-semibold", pad_x=26, pad_y=15, radius=None):
    """A small capsule label. `y` is the capsule's top edge."""
    tw = T.width(text, key, size, tracking)
    h = size + pad_y * 2
    w = tw + pad_x * 2
    r = radius if radius is not None else h / 2
    cap = T.metrics(key, size)["cap_height"]
    baseline = y + h / 2 + cap / 2
    p, _ = T.path(text, key, size, tracking, x + pad_x, baseline, text_color)
    return (f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" '
            f'rx="{r:.1f}" fill="{fill}"/>{p}'), w, h


def grain(w, h, color="#000000", opacity=0.05, seed=7, count=900):
    """A whisper of tooth so the flat fills do not look like plastic."""
    import random
    rnd = random.Random(seed)
    dots = []
    for _ in range(count):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h)
        r = rnd.uniform(0.6, 2.1)
        dots.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}"/>')
    return (f'<g fill="{color}" opacity="{opacity}">{"".join(dots)}</g>')
