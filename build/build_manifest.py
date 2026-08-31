"""Asset manifest + per-folder READMEs, generated from what actually shipped."""
import sys, os, glob, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image
import brand as B

USE = {
    "logo": "Master lockups. SVG is the source of truth; PNGs are transparent.",
    "favicon": "Browser, OS and PWA icons. Drop the whole folder into /public.",
    "social/profile": "Profile pictures. Square source, safe under a circular crop.",
    "social/banners": "Channel headers and covers, at each platform's current spec.",
    "social/posts": "Editable post templates. Copy is placeholder — see COPY.md.",
    "brand": "Reference sheets and design tokens for the site build.",
}

SPEC = {
    "x-header-1500x500": "X / Twitter profile header. Avatar overlays lower left.",
    "facebook-cover-1640x856": "Facebook Page cover. Legible content held inside the 820x312 desktop crop.",
    "facebook-cover-820x312": "Facebook classic cover.",
    "linkedin-personal-cover-1584x396": "LinkedIn personal background. Photo overlays lower left.",
    "linkedin-company-cover-1128x191": "LinkedIn company page cover.",
    "youtube-channel-art-2560x1440": "YouTube channel art. All content inside the 1546x423 safe area.",
    "youtube-channel-art-2560x1440-safe-guide": "Same, with the safe area marked. Reference only — do not upload.",
    "pinterest-cover-1440x810": "Pinterest profile cover.",
    "email-header-1200x300": "Newsletter masthead.",
    "og-default-1200x630": "Sitewide default Open Graph image.",
    "og-article-1200x630": "Article Open Graph template.",
    "x-card-1200x675": "X summary_large_image card.",
    "youtube-thumbnail-1280x720": "Video thumbnail template.",
    "ig-square-quote-1080x1080": "Instagram quote card.",
    "ig-square-article-1080x1080": "Instagram article card.",
    "ig-carousel-cover-1080x1080": "Carousel slide 1 — the hook.",
    "ig-carousel-slide-1080x1080": "Carousel body slide — numbered list.",
    "ig-carousel-stat-1080x1080": "Carousel stat slide.",
    "ig-carousel-end-1080x1080": "Carousel final slide — the call to action.",
    "ig-portrait-1080x1350": "Instagram portrait feed post.",
    "pinterest-pin-1000x1500": "Pinterest pin.",
    "story-1080x1920": "Story / Reel cover.",
    "story-1080x1920-safe-guide": "Same, with UI safe zones marked. Reference only.",
    "story-quote-1080x1920": "Story quote card.",
}


def main():
    rows = []
    for path in sorted(glob.glob(os.path.join(B.OUT, "**", "*"), recursive=True)):
        if os.path.isdir(path):
            continue
        rel = os.path.relpath(path, B.OUT)
        ext = os.path.splitext(rel)[1].lower()
        size = ""
        if ext == ".png":
            with Image.open(path) as im:
                size = f"{im.width}x{im.height}"
        stem = os.path.basename(rel).rsplit(".", 1)[0]
        rows.append({"file": rel, "type": ext.lstrip("."), "pixels": size,
                     "note": SPEC.get(stem, "")})

    with open(os.path.join(B.OUT, "MANIFEST.json"), "w") as fh:
        json.dump({"brand": "Aromatabs", "assets": rows}, fh, indent=2)

    lines = ["# Aromatabs asset manifest", "",
             f"{len([r for r in rows if r['type'] in ('png', 'svg', 'ico')])} "
             "image files. SVG is the editable source; PNG is the export.", ""]
    current = None
    for r in rows:
        folder = os.path.dirname(r["file"]) or "."
        if folder != current:
            current = folder
            lines += ["", f"## `{folder}/`", ""]
            if folder in USE:
                lines += [USE[folder], ""]
            lines += ["| File | Size | Notes |", "| --- | --- | --- |"]
        lines.append(f"| `{os.path.basename(r['file'])}` | {r['pixels'] or '—'} "
                     f"| {r['note']} |")
    with open(os.path.join(B.OUT, "MANIFEST.md"), "w") as fh:
        fh.write("\n".join(lines) + "\n")
    return ["MANIFEST.json", "MANIFEST.md"]


if __name__ == "__main__":
    for f in main():
        print(f)
