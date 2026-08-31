"""Logo lockups: horizontal, stacked, wordmark and mark, in four colourways."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import brand as B
import typeset as T

M = 100.0                     # the mark is the unit of the whole system
WORD_SIZE = 80.0              # wordmark cap size against a 100u mark
WORD_TRACK = 0.008
GAP = 0.30 * M
STACK_MARK = 1.5 * M          # the mark carries more weight when stacked
TAG_SIZE = 15.0
TAG_TRACK = 0.19

WORD_KEY = "serif-semibold"
TAG_KEY = "sans-semibold"

# Optical centring: lowercase with ascenders sits between its ink centre and
# its x-height centre. Blending the two lands it where the eye expects.
_x0, _y0, _x1, _y1 = T.bounds(B.NAME, WORD_KEY, WORD_SIZE, WORD_TRACK)
_ink_centre = -(_y0 + _y1) / 2
_xh = T.metrics(WORD_KEY, WORD_SIZE)["x_height"]
_xh_centre = _xh / 2 + (-_y0 - _xh) * 0.30
WORD_BASE_FROM_CENTRE = (_ink_centre + _xh_centre) / 2
WORD_W = _x1 - _x0
WORD_INK_H = _y1 - _y0


class Ways:
    """A colourway is the four decisions a lockup needs."""
    def __init__(self, key, tab, glyph, word, tag, grad=None):
        self.key, self.tab, self.glyph = key, tab, glyph
        self.word, self.tag, self.grad = word, tag, grad


COLOR = Ways("color", None, B.C["linen"], B.C["ink"], B.C["brand600"],
             grad=(B.C["brand"], B.C["deep"]))
REVERSE = Ways("reverse", None, B.C["deep"], B.C["cloud"], B.C["brand300"],
               grad=(B.C["cloud"], B.C["mist"]))
MONO_INK = Ways("mono-ink", None, B.C["ink"], B.C["ink"], B.C["ink"])
MONO_WHITE = Ways("mono-white", None, B.C["white"], B.C["white"], B.C["white"])
WAYS = [COLOR, REVERSE, MONO_INK, MONO_WHITE]


def _mark(w, size=M, x=0.0, y=0.0, defs=None):
    """Colour lockups get a gradient tab; mono lockups get the bare glyph."""
    if w.grad:
        gid = f"tab-{w.key}"
        if defs is not None:
            defs.append(B.grad(gid, *w.grad))
        inner = B.mark(size=size, gradient_id=gid, ink=w.glyph)
    else:
        inner = B.mark(size=size, ink=w.glyph)
    return f'<g transform="translate({x:.3f},{y:.3f})">{inner}</g>'


def _trim(body, defs, x0, y0, x1, y1, png_width):
    w, h = x1 - x0, y1 - y0
    return B.svg(round(w, 2), round(h, 2), body, defs="".join(defs),
                 viewbox=f"{x0:.3f} {y0:.3f} {w:.3f} {h:.3f}"), png_width


def horizontal(w, tagline=False):
    defs, parts = [], []
    parts.append(_mark(w, M, 0, 0, defs))
    wx = M + GAP
    if not tagline:
        base = M / 2 + WORD_BASE_FROM_CENTRE
        p, _ = T.path(B.NAME, WORD_KEY, WORD_SIZE, WORD_TRACK, wx - _x0, base, w.word)
        parts.append(p)
        top = min(0.0, base + _y0)
        bot = max(M, base + _y1)
    else:
        tag_w = T.width(B.TAGLINE, TAG_KEY, TAG_SIZE, TAG_TRACK)
        lead = TAG_SIZE * 1.55
        block_h = WORD_INK_H + lead
        top_of_ink = M / 2 - block_h / 2
        base = top_of_ink - _y0
        tag_base = base + lead + TAG_SIZE * 0.05
        p, _ = T.path(B.NAME, WORD_KEY, WORD_SIZE, WORD_TRACK, wx - _x0, base, w.word)
        parts.append(p)
        t, _ = T.path(B.TAGLINE, TAG_KEY, TAG_SIZE, TAG_TRACK, wx, tag_base, w.tag)
        parts.append(t)
        top, bot = min(0.0, top_of_ink), max(M, tag_base)
        return _trim("".join(parts), defs, 0, top,
                     wx + max(WORD_W, tag_w), bot, 1400)
    return _trim("".join(parts), defs, 0, top, wx + WORD_W, bot, 1200)


def stacked(w, tagline=True):
    defs, parts = [], []
    tag_w = T.width(B.TAGLINE, TAG_KEY, TAG_SIZE, TAG_TRACK) if tagline else 0
    total_w = max(STACK_MARK, WORD_W, tag_w)
    cx = total_w / 2
    parts.append(_mark(w, STACK_MARK, cx - STACK_MARK / 2, 0, defs))
    base = STACK_MARK + 0.30 * STACK_MARK + (-_y0)
    p, _ = T.path(B.NAME, WORD_KEY, WORD_SIZE, WORD_TRACK, cx, base, w.word,
                  anchor="middle")
    parts.append(p)
    bot = base + _y1
    if tagline:
        tag_base = base + TAG_SIZE * 2.1
        t, _ = T.path(B.TAGLINE, TAG_KEY, TAG_SIZE, TAG_TRACK, cx, tag_base,
                      w.tag, anchor="middle")
        parts.append(t)
        bot = tag_base
    return _trim("".join(parts), defs, 0, 0, total_w, bot, 900)


def wordmark(w):
    p, _ = T.path(B.NAME, WORD_KEY, WORD_SIZE, WORD_TRACK, -_x0, -_y0, w.word)
    return _trim(p, [], 0, 0, WORD_W, WORD_INK_H, 1200)


def mark_only(w):
    defs = []
    body = _mark(w, M, 0, 0, defs)
    return _trim(body, defs, 0, 0, M, M, 1024)


def main():
    made = []
    for w in WAYS:
        jobs = {
            f"logo/aromatabs-logo-horizontal-{w.key}.svg": horizontal(w, False),
            f"logo/aromatabs-logo-lockup-{w.key}.svg": horizontal(w, True),
            f"logo/aromatabs-logo-stacked-{w.key}.svg": stacked(w, True),
            f"logo/aromatabs-wordmark-{w.key}.svg": wordmark(w),
            f"logo/aromatabs-mark-{w.key}.svg": mark_only(w),
        }
        for name, (markup, px) in jobs.items():
            made += B.write(name, markup, png_width=px)
    return made


if __name__ == "__main__":
    for f in main():
        print(f)


# ---------------------------------------------------------- embeddable API ---
def lockup_group(w, height, x=0.0, y=0.0, defs=None, tagline=False,
                 gid_suffix=""):
    """The horizontal lockup as a positioned <g>, scaled to `height` (the
    mark's height). Returns (markup, width, height) so callers can lay it out.
    Used by every banner and post template."""
    local_defs = []
    parts = [_mark(w, M, 0, 0, local_defs)]
    wx = M + GAP
    if tagline:
        tag_w = T.width(B.TAGLINE, TAG_KEY, TAG_SIZE, TAG_TRACK)
        lead = TAG_SIZE * 1.55
        top_of_ink = M / 2 - (WORD_INK_H + lead) / 2
        base = top_of_ink - _y0
        tag_base = base + lead + TAG_SIZE * 0.05
        parts.append(T.path(B.NAME, WORD_KEY, WORD_SIZE, WORD_TRACK,
                            wx - _x0, base, w.word)[0])
        parts.append(T.path(B.TAGLINE, TAG_KEY, TAG_SIZE, TAG_TRACK,
                            wx, tag_base, w.tag)[0])
        total_w = wx + max(WORD_W, tag_w)
    else:
        base = M / 2 + WORD_BASE_FROM_CENTRE
        parts.append(T.path(B.NAME, WORD_KEY, WORD_SIZE, WORD_TRACK,
                            wx - _x0, base, w.word)[0])
        total_w = wx + WORD_W

    if defs is not None and local_defs:
        # namespace the gradient id so several lockups can coexist on a canvas
        for d in local_defs:
            defs.append(d.replace(f'id="tab-{w.key}"',
                                  f'id="tab-{w.key}{gid_suffix}"'))
        parts = [p.replace(f"url(#tab-{w.key})", f"url(#tab-{w.key}{gid_suffix})")
                 for p in parts]
    s = height / M
    g = (f'<g transform="translate({x:.3f},{y:.3f}) scale({s:.6f})">'
         f'{"".join(parts)}</g>')
    return g, total_w * s, M * s


def mark_group(w, size, x=0.0, y=0.0, defs=None, gid_suffix=""):
    local_defs = []
    body = _mark(w, M, 0, 0, local_defs)
    if defs is not None and local_defs:
        for d in local_defs:
            defs.append(d.replace(f'id="tab-{w.key}"',
                                  f'id="tab-{w.key}{gid_suffix}"'))
        body = body.replace(f"url(#tab-{w.key})", f"url(#tab-{w.key}{gid_suffix})")
    s = size / M
    return (f'<g transform="translate({x:.3f},{y:.3f}) scale({s:.6f})">'
            f'{body}</g>')
