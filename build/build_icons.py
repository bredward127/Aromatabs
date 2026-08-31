"""Favicons, app icons and social profile avatars."""
import sys, os, io
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import cairosvg
from PIL import Image

import brand as B
import build_logos as L


def square(size=512, grad=("brand", "deep"), ink="linen", glyph_scale=0.80,
           radius=0.0, gid="sq"):
    """Full-bleed square icon - what app stores and social avatars want."""
    defs = B.grad(gid, B.C[grad[0]], B.C[grad[1]])
    s = glyph_scale
    off = (1 - s) / 2 * 100
    # the glyph's mass sits below its bounding box centre; lift it optically
    off_y = off - 2.6 * s
    rx = f' rx="{radius * 100:.2f}"' if radius else ""
    body = (
        f'<rect x="0" y="0" width="100" height="100"{rx} fill="url(#{gid})"/>'
        f'<g transform="translate({off:.3f},{off_y:.3f}) scale({s:.4f})">'
        f'{B.glyph(B.C[ink])}</g>'
    )
    return B.svg(size, size, body, defs=defs, viewbox="0 0 100 100")


def maskable(size=512):
    """Android maskable: everything meaningful inside the middle 80%."""
    return square(size, glyph_scale=0.52)


def rounded_mark(size=512, colorway=L.COLOR):
    defs = []
    body = L.mark_group(colorway, 100, 0, 0, defs)
    return B.svg(size, size, body, defs="".join(defs), viewbox="0 0 100 100")


def png_bytes(markup, px):
    return cairosvg.svg2png(bytestring=markup.encode(), output_width=px,
                            output_height=px)


def main():
    made = []

    # Scalable favicon - a heavier glyph so the ripples survive at 16px.
    fav = square(64, glyph_scale=0.78, radius=0.0)
    made += B.write("favicon/favicon.svg", fav)
    made += B.write("favicon/favicon-rounded.svg", rounded_mark(64))

    for px in (16, 32, 48, 64, 96):
        made += B.write_png(f"favicon/favicon-{px}.png", fav, px)

    # Multi-resolution .ico for legacy browsers and Windows pins.
    ico_path = os.path.join(B.OUT, "favicon", "favicon.ico")
    base = Image.open(io.BytesIO(png_bytes(fav, 256))).convert("RGBA")
    base.save(ico_path, format="ICO",
              sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    made.append("favicon/favicon.ico")

    # iOS / Android home screen. Opaque, full bleed - the OS masks it.
    made += B.write_png("favicon/apple-touch-icon-180.png",
                        square(180, glyph_scale=0.62), 180)
    made += B.write_png("favicon/android-chrome-192.png", square(192), 192)
    made += B.write_png("favicon/android-chrome-512.png", square(512), 512)
    made += B.write_png("favicon/maskable-icon-512.png", maskable(512), 512)
    made += B.write("favicon/safari-pinned-tab.svg",
                    B.svg(100, 100, B.glyph(B.C["black"]), viewbox="0 0 100 100"))

    # Social profile pictures. The glyph already clears a circular crop.
    avatar = square(1000, glyph_scale=0.60)
    for px in (400, 800, 1000):
        made += B.write_png(f"social/profile/aromatabs-avatar-{px}.png", avatar, px)
    made += B.write("social/profile/aromatabs-avatar.svg", avatar)

    avatar_light = square(1000, grad=("cloud", "mist"), ink="deep",
                          glyph_scale=0.60, gid="sq-light")
    made += B.write_png("social/profile/aromatabs-avatar-light-1000.png",
                        avatar_light, 1000)

    # Circle-crop proof, so nobody has to guess how it lands on X or LinkedIn.
    proof = (
        f'<rect width="1000" height="1000" fill="{B.C["linen"]}"/>'
        f'<clipPath id="c"><circle cx="500" cy="500" r="500"/></clipPath>'
        f'<g clip-path="url(#c)"><rect width="1000" height="1000" '
        f'fill="url(#sq)"/><g transform="translate(200,200) scale(6.0)">'
        f'{B.glyph(B.C["linen"])}</g></g>'
    )
    made += B.write_png("social/profile/aromatabs-avatar-circle-proof.png",
                        B.svg(1000, 1000, proof,
                              defs=B.grad("sq", B.C["brand"], B.C["deep"])), 1000)
    return made


if __name__ == "__main__":
    for f in main():
        print(f)
