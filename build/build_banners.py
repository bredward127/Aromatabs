"""Channel headers and covers, sized to each platform's current spec."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import brand as B
import typeset as T
import layout as LY
import build_logos as L

DARK = dict(way=L.REVERSE, bg=("deep", "ink"), ink="cloud", soft="brand300",
            ripple="brand300", ripple_op=0.20)
LIGHT = dict(way=L.COLOR, bg=("cloud", "linen"), ink="ink", soft="brand600",
             ripple="brand", ripple_op=0.13)


def canvas(w, h, theme, ripple_at=None, ripple_start=None, ripple_step=None,
           gid="bg"):
    """Background plate shared by every banner: a slow diagonal gradient,
    a warm bloom, and the ripple motif blown up as texture."""
    defs = [
        f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="1">'
        f'<stop offset="0" stop-color="{B.C[theme["bg"][0]]}"/>'
        f'<stop offset="1" stop-color="{B.C[theme["bg"][1]]}"/></linearGradient>',
        f'<radialGradient id="{gid}-bloom" cx="0.5" cy="0.5" r="0.5">'
        f'<stop offset="0" stop-color="{B.C["ember"]}" stop-opacity="0.16"/>'
        f'<stop offset="1" stop-color="{B.C["ember"]}" stop-opacity="0"/>'
        f'</radialGradient>',
    ]
    rx, ry = ripple_at or (w * 0.84, h * 0.52)
    scale = max(w, h)
    body = [
        f'<rect width="{w}" height="{h}" fill="url(#{gid})"/>',
        f'<ellipse cx="{rx:.0f}" cy="{ry:.0f}" rx="{scale * 0.55:.0f}" '
        f'ry="{scale * 0.55:.0f}" fill="url(#{gid}-bloom)"/>',
        LY.ripple_field(rx, ry, B.C[theme["ripple"]],
                        start=ripple_start or scale * 0.10,
                        step=ripple_step or scale * 0.085,
                        rings=10, stroke=max(2, scale * 0.0022),
                        opacity=theme["ripple_op"]),
    ]
    return defs, "".join(body)


def banner(w, h, theme, lock_h, lock_xy, desc=None, desc_size=None,
           domain=True, ripple_at=None, gid="bg", tagline=False,
           align="left"):
    defs, body = canvas(w, h, theme, ripple_at=ripple_at, gid=gid)
    parts = [body]
    lx, ly = lock_xy
    g, gw, gh = L.lockup_group(theme["way"], lock_h, 0, 0, defs,
                               tagline=tagline, gid_suffix=f"-{gid}")
    ox = lx - gw / 2 if align == "center" else lx
    parts.append(g.replace('translate(0.000,0.000)',
                           f'translate({ox:.3f},{ly:.3f})', 1))
    y = ly + gh
    if desc:
        ds = desc_size or lock_h * 0.30
        p, _ = T.path(desc, "sans-light", ds, 0.005,
                      lx if align == "left" else lx, y + ds * 1.55,
                      B.C[theme["ink"]], anchor="start" if align == "left" else "middle",
                      opacity=0.86)
        parts.append(p)
        y += ds * 1.55
    if domain:
        ds = lock_h * 0.19
        p, _ = T.path(B.DOMAIN.upper(), "sans-semibold", ds, 0.22,
                      lx if align == "left" else lx, y + ds * 2.4,
                      B.C[theme["soft"]],
                      anchor="start" if align == "left" else "middle")
        parts.append(p)
    return B.svg(w, h, "".join(parts), defs="".join(defs))


def safe_overlay(w, h, sw, sh, label):
    x, y = (w - sw) / 2, (h - sh) / 2
    return (
        f'<rect x="{x}" y="{y}" width="{sw}" height="{sh}" fill="none" '
        f'stroke="{B.C["ember"]}" stroke-width="4" stroke-dasharray="18 14" '
        f'opacity="0.9"/>'
        + T.path(label, "sans-semibold", max(18, h * 0.018), 0.16,
                 x + 14, y - 16, B.C["ember"])[0]
    )


def main():
    made = []
    J = []

    # X / Twitter header - the avatar eats the lower left, so hold content right.
    J.append(("social/banners/x-header-1500x500.svg",
              banner(1500, 500, DARK, 128, (430, 118), tagline=True,
                     desc=B.DESCRIPTOR, ripple_at=(1330, 250), gid="x"), 1500))

    # Facebook page cover: authored at 1640x856, everything legible inside the
    # 820x312 desktop crop.
    J.append(("social/banners/facebook-cover-1640x856.svg",
              banner(1640, 856, DARK, 150, (820, 330), tagline=True,
                     desc=B.DESCRIPTOR, ripple_at=(820, 428), gid="fb",
                     align="center"), 1640))
    J.append(("social/banners/facebook-cover-820x312.svg",
              banner(820, 312, DARK, 96, (410, 84), tagline=True,
                     desc=None, ripple_at=(410, 156), gid="fb2",
                     align="center"), 820))

    # LinkedIn personal cover - profile photo sits lower left.
    J.append(("social/banners/linkedin-personal-cover-1584x396.svg",
              banner(1584, 396, DARK, 104, (560, 112), tagline=True,
                     desc=B.DESCRIPTOR, ripple_at=(1400, 198), gid="li"), 1584))

    # LinkedIn company page cover - short and wide, wordmark only.
    J.append(("social/banners/linkedin-company-cover-1128x191.svg",
              banner(1128, 191, DARK, 74, (72, 42), tagline=False,
                     desc=None, domain=False, ripple_at=(1010, 96),
                     gid="lic"), 1128))

    # YouTube channel art - safe area is the middle 1546x423 on every device.
    yt = banner(2560, 1440, DARK, 170, (1280, 560), tagline=True,
                desc=B.DESCRIPTOR, ripple_at=(1280, 720), gid="yt",
                align="center")
    J.append(("social/banners/youtube-channel-art-2560x1440.svg", yt, 2560))
    guide = yt.replace("</svg>", safe_overlay(2560, 1440, 1546, 423,
                                              "TV & MOBILE SAFE AREA") + "</svg>")
    J.append(("social/banners/youtube-channel-art-2560x1440-safe-guide.svg",
              guide, 1600))

    # Pinterest profile cover.
    J.append(("social/banners/pinterest-cover-1440x810.svg",
              banner(1440, 810, LIGHT, 150, (720, 300), tagline=True,
                     desc=B.DESCRIPTOR, ripple_at=(720, 405), gid="pin",
                     align="center"), 1440))

    # Email / newsletter header.
    J.append(("social/banners/email-header-1200x300.svg",
              banner(1200, 300, LIGHT, 92, (80, 78), tagline=True,
                     desc=None, domain=False, ripple_at=(1080, 150),
                     gid="em"), 1200))

    for name, markup, px in J:
        made += B.write(name, markup, png_width=px)
    return made


if __name__ == "__main__":
    for f in main():
        print(f)
