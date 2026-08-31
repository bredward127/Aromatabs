"""Text -> SVG path outlines.

Every piece of text in the kit is converted to vector outlines so the SVGs
render identically everywhere with no webfont dependency and no licensing
question about embedding.
"""
import functools
import os

import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")

FONTS = {
    "serif":          "SourceSerifPro-Regular.otf",
    "serif-semibold": "SourceSerifPro-Semibold.otf",
    "serif-bold":     "SourceSerifPro-Bold.otf",
    "serif-italic":   "SourceSerifPro-It.otf",
    "sans-light":     "SourceSansPro-Light.otf",
    "sans":           "SourceSansPro-Regular.otf",
    "sans-semibold":  "SourceSansPro-Semibold.otf",
    "sans-bold":      "SourceSansPro-Bold.otf",
}


@functools.lru_cache(maxsize=None)
def _load(key):
    path = os.path.join(FONT_DIR, FONTS[key])
    with open(path, "rb") as fh:
        data = fh.read()
    hb_font = hb.Font(hb.Face(hb.Blob(data)))
    tt = TTFont(path, lazy=True)
    upem = tt["head"].unitsPerEm
    hb_font.scale = (upem, upem)
    return hb_font, tt, tt.getGlyphSet(), upem


def metrics(key, size):
    """Ascender / descender / line height in user units at `size`."""
    _, tt, _, upem = _load(key)
    hhea = tt["hhea"]
    s = size / upem
    return {
        "ascender": hhea.ascender * s,
        "descender": hhea.descender * s,
        "line_gap": hhea.lineGap * s,
        "cap_height": tt["OS/2"].sCapHeight * s if hasattr(tt["OS/2"], "sCapHeight") else 0.7 * size,
        "x_height": tt["OS/2"].sxHeight * s if hasattr(tt["OS/2"], "sxHeight") else 0.5 * size,
    }


def shape(text, key="sans", size=100, tracking=0.0, features=None):
    """Return (svg_path_d, advance_width).

    `tracking` is letter-spacing expressed in em (0.02 == 20/1000 em),
    matching how tracking is specified in type design.
    """
    hb_font, tt, glyph_set, upem = _load(key)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, features or {"kern": True, "liga": True})

    scale = size / upem
    track = tracking * size
    pen_target = SVGPathPen(glyph_set)
    x = 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = tt.getGlyphName(info.codepoint)
        tp = TransformPen(
            pen_target,
            (scale, 0, 0, -scale, x + pos.x_offset * scale, -pos.y_offset * scale),
        )
        glyph_set[name].draw(tp)
        x += pos.x_advance * scale + track
    width = x - track if buf.glyph_infos else 0.0
    return pen_target.getCommands(), width


def width(text, key="sans", size=100, tracking=0.0):
    return shape(text, key, size, tracking)[1]


def path(text, key="sans", size=100, tracking=0.0, x=0, y=0, fill="#000",
         anchor="start", opacity=None, extra=""):
    """A ready-to-drop <path> element. `y` is the text baseline."""
    d, w = shape(text, key, size, tracking)
    if anchor == "middle":
        x -= w / 2
    elif anchor == "end":
        x -= w
    op = f' opacity="{opacity}"' if opacity is not None else ""
    return (
        f'<path transform="translate({x:.3f},{y:.3f})" d="{d}" '
        f'fill="{fill}"{op} {extra}/>'
    ), w


def bounds(text, key="sans", size=100, tracking=0.0, features=None):
    """Ink bounding box (xmin, ymin, xmax, ymax) in the same space as
    shape(): origin at the start of the baseline, y increasing downward.
    Used to optically centre wordmarks against the mark."""
    from fontTools.pens.boundsPen import BoundsPen

    hb_font, tt, glyph_set, upem = _load(key)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, features or {"kern": True, "liga": True})

    scale = size / upem
    track = tracking * size
    bp = BoundsPen(glyph_set)
    x = 0.0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = tt.getGlyphName(info.codepoint)
        tp = TransformPen(
            bp, (scale, 0, 0, -scale, x + pos.x_offset * scale, -pos.y_offset * scale)
        )
        glyph_set[name].draw(tp)
        x += pos.x_advance * scale + track
    return bp.bounds or (0.0, 0.0, 0.0, 0.0)
