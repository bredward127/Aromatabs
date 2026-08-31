# Aromatabs

Brand and social visual kit for **Aromatabs** — an authority site on everything
rest and relaxation — plus the nine-prompt build sequence for the site itself.

- **[`prompts/SUPERPROMPT.md`](prompts/SUPERPROMPT.md)** — the nine prompts, in order.
- **[`brand/BRAND-GUIDE.md`](brand/BRAND-GUIDE.md)** — how the identity works.
- **[`assets/`](assets/)** — every logo, icon, banner and template.
- **[`assets/MANIFEST.md`](assets/MANIFEST.md)** — what each file is and where it goes.
- **[`assets/CONTACT-SHEET.png`](assets/CONTACT-SHEET.png)** — the whole kit on one page.
- **`dist/aromatabs-brand-kit.zip`** — all of the above, packaged.

## The identity, in one paragraph

The mark is a tab dissolving into still water: one drop above three spreading
ripples. It reads as diffusion — what an aroma tab does — and as the settling
that follows. The wordmark is lowercase Source Serif Pro; the palette is
eucalyptus green on warm linen with a single ember accent. Calm without being
weightless, credible without being clinical.

## What's in the kit

| | |
| --- | --- |
| **Logos** | Horizontal, tagline lockup, stacked, wordmark and mark — each in colour, reverse, mono-ink and mono-white. SVG + transparent PNG. |
| **Icons** | favicon.svg, .ico, 16–96px PNGs, Apple touch icon, Android 192/512, maskable, Safari pinned tab. |
| **Avatars** | 400/800/1000px, dark and light, plus a circle-crop proof. |
| **Banners** | X, Facebook (both sizes), LinkedIn personal and company, YouTube channel art with safe-area guide, Pinterest, email masthead. |
| **Posts** | OG default and article, X card, YouTube thumbnail, Instagram square/portrait/carousel (cover, list, stat, CTA), Pinterest pin, stories with UI safe-zone guide. |
| **Reference** | Palette, typography and logo-usage sheets. |
| **Tokens** | `tokens.css`, `tokens.json`, `tailwind.theme.cjs` — the same values the artwork was built from. |

Every asset is generated from vector source with all text converted to
outlines, so nothing depends on a font being installed and the SVGs render
identically everywhere.

## The site

A Next.js App Router application lives alongside the kit. Prompt 1 of the
super prompt is built: tokens, self-hosted type, layout primitives, the ripple
motif, site chrome and the icon set.

```bash
npm install
npm run dev            # http://localhost:3000
npm run check:all      # typecheck, lint, format, production build
```

To verify the foundation end to end (three breakpoints x two themes, plus the
theme cycle, focus order and the no-JavaScript fallback):

```bash
npm run build && npx next start -p 3111
npm run check:layout
```

The design tokens the app consumes are generated, not hand-written:
`app/styles/tokens.css`, `tailwind.theme.cjs` and
`components/brand/mark-geometry.ts` all come from `build/`. Change
`build/brand.py`, then:

```bash
npm run tokens && npm run fonts   # tokens + subset woff2 faces
python3 build/make_mark_geometry.py
python3 build/build_all.py        # the visual kit
```

## Rebuilding the visual kit

```bash
pip install pillow cairosvg uharfbuzz fonttools
python3 build/build_all.py     # regenerates assets/
python3 build/make_zip.py      # repackages dist/
```

Change the palette in `build/brand.py`, the mark geometry in the same file, the
lockup proportions in `build/build_logos.py`, and the template copy at the
bottom of `build/build_posts.py`. Everything downstream — including the tokens
the website consumes — follows from those four places.

## Notes before you publish

- **All template copy is placeholder.** See `assets/social/posts/COPY.md`. The
  stat card in particular must not ship without checking its primary source.
- **The `*-safe-guide` files are references, not artwork.** They show the
  platform's UI safe zones. Upload the plain versions.
- The typefaces are **Source Serif Pro** and **Source Sans Pro**, both SIL
  OFL 1.1. Licences travel with the fonts in `assets/fonts/`.
- The domain `aromatabs.com` is used throughout as the brand's URL. If that's
  not the final domain, change `DOMAIN` in `build/brand.py` and rebuild.
