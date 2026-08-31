"""Rebuild the entire Aromatabs kit from source, then package it."""
import sys, os, shutil, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B

import build_logos, build_icons, build_banners, build_posts
import build_sheets, build_tokens, build_manifest, build_contactsheet


def main(clean=True):
    if clean and os.path.isdir(B.OUT):
        keep = {"social/posts/COPY.md"}
        for root, _dirs, files in os.walk(B.OUT):
            for f in files:
                rel = os.path.relpath(os.path.join(root, f), B.OUT)
                if rel not in keep:
                    os.remove(os.path.join(root, f))

    count = 0
    for step in (build_logos, build_icons, build_banners, build_posts,
                 build_sheets, build_tokens):
        made = step.main()
        count += len(made)
        print(f"{step.__name__:20s} {len(made):3d} files")

    # docs that live alongside the assets
    root = os.path.dirname(B.OUT)
    for src, dst in (("brand/BRAND-GUIDE.md", "brand/BRAND-GUIDE.md"),
                     ("prompts/SUPERPROMPT.md", "SUPERPROMPT.md")):
        s = os.path.join(root, src)
        if os.path.exists(s):
            d = os.path.join(B.OUT, dst)
            os.makedirs(os.path.dirname(d), exist_ok=True)
            shutil.copy(s, d)

    # the fonts the kit is built from, with their licences
    fonts_out = os.path.join(B.OUT, "fonts")
    os.makedirs(fonts_out, exist_ok=True)
    for f in os.listdir(os.path.join(root, "build", "fonts")):
        shutil.copy(os.path.join(root, "build", "fonts", f),
                    os.path.join(fonts_out, f))

    build_contactsheet.main()
    build_manifest.main()
    print(f"{'total':20s} {count:3d} generated assets")


if __name__ == "__main__":
    main()
