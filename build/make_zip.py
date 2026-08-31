"""Package the kit for handoff."""
import os, sys, zipfile
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import brand as B

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
OUT = os.path.join(DIST, "aromatabs-brand-kit.zip")


def main():
    os.makedirs(DIST, exist_ok=True)
    with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for root, _dirs, files in os.walk(B.OUT):
            for f in sorted(files):
                p = os.path.join(root, f)
                z.write(p, os.path.join("aromatabs-brand-kit",
                                        os.path.relpath(p, B.OUT)))
        for extra, arc in ((os.path.join(ROOT, "README.md"), "README.md"),):
            z.write(extra, os.path.join("aromatabs-brand-kit", arc))
    n = len(zipfile.ZipFile(OUT).namelist())
    print(f"{OUT}  —  {n} files, {os.path.getsize(OUT) / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
