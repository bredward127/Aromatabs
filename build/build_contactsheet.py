"""One page showing every asset in the kit."""
import sys, os, glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PIL import Image, ImageDraw, ImageFont
import brand as B

FONT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fonts")
SB = os.path.join(FONT_DIR, "SourceSansPro-Semibold.otf")
RG = os.path.join(FONT_DIR, "SourceSansPro-Regular.otf")
SERIF = os.path.join(FONT_DIR, "SourceSerifPro-Semibold.otf")

COLS, CELL, GAP, PAD = 5, 330, 28, 70
LABEL_H = 52
GROUPS = [
    ("Logos", "logo/*.png"),
    ("Icons & avatars", "favicon/*.png"),
    ("Avatars", "social/profile/*.png"),
    ("Banners & covers", "social/banners/*.png"),
    ("Posts, stories & pins", "social/posts/*.png"),
    ("Reference sheets", "brand/*.png"),
]


def cells():
    out = []
    for title, pattern in GROUPS:
        files = sorted(glob.glob(os.path.join(B.OUT, pattern)))
        if files:
            out.append(("__group__", title))
            out += [("file", f) for f in files]
    return out


def main():
    items = cells()
    # lay out to compute height first
    rows, col, y = [], 0, 0
    plan = []
    for kind, val in items:
        if kind == "__group__":
            if col: y += CELL + LABEL_H + GAP
            col = 0
            plan.append(("group", val, 0, y))
            y += 74
        else:
            plan.append(("file", val, col, y))
            col += 1
            if col == COLS:
                col = 0
                y += CELL + LABEL_H + GAP
    if col: y += CELL + LABEL_H + GAP
    W = PAD * 2 + COLS * CELL + (COLS - 1) * GAP
    H = y + PAD + 120

    img = Image.new("RGB", (W, H), B.C["linen"])
    d = ImageDraw.Draw(img)
    d.text((PAD, 54), "Aromatabs — social kit", font=ImageFont.truetype(SERIF, 54),
           fill=B.C["ink"])
    d.text((PAD, 122), "Every asset in assets/, at a glance.",
           font=ImageFont.truetype(RG, 24), fill=B.C["brand600"])
    f_group = ImageFont.truetype(SERIF, 30)
    f_label = ImageFont.truetype(SB, 17)
    f_dim = ImageFont.truetype(RG, 16)
    top = 190

    for kind, val, col, y in plan:
        yy = top + y
        if kind == "group":
            d.text((PAD, yy + 20), val, font=f_group, fill=B.C["ink"])
            d.line([(PAD, yy + 62), (W - PAD, yy + 62)], fill=B.C["mist"], width=2)
            continue
        x = PAD + col * (CELL + GAP)
        im = Image.open(val).convert("RGBA")
        ow, oh = im.size
        thumb = im.copy()
        thumb.thumbnail((CELL - 24, CELL - 24), Image.LANCZOS)
        # checkerboard-free plate so transparent logos stay readable
        plate = Image.new("RGBA", (CELL, CELL), B.C["cloud"])
        name = os.path.basename(val)
        if "reverse" in name or "mono-white" in name:
            plate = Image.new("RGBA", (CELL, CELL), B.C["deep"])
        plate.alpha_composite(thumb, ((CELL - thumb.width) // 2,
                                      (CELL - thumb.height) // 2))
        img.paste(plate.convert("RGB"), (x, yy))
        d.rectangle([x, yy, x + CELL - 1, yy + CELL - 1], outline=B.C["mist"])
        label = name.replace(".png", "")
        if len(label) > 40:
            label = label[:38] + "…"
        d.text((x, yy + CELL + 10), label, font=f_label, fill=B.C["ink"])
        d.text((x, yy + CELL + 30), f"{ow}x{oh}", font=f_dim, fill=B.C["brand600"])

    out = os.path.join(B.OUT, "CONTACT-SHEET.png")
    img.save(out, optimize=True)
    return ["CONTACT-SHEET.png"]


if __name__ == "__main__":
    for f in main():
        print(f)
