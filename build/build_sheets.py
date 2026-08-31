"""Reference sheets: palette, type scale, logo usage."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import brand as B
import typeset as T
import layout as LY
import build_logos as L

INK, SOFT = B.C["ink"], B.C["brand600"]

SWATCHES = [
    ("Ink",        "ink",      "Body copy, headlines on light"),
    ("Deep",       "deep",     "Dark sections, logo ground"),
    ("Eucalyptus", "brand",    "Primary brand, links, buttons"),
    ("Eucalyptus 600", "brand600", "Hover, small text on light"),
    ("Eucalyptus 300", "brand300", "Text on dark, muted labels"),
    ("Mist",       "mist",     "Dividers, cards on dark"),
    ("Linen",      "linen",    "Page background"),
    ("Cloud",      "cloud",    "Surfaces, cards on light"),
    ("Ember",      "ember",    "Accent, CTAs, highlights"),
    ("Ember 300",  "ember300", "Accent on dark, pills"),
]


def _header(title, sub, w, y=110):
    p, _ = T.path(title, "serif-semibold", 58, 0, 90, y, INK)
    q, _ = T.path(sub, "sans-light", 26, 0.01, 90, y + 46, INK, opacity=0.7)
    return p + q


def palette_sheet(w=1680, h=1180):
    parts = [f'<rect width="{w}" height="{h}" fill="{B.C["linen"]}"/>']
    parts.append(_header("Palette", "Ten values. Two of them do most of the work.", w))
    cols, cw, ch, gx, gy = 5, 280, 300, 20, 34
    x0, y0 = 90, 210
    for i, (name, key, role) in enumerate(SWATCHES):
        cx = x0 + (i % cols) * (cw + gx)
        cy = y0 + (i // cols) * (ch + gy)
        parts.append(f'<rect x="{cx}" y="{cy}" width="{cw}" height="150" '
                     f'rx="14" fill="{B.C[key]}" stroke="{INK}" '
                     f'stroke-opacity="0.10"/>')
        p, _ = T.path(name, "sans-semibold", 24, 0.01, cx, cy + 192, INK)
        parts.append(p)
        p, _ = T.path(B.C[key].upper(), "sans", 21, 0.06, cx, cy + 222, INK,
                      opacity=0.55)
        parts.append(p)
        rb, _, _ = LY.text_block(role, "sans-light", 19, cx, cy + 252, INK,
                                 max_width=cw, leading=1.3, opacity=0.7)
        parts.append(rb)
    ty = y0 + 2 * (ch + gy) + 20
    p, _ = T.path("Gradients", "serif-semibold", 34, 0, 90, ty, INK)
    parts.append(p)
    defs = [B.grad("g1", B.C["brand"], B.C["deep"]),
            B.grad("g2", B.C["deep"], B.C["ink"], 0, 0, 1, 1),
            B.grad("g3", B.C["cloud"], B.C["mist"])]
    labels = [("Mark", "g1"), ("Dark plate", "g2"), ("Reverse mark", "g3")]
    for i, (lab, gid) in enumerate(labels):
        cx = 90 + i * 480
        parts.append(f'<rect x="{cx}" y="{ty + 30}" width="440" height="96" '
                     f'rx="14" fill="url(#{gid})"/>')
        p, _ = T.path(lab, "sans", 21, 0.02, cx, ty + 156, INK, opacity=0.7)
        parts.append(p)
    return B.svg(w, h, "".join(parts), defs="".join(defs))


TYPE_ROWS = [
    ("Display", "serif-semibold", 76, "Rest is a skill you can practise"),
    ("H1", "serif-semibold", 54, "The wind-down window"),
    ("H2", "serif-semibold", 40, "What the evidence actually says"),
    ("H3", "serif-semibold", 30, "Before you change anything"),
    ("Lede", "serif", 28, "Long-form, unhurried, and easy on tired eyes."),
    ("Body", "sans", 24, "Source Sans Pro carries every paragraph, caption and label on the site."),
    ("Label", "sans-semibold", 19, "REVIEWED BY THE AROMATABS SLEEP DESK"),
]


def type_sheet(w=1680, h=1180):
    parts = [f'<rect width="{w}" height="{h}" fill="{B.C["cloud"]}"/>']
    parts.append(_header("Typography",
                         "Source Serif Pro for voice. Source Sans Pro for everything else.", w))
    y = 270
    for label, key, size, sample in TYPE_ROWS:
        p, _ = T.path(label, "sans-semibold", 17, 0.2, 90, y - size * 0.62, SOFT)
        parts.append(p)
        meta = f"{key.replace('-', ' ')}  ·  {size}px"
        p, _ = T.path(meta, "sans", 16, 0.02, 90, y - size * 0.62 + 26, INK,
                      opacity=0.45)
        parts.append(p)
        p, _ = T.path(sample, key, size, 0.005 if "serif" in key else 0.0,
                      340, y, INK)
        parts.append(p)
        y += size * 0.62 + 78
        parts.append(LY.rule(90, y - 44, w - 90, INK, w=1, opacity=0.10))
    return B.svg(w, h, "".join(parts))


def usage_sheet(w=1680, h=1180):
    defs = []
    parts = [f'<rect width="{w}" height="{h}" fill="{B.C["linen"]}"/>']
    parts.append(_header("Logo usage", "Clear space, minimum sizes, and the four don'ts.", w))

    # clear space: one mark-half on every side
    lock, lw, lh = L.lockup_group(L.COLOR, 120, 210, 300, defs, gid_suffix="-u1")
    pad = 60
    parts.append(f'<rect x="{210 - pad}" y="{300 - pad}" width="{lw + pad * 2}" '
                 f'height="{lh + pad * 2}" fill="none" stroke="{B.C["ember"]}" '
                 f'stroke-width="2" stroke-dasharray="12 10"/>')
    parts.append(lock)
    p, _ = T.path("CLEAR SPACE = HALF THE MARK'S HEIGHT ON EVERY SIDE",
                  "sans-semibold", 18, 0.16, 210 - pad, 300 - pad - 28, SOFT)
    parts.append(p)

    # minimum sizes
    p, _ = T.path("Minimum sizes", "serif-semibold", 32, 0, 210, 600, INK)
    parts.append(p)
    specs = [("Horizontal lockup", 28, "160px / 40mm wide"),
             ("Stacked lockup", 34, "120px / 32mm wide"),
             ("Mark alone", 20, "20px / 6mm")]
    x = 210
    for i, (name, mh, note) in enumerate(specs):
        if i < 2:
            g, gw, gh = L.lockup_group(L.COLOR, mh, x, 660, defs,
                                       tagline=(i == 1), gid_suffix=f"-u{i+2}")
            parts.append(g)
        else:
            parts.append(L.mark_group(L.COLOR, mh, x, 660, defs,
                                      gid_suffix="-u4"))
            gw = mh
        p, _ = T.path(name, "sans-semibold", 19, 0.02, x, 740, INK)
        parts.append(p)
        p, _ = T.path(note, "sans", 18, 0.02, x, 768, INK, opacity=0.6)
        parts.append(p)
        x += 300

    # don'ts
    p, _ = T.path("Don't", "serif-semibold", 32, 0, 210, 880, INK)
    parts.append(p)
    donts = ["Recolour the mark outside the palette",
             "Stretch, rotate or add effects",
             "Place the colour mark on a busy photo",
             "Rebuild the wordmark in another typeface"]
    for i, d in enumerate(donts):
        yy = 935 + i * 46
        parts.append(f'<circle cx="222" cy="{yy - 7}" r="9" fill="none" '
                     f'stroke="{B.C["ember"]}" stroke-width="2.5"/>'
                     f'<line x1="216" y1="{yy - 13}" x2="228" y2="{yy - 1}" '
                     f'stroke="{B.C["ember"]}" stroke-width="2.5"/>')
        p, _ = T.path(d, "sans", 22, 0.01, 250, yy, INK, opacity=0.85)
        parts.append(p)

    # the mark on its permitted grounds
    grounds = [("deep", "reverse"), ("linen", "color"), ("brand", "reverse"),
               ("cloud", "color")]
    for i, (bgk, way) in enumerate(grounds):
        gx = 1020 + (i % 2) * 330
        gy = 600 + (i // 2) * 300
        parts.append(f'<rect x="{gx}" y="{gy}" width="290" height="260" rx="18" '
                     f'fill="{B.C[bgk]}" stroke="{INK}" stroke-opacity="0.08"/>')
        w_ = L.REVERSE if way == "reverse" else L.COLOR
        parts.append(L.mark_group(w_, 110, gx + 90, gy + 75, defs,
                                  gid_suffix=f"-g{i}"))
    return B.svg(w, h, "".join(parts), defs="".join(defs))


def main():
    made = []
    made += B.write("brand/palette-sheet.svg", palette_sheet(), png_width=1680)
    made += B.write("brand/typography-sheet.svg", type_sheet(), png_width=1680)
    made += B.write("brand/logo-usage-sheet.svg", usage_sheet(), png_width=1680)
    return made


if __name__ == "__main__":
    for f in main():
        print(f)
