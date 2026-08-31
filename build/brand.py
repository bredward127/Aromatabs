"""Aromatabs brand primitives: tokens, geometry helpers, SVG/PNG plumbing."""
import math
import os

import cairosvg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets")

# ---------------------------------------------------------------- palette ---
C = {
    "ink":       "#0F1E1C",  # near-black, deep green cast - body text
    "deep":      "#10352F",  # dark surfaces, dark-mode logo ground
    "brand":     "#2E7D6F",  # eucalyptus - primary
    "brand600":  "#24675B",
    "brand300":  "#7FB3A5",
    "mist":      "#CFE2DA",  # soft accent, dividers on dark
    "linen":     "#F3EEE4",  # warm page background
    "cloud":     "#FDFBF7",  # cards / surfaces
    "ember":     "#C98B45",  # warm accent, CTAs, highlights
    "ember300":  "#E8C79B",
    "white":     "#FFFFFF",
    "black":     "#000000",
}

NAME = "aromatabs"
TAGLINE = "THE ART & SCIENCE OF REST"
DESCRIPTOR = "Everything rest & relaxation"
DOMAIN = "aromatabs.com"


# --------------------------------------------------------------- geometry ---
def catmull_rom(points, closed=False, tension=1.0):
    """Smooth cubic-Bezier path through `points`. Used for the mark's
    superellipse body and its vapour strokes."""
    pts = list(points)
    if closed:
        pts = [pts[-1]] + pts + [pts[0], pts[1]]
    else:
        pts = [pts[0]] + pts + [pts[-1]]
    d = f"M{pts[1][0]:.4f},{pts[1][1]:.4f}"
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / (6 * tension),
              p1[1] + (p2[1] - p0[1]) / (6 * tension))
        c2 = (p2[0] - (p3[0] - p1[0]) / (6 * tension),
              p2[1] - (p3[1] - p1[1]) / (6 * tension))
        d += (f"C{c1[0]:.4f},{c1[1]:.4f} {c2[0]:.4f},{c2[1]:.4f} "
              f"{p2[0]:.4f},{p2[1]:.4f}")
    if closed:
        d += "Z"
    return d


def superellipse(cx, cy, a, b, n=4.6, steps=64):
    """Squircle - the silhouette of the tab itself."""
    pts = []
    for i in range(steps):
        t = 2 * math.pi * i / steps
        ct, st = math.cos(t), math.sin(t)
        x = cx + a * math.copysign(abs(ct) ** (2 / n), ct)
        y = cy + b * math.copysign(abs(st) ** (2 / n), st)
        pts.append((x, y))
    return catmull_rom(pts, closed=True)


def ripple(cx, y, half_width, depth, stroke, color):
    """One settling ripple - a shallow arc, flatter at the top of the stack."""
    return (f'<path d="M{cx - half_width:.3f},{y:.3f} '
            f'Q{cx:.3f},{y + depth:.3f} {cx + half_width:.3f},{y:.3f}" '
            f'fill="none" stroke="{color}" stroke-width="{stroke}" '
            f'stroke-linecap="round"/>')


# ------------------------------------------------------------------- mark ---
# The mark is a tab dissolving into still water: one drop above three
# spreading ripples. Drawn on a 100 x 100 grid, then scaled.
RIPPLES = ((44.0, 14.0, 5.5), (57.5, 23.0, 8.0), (71.0, 32.0, 10.5))
DROP = (50.0, 24.0, 8.0)   # cx, cy, r
STROKE = 6.8


def glyph(color, stroke=STROKE):
    """The drop-and-ripples on their own - the monochrome / knockout form."""
    cx, cy, r = DROP
    out = [f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{color}"/>']
    out += [ripple(50.0, y, hw, dep, stroke, color) for y, hw, dep in RIPPLES]
    return "".join(out)


def mark(size=100, tab=None, ink=None, gradient_id=None, inset=0.0,
         stroke=STROKE):
    """The full mark: soft-cornered tab + knockout glyph.

    tab / gradient_id - the tab's fill (pass neither for a bare glyph)
    ink               - colour of the drop and ripples
    inset             - shrink the tab inside its box (maskable app icons)
    """
    parts = []
    if tab or gradient_id:
        fill = f"url(#{gradient_id})" if gradient_id else tab
        pad = inset * 100
        parts.append(
            f'<path d="{superellipse(50, 50, 50 - pad, 50 - pad)}" fill="{fill}"/>'
        )
    parts.append(glyph(ink, stroke))
    inner = "".join(parts)
    if size == 100:
        return inner
    return f'<g transform="scale({size / 100.0:.6f})">{inner}</g>'


def grad(gid, c0, c1, x1=0, y1=0, x2=0, y2=1):
    return (f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">'
            f'<stop offset="0" stop-color="{c0}"/>'
            f'<stop offset="1" stop-color="{c1}"/></linearGradient>')


# -------------------------------------------------------------- rendering ---
def svg(w, h, body, defs="", bg=None, viewbox=None):
    vb = viewbox or f"0 0 {w} {h}"
    rect = f'<rect width="100%" height="100%" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
        f'viewBox="{vb}" fill="none">'
        f'<defs>{defs}</defs>{rect}{body}</svg>'
    )


def write(relpath, markup, png_width=None, png_scale=None):
    """Write an SVG and, when asked, a PNG beside it."""
    path = os.path.join(OUT, relpath)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as fh:
        fh.write(markup)
    made = [relpath]
    if png_width or png_scale:
        png = path[:-4] + ".png"
        kw = {"output_width": png_width} if png_width else {"scale": png_scale}
        cairosvg.svg2png(bytestring=markup.encode(), write_to=png, **kw)
        made.append(relpath[:-4] + ".png")
    return made


def write_png(relpath, markup, width):
    path = os.path.join(OUT, relpath)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    cairosvg.svg2png(bytestring=markup.encode(), write_to=path,
                     output_width=width)
    return [relpath]
