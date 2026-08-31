"""Subset the brand OTFs to latin and compress them to WOFF2 for the site.

The site self-hosts its type. Nothing is fetched from a font CDN, so the
foundry files have to become web files somewhere - this is that step.
"""
import os, sys
from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "build", "fonts")
DST = os.path.join(ROOT, "app", "fonts")

# Google's "latin" range, plus the arrows, minus signs and quotes the
# editorial voice actually uses.
UNICODES = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD"
)

FACES = [
    ("SourceSerifPro-Regular.otf",  "source-serif-400.woff2"),
    ("SourceSerifPro-Semibold.otf", "source-serif-600.woff2"),
    ("SourceSansPro-Regular.otf",   "source-sans-400.woff2"),
    ("SourceSansPro-Semibold.otf",  "source-sans-600.woff2"),
]


def main():
    os.makedirs(DST, exist_ok=True)
    for src_name, out_name in FACES:
        src = os.path.join(SRC, src_name)
        out = os.path.join(DST, out_name)
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl",
                                "onum", "lnum", "tnum", "frac"]
        opts.desubroutinize = True
        opts.drop_tables += ["FFTM"]
        opts.name_IDs = ["*"]
        opts.name_legacy = True
        opts.notdef_outline = True
        font = subset.load_font(src, opts)
        subsetter = subset.Subsetter(options=opts)
        subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
        subsetter.subset(font)
        subset.save_font(font, out, opts)
        kb = os.path.getsize(out) / 1024
        print(f"{out_name:26s} {kb:6.1f} KB")


if __name__ == "__main__":
    main()
