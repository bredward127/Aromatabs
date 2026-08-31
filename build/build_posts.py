"""Post, story, pin, card and thumbnail templates.

Every string in here is placeholder editorial copy so the templates are
usable as-is and obvious to edit. See assets/social/posts/COPY.md.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import brand as B
import typeset as T
import layout as LY
import build_logos as L

SERIF = "serif-semibold"
SERIF_R = "serif"
SANS = "sans"
SANS_SB = "sans-semibold"
SANS_L = "sans-light"

DEEP = dict(way=L.REVERSE, a="deep", b="ink", ink="cloud", soft="brand300",
            accent="ember300", ripple="brand300", rop=0.20)
LINEN = dict(way=L.COLOR, a="cloud", b="linen", ink="ink", soft="brand600",
             accent="ember", ripple="brand", rop=0.12)
BRANDED = dict(way=L.REVERSE, a="brand", b="deep", ink="cloud", soft="mist",
               accent="ember300", ripple="cloud", rop=0.18)


def plate(w, h, th, gid, rip=None, rings=9, bloom=True):
    defs = [f'<linearGradient id="{gid}" x1="0.1" y1="0" x2="0.9" y2="1">'
            f'<stop offset="0" stop-color="{B.C[th["a"]]}"/>'
            f'<stop offset="1" stop-color="{B.C[th["b"]]}"/></linearGradient>']
    parts = [f'<rect width="{w}" height="{h}" fill="url(#{gid})"/>']
    if bloom:
        defs.append(
            f'<radialGradient id="{gid}-bl" cx="0.5" cy="0.5" r="0.5">'
            f'<stop offset="0" stop-color="{B.C["ember"]}" stop-opacity="0.14"/>'
            f'<stop offset="1" stop-color="{B.C["ember"]}" stop-opacity="0"/>'
            f'</radialGradient>')
        parts.append(f'<ellipse cx="{w * 0.5:.0f}" cy="{h * 0.42:.0f}" '
                     f'rx="{w * 0.7:.0f}" ry="{h * 0.6:.0f}" '
                     f'fill="url(#{gid}-bl)"/>')
    rx, ry = rip or (w * 0.5, h * 1.06)
    scale = max(w, h)
    parts.append(LY.ripple_field(rx, ry, B.C[th["ripple"]],
                                 start=scale * 0.13, step=scale * 0.105,
                                 rings=rings, stroke=max(2, scale * 0.0022),
                                 opacity=th["rop"]))
    return defs, "".join(parts)


def footer(th, x, y, defs, gid, size, show_domain=True, w=None):
    """Small lockup bottom-left, domain bottom-right."""
    g, gw, gh = L.lockup_group(th["way"], size, x, y, defs, gid_suffix=f"-{gid}")
    out = [g]
    if show_domain and w:
        ds = size * 0.30
        cap = T.metrics(SANS_SB, ds)["cap_height"]
        p, _ = T.path(B.DOMAIN.upper(), SANS_SB, ds, 0.22, w - x,
                      y + gh / 2 + cap / 2, B.C[th["soft"]], anchor="end")
        out.append(p)
    return "".join(out)


# ------------------------------------------------------------- templates ---
def article_card(w, h, th, gid, eyebrow, headline, kicker=None, byline=None,
                 top=0.155, footer_y=None):
    """The workhorse: category, headline, supporting line, footer lockup."""
    defs, bg = plate(w, h, th, gid, rip=(w * 0.86, h * 0.9))
    m = round(w * 0.075)
    parts = [bg]
    y = round(h * top)
    p, _ = LY.eyebrow(eyebrow, m, y, B.C[th["accent"]], size=w * 0.019,
                      tracking=0.24)
    parts.append(p)

    hs = w * 0.070
    block, bh, last = LY.text_block(headline, SERIF, hs, m, y + h * 0.135,
                                    B.C[th["ink"]], max_width=w - m * 2,
                                    leading=1.16)
    parts.append(block)
    yy = last
    if kicker:
        ks = w * 0.026
        kb, _, yy = LY.text_block(kicker, SANS_L, ks, m, last + h * 0.075,
                                  B.C[th["ink"]], max_width=w * 0.76,
                                  leading=1.4, opacity=0.82)
        parts.append(kb)
    if byline:
        bs = w * 0.017
        p, _ = T.path(byline, SANS_SB, bs, 0.16, m, yy + h * 0.062,
                      B.C[th["soft"]])
        parts.append(p)

    fh = w * 0.055
    fy = footer_y if footer_y is not None else h - m - fh
    parts.append(footer(th, m, fy, defs, gid, fh, w=w))
    return B.svg(w, h, "".join(parts), defs="".join(defs))


def quote_card(w, h, th, gid, quote, attrib, footer_y=None, top=0.365):
    defs, bg = plate(w, h, th, gid, rip=(w * 0.5, h * 1.02), rings=8)
    m = round(w * 0.095)
    parts = [bg]
    # opening quote mark, set large and low-contrast
    q, _ = T.path("\u201c", SERIF, w * 0.30, 0, m - w * 0.012,
                  h * (top - 0.075),
                  B.C[th["accent"]], opacity=0.28)
    parts.append(q)

    qs = w * 0.062
    block, bh, last = LY.text_block(quote, SERIF_R, qs, m, h * top,
                                    B.C[th["ink"]], max_width=w - m * 2,
                                    leading=1.28)
    parts.append(block)
    parts.append(LY.rule(m, last + h * 0.055, m + w * 0.09, B.C[th["accent"]],
                         w=3, opacity=0.8))
    p, _ = T.path(attrib, SANS_SB, w * 0.019, 0.18, m, last + h * 0.105,
                  B.C[th["soft"]])
    parts.append(p)
    fh = w * 0.055
    fy = footer_y if footer_y is not None else h - m - fh
    parts.append(footer(th, m, fy, defs, gid, fh, w=w))
    return B.svg(w, h, "".join(parts), defs="".join(defs))


def list_card(w, h, th, gid, eyebrow, headline, items):
    defs, bg = plate(w, h, th, gid, rip=(w * 1.02, h * 1.05), rings=8)
    m = round(w * 0.085)
    parts = [bg]
    p, _ = LY.eyebrow(eyebrow, m, h * 0.115, B.C[th["accent"]], size=w * 0.019,
                      tracking=0.24)
    parts.append(p)
    hb, _, last = LY.text_block(headline, SERIF, w * 0.062, m, h * 0.185,
                                B.C[th["ink"]], max_width=w - m * 2,
                                leading=1.15)
    parts.append(hb)

    y = last + h * 0.10
    for i, item in enumerate(items, 1):
        num, _ = T.path(f"{i:02d}", SANS_SB, w * 0.030, 0.04, m, y,
                        B.C[th["accent"]])
        parts.append(num)
        tb, bh, y2 = LY.text_block(item, SANS, w * 0.030, m + w * 0.085, y,
                                   B.C[th["ink"]], max_width=w - m * 2 - w * 0.085,
                                   leading=1.34, opacity=0.92)
        parts.append(tb)
        parts.append(LY.rule(m, y2 + h * 0.032, w - m, B.C[th["ink"]],
                             w=1.5, opacity=0.18))
        y = y2 + h * 0.100
    fh = w * 0.052
    parts.append(footer(th, m, h - m - fh, defs, gid, fh, w=w))
    return B.svg(w, h, "".join(parts), defs="".join(defs))


def stat_card(w, h, th, gid, stat, statline, source):
    defs, bg = plate(w, h, th, gid, rip=(w * 0.5, h * 0.52), rings=10)
    m = round(w * 0.09)
    parts = [bg]
    p, _ = T.path(stat, SERIF, w * 0.26, -0.01, w / 2, h * 0.46,
                  B.C[th["accent"]], anchor="middle")
    parts.append(p)
    sb, _, last = LY.text_block(statline, SANS_L, w * 0.038, w / 2, h * 0.575,
                                B.C[th["ink"]], max_width=w * 0.78,
                                leading=1.34, anchor="middle")
    parts.append(sb)
    p, _ = T.path(source, SANS_SB, w * 0.017, 0.2, w / 2, last + h * 0.075,
                  B.C[th["soft"]], anchor="middle")
    parts.append(p)
    fh = w * 0.055
    g, gw, gh = L.lockup_group(th["way"], fh, 0, 0, defs, gid_suffix=f"-{gid}")
    parts.append(g.replace("translate(0.000,0.000)",
                           f"translate({(w - gw) / 2:.1f},{h - m - fh:.1f})", 1))
    return B.svg(w, h, "".join(parts), defs="".join(defs))


def cta_card(w, h, th, gid, line, sub):
    defs, bg = plate(w, h, th, gid, rip=(w * 0.5, h * 0.5), rings=10)
    m = round(w * 0.09)
    parts = [bg]
    parts.append(L.mark_group(th["way"], w * 0.17, (w - w * 0.17) / 2, h * 0.235,
                              defs, gid_suffix=f"-{gid}"))
    hb, _, last = LY.text_block(line, SERIF, w * 0.072, w / 2, h * 0.575,
                                B.C[th["ink"]], max_width=w * 0.84,
                                leading=1.18, anchor="middle")
    parts.append(hb)
    sb, _, last2 = LY.text_block(sub, SANS_L, w * 0.030, w / 2, last + h * 0.075,
                                 B.C[th["ink"]], max_width=w * 0.72,
                                 leading=1.35, anchor="middle", opacity=0.85)
    parts.append(sb)
    pill, pw, ph = LY.pill(B.DOMAIN.upper(), 0, 0, B.C[th["accent"]],
                           B.C["ink"], size=w * 0.024, tracking=0.2,
                           pad_x=w * 0.045, pad_y=w * 0.026)
    parts.append(f'<g transform="translate({(w - pw) / 2:.1f},'
                 f'{last2 + h * 0.06:.1f})">{pill}</g>')
    return B.svg(w, h, "".join(parts), defs="".join(defs))


def story_guides(w, h):
    top, bottom = 250, 340
    return (
        f'<rect x="0" y="0" width="{w}" height="{top}" fill="{B.C["ember"]}" '
        f'opacity="0.16"/>'
        f'<rect x="0" y="{h - bottom}" width="{w}" height="{bottom}" '
        f'fill="{B.C["ember"]}" opacity="0.16"/>'
        f'<line x1="0" y1="{top}" x2="{w}" y2="{top}" stroke="{B.C["ember"]}" '
        f'stroke-width="3" stroke-dasharray="16 12"/>'
        f'<line x1="0" y1="{h - bottom}" x2="{w}" y2="{h - bottom}" '
        f'stroke="{B.C["ember"]}" stroke-width="3" stroke-dasharray="16 12"/>'
        + T.path("UI SAFE ZONE", SANS_SB, 26, 0.2, 40, top - 34, B.C["ember"])[0]
        + T.path("UI SAFE ZONE", SANS_SB, 26, 0.2, 40, h - bottom + 52,
                 B.C["ember"])[0])


# ------------------------------------------------------------------ copy ---
HEADLINE = "Why your nervous system needs 90 minutes to power down"
KICKER = ("The wind-down window is not a luxury. It is the physiological "
          "runway your body uses to hand over from alert to asleep.")
BYLINE = "REVIEWED BY THE AROMATABS SLEEP DESK"
QUOTE = "Rest is not what you earn after the work. It is part of the work."
ATTRIB = "THE AROMATABS FIELD GUIDE TO REST"
LIST_HEAD = "Three ways to fall asleep faster tonight"
LIST_ITEMS = [
    "Drop the lights an hour before bed. Dim beats dark for signalling.",
    "Warm your hands and feet so your core temperature can fall.",
    "Give the day an ending: write tomorrow down, then close the notebook.",
]
STAT = "1 in 3"
STATLINE = "adults sleep fewer than seven hours on a typical night"
SOURCE = "SOURCE: CDC — VERIFY BEFORE PUBLISHING"
CTA = "Save this. Then go to bed."
CTA_SUB = "New guides on sleep, breath and recovery every week."


def main():
    made = []
    J = []

    # Link previews / cards
    J.append(("social/posts/og-default-1200x630.svg",
              article_card(1200, 630, DEEP, "og1", "EVERYTHING REST & RELAXATION",
                           "The evidence-led guide to sleeping, breathing and "
                           "switching off", kicker=None, byline=None), 1200))
    J.append(("social/posts/og-article-1200x630.svg",
              article_card(1200, 630, DEEP, "og2", "SLEEP SCIENCE", HEADLINE,
                           kicker=None, byline=BYLINE), 1200))
    J.append(("social/posts/x-card-1200x675.svg",
              article_card(1200, 675, LINEN, "xc", "WIND-DOWN", HEADLINE,
                           kicker=None, byline=BYLINE), 1200))
    J.append(("social/posts/youtube-thumbnail-1280x720.svg",
              article_card(1280, 720, BRANDED, "yt", "BREATHWORK",
                           "The 4-7-8 breath, actually explained",
                           kicker=None, byline=None), 1280))

    # Instagram square family
    J.append(("social/posts/ig-square-quote-1080x1080.svg",
              quote_card(1080, 1080, DEEP, "igq", QUOTE, ATTRIB), 1080))
    J.append(("social/posts/ig-square-article-1080x1080.svg",
              article_card(1080, 1080, LINEN, "iga", "SLEEP SCIENCE", HEADLINE,
                           kicker=KICKER, byline=BYLINE), 1080))
    J.append(("social/posts/ig-carousel-cover-1080x1080.svg",
              article_card(1080, 1080, BRANDED, "igc", "SWIPE →",
                           LIST_HEAD, kicker=None, byline=None), 1080))
    J.append(("social/posts/ig-carousel-slide-1080x1080.svg",
              list_card(1080, 1080, LINEN, "igs", "WIND-DOWN", LIST_HEAD,
                        LIST_ITEMS), 1080))
    J.append(("social/posts/ig-carousel-stat-1080x1080.svg",
              stat_card(1080, 1080, DEEP, "igt", STAT, STATLINE, SOURCE), 1080))
    J.append(("social/posts/ig-carousel-end-1080x1080.svg",
              cta_card(1080, 1080, BRANDED, "ige", CTA, CTA_SUB), 1080))

    # Portrait + pin
    J.append(("social/posts/ig-portrait-1080x1350.svg",
              article_card(1080, 1350, DEEP, "igp", "RECOVERY", HEADLINE,
                           kicker=KICKER, byline=BYLINE), 1080))
    J.append(("social/posts/pinterest-pin-1000x1500.svg",
              article_card(1000, 1500, LINEN, "pp", "SLEEP SCIENCE", HEADLINE,
                           kicker=KICKER, byline=None), 1000))

    # Stories / Reels covers
    # Stories: everything lives between the two 250/340px UI safe zones.
    story = article_card(1080, 1920, DEEP, "st", "TONIGHT", HEADLINE,
                         kicker=KICKER, byline=None, top=0.20, footer_y=1420)
    J.append(("social/posts/story-1080x1920.svg", story, 1080))
    J.append(("social/posts/story-1080x1920-safe-guide.svg",
              story.replace("</svg>", story_guides(1080, 1920) + "</svg>"), 1080))
    J.append(("social/posts/story-quote-1080x1920.svg",
              quote_card(1080, 1920, BRANDED, "stq", QUOTE, ATTRIB,
                         top=0.30, footer_y=1420), 1080))

    for name, markup, px in J:
        made += B.write(name, markup, png_width=px)
    return made


if __name__ == "__main__":
    for f in main():
        print(f)
