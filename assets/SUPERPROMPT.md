# Aromatabs — Super Prompt

A nine-prompt build sequence for **aromatabs.com**, an authority site on
everything rest and relaxation.

Run them **in order**, one per working session. Each assumes the previous one
shipped. Paste the **Standing Context** block at the top of every prompt — it is
the brand and stack contract, and models drift without it.

Everything the prompts reference (tokens, logos, favicons, OG images) ships in
`assets/`. Prompt 1 copies it into the app.

---

## Standing Context — paste at the top of every prompt

```
PROJECT: Aromatabs (aromatabs.com) — an authority site on everything rest and
relaxation: sleep, wind-down, breathwork, stress physiology, recovery, and the
environment you rest in. Long-form, evidence-led, calm. Not a blog, not a
supplement store. The commercial layer (Aromatabs aromatherapy tabs, affiliate
gear) sits underneath the editorial, never on top of it.

AUDIENCE: adults who sleep badly and are tired of being sold to. They arrive
from search with one specific question and stay because the answer is honest
about what the evidence does and does not show.

VOICE: plain, warm, specific, unhurried. Short sentences. No hype, no
"unlock your best sleep", no exclamation marks. Say "we don't know" when we
don't know. British-neutral spelling, second person.

STACK: Next.js (App Router) + TypeScript (strict) + Tailwind + MDX content
files in /content parsed with gray-matter and rendered with
next-mdx-remote/rsc. No CMS in v1. Deployed on Vercel.

BRAND:
  Wordmark      aromatabs (lowercase, Source Serif Pro Semibold)
  Tagline       The art & science of rest
  Display type  Source Serif Pro
  Body type     Source Sans Pro
  ink #0F1E1C · deep #10352F · eucalyptus #2E7D6F · eucalyptus-600 #24675B
  eucalyptus-300 #7FB3A5 · mist #CFE2DA · linen #F3EEE4 · cloud #FDFBF7
  ember #C98B45 · ember-300 #E8C79B
  Motif: concentric ripples — a tab dissolving into still water. Used as
  oversized low-opacity background texture, never as decoration inside content.
  Tokens: assets/brand/tokens.css, tokens.json, tailwind.theme.cjs

NON-NEGOTIABLES:
  - Accessible: WCAG 2.2 AA, keyboard-complete, respects prefers-reduced-motion.
  - Fast: static by default, no client JS for anything that can be server-rendered.
  - Honest: every health claim carries a citation; every citation is real and
    linked. If you cannot cite it, cut it.
  - No medical advice. Guidance only, with a visible "when to see a doctor" path.
```

---

## Prompt 1 — Foundations

```
Scaffold the Aromatabs site.

BUILD
1. Next.js App Router project, TypeScript strict, Tailwind, ESLint + Prettier.
2. Copy assets/brand/tokens.css into app/styles/tokens.css and import it in the
   root layout. Wire assets/brand/tailwind.theme.cjs into the Tailwind config so
   `bg-at-linen`, `text-at-ink`, `font-display` etc. all resolve.
3. Self-host Source Serif Pro and Source Sans Pro via next/font/local (woff2,
   variable where available). Never load fonts from a third-party CDN.
4. Root layout: linen page, cloud surfaces, ink text, max content measure of
   68ch for prose. Dark mode driven by the semantic token layer already in
   tokens.css — light is the default, dark follows the system unless the user
   overrides it. Persist the override in localStorage, no flash on load.
5. Layout primitives as server components: <Container>, <Stack>, <Prose>,
   <Section> (with an optional `tone` of linen | cloud | deep | brand that maps
   to the right foreground colours automatically).
6. <RippleField> — the background motif. Props: origin, ring count, opacity.
   Pure SVG, aria-hidden, no JS.
7. Site chrome: header with the horizontal lockup (assets/logo/), primary nav,
   search entry point (stub), theme toggle. Footer with the stacked lockup,
   topic columns, newsletter slot (stub), legal links, and the editorial
   standards link.
8. Drop assets/favicon/* into /public and wire the full icon set + web manifest
   in the metadata export.

CONSTRAINTS
- Zero client components except the theme toggle.
- No component library. Build the primitives.

DONE WHEN
`npm run build` passes clean, Lighthouse ≥ 95 on an empty page in all four
categories, and the header/footer render correctly in light and dark at 360px,
768px and 1440px.
```

---

## Prompt 2 — Content model and information architecture

```
Give Aromatabs its spine: the taxonomy and the content model.

BUILD
1. Six top-level pillars, each a hub page at /<pillar>:
     sleep          — architecture, timing, chronotype, common disorders
     wind-down      — the 90-minute runway, routines, light, screens
     breath         — paced breathing, physiology, techniques
     stress         — the stress response, recovery, nervous-system basics
     environment    — light, temperature, sound, air, scent, the bedroom
     rest           — rest that isn't sleep: naps, stillness, time off, burnout
   Each pillar has clusters; each cluster has articles. Hub → cluster → article,
   with breadcrumbs and bidirectional internal links throughout.

2. Content lives in /content/<pillar>/<slug>.mdx. Frontmatter schema, validated
   with zod at build time — a bad file fails the build, it does not ship:
     title, slug, pillar, cluster, description (max 160 chars),
     publishedAt, updatedAt, author, reviewedBy?, reviewedAt?,
     readingTime (derived), evidenceLevel (strong|moderate|emerging|contested),
     citations[] ({id, authors, year, title, journal?, url, doi?}),
     related[], keywords[], hero?, faq[]? ({q, a}), draft
   `reviewedBy` is required when evidenceLevel is strong or moderate.

3. lib/content.ts — the single content API: getAllArticles, getArticle(slug),
   getPillar, getCluster, getRelated, getAllPillars, search index builder.
   Cache it. Nothing else touches the filesystem.

4. Routes: /, /<pillar>, /<pillar>/<cluster>, /<pillar>/<cluster>/<slug>,
   /about, /editorial-standards, /reviewers, /contact, /tools.
   generateStaticParams for everything. 404 and error boundaries that match
   the brand.

5. Seed content: one full 2,000-word article per pillar, real citations, plus
   three stubs each — enough that every template renders against real text.

CONSTRAINTS
- No database. Files are the source of truth.
- Every article belongs to exactly one cluster and links to at least three siblings.

DONE WHEN
The build fails on a malformed frontmatter file, and every route renders from
seed content with correct breadcrumbs.
```

---

## Prompt 3 — Design system

```
Build the Aromatabs component library on top of the Prompt 1 primitives.

BUILD
Typography: H1–H4, Lede, Body, Small, Label, Blockquote, InlineCite — all
mapped to the token scale, never to raw Tailwind sizes.

Surfaces: Card, ArticleCard (three densities: feature, standard, compact),
PillarCard, ToolCard, QuoteCard, StatCard.

Controls: Button (primary / secondary / ghost / link, three sizes), Input,
Select, Checkbox, Radio, Toggle, Slider. Full keyboard support, visible focus
ring in eucalyptus, 44px minimum touch target.

Editorial: EvidenceBadge (four levels, colour + label + tooltip — never colour
alone), Callout (note | caution | evidence | try-tonight), KeyTakeaways,
StepList, ComparisonTable (scrolls inside its own container), FAQ (real
<details>), CitationList, ReviewerByline, LastUpdated, ReadingTime.

Navigation: Breadcrumbs, TableOfContents (sticky on desktop, collapsible on
mobile, tracks the reading position), Pagination, RelatedArticles, PillarNav.

Every component ships with a page in /styleguide showing states: default,
hover, focus, disabled, loading, error, empty, and long-content overflow.

CONSTRAINTS
- Server components unless interaction genuinely requires otherwise.
- Contrast ≥ 4.5:1 for body, ≥ 3:1 for large text and UI edges, in both themes.
- Motion: 150–250ms, ease-out, and nothing at all under prefers-reduced-motion.

DONE WHEN
/styleguide renders every component in every state, in light and dark, with an
axe-core pass at zero violations.
```

---

## Prompt 4 — Homepage and pillar hubs

```
Build the pages that make Aromatabs read as an authority rather than a blog.

HOMEPAGE
1. Hero: the promise in one sentence, one supporting line, one primary action
   ("Start with the wind-down guide"). Ripple motif behind it. No stock photo,
   no carousel.
2. "Start here" — the three canonical guides a first-time visitor should read.
3. The six pillars as a grid, each with its own one-line definition and article
   count.
4. Latest and recently updated, side by side. "Updated" is a first-class
   signal on this site, not an afterthought.
5. The tools strip (built in Prompt 6).
6. Trust band: how we review, who reviews, what we refuse to publish. Links to
   /editorial-standards and /reviewers.
7. Newsletter block — one field, honest copy about frequency, no pop-up. Ever.

PILLAR HUB (/<pillar>)
1. Pillar header: what this covers, what it deliberately does not.
2. A 300–500 word orientation written for someone who knows nothing.
3. Clusters as sections, each with its articles in reading order — a curated
   path, not a reverse-chronological dump.
4. "Common questions" pulled from the FAQ frontmatter across the pillar.
5. Cross-links to the two most-related pillars.

CONSTRAINTS
- Above the fold: no layout shift, no client JS, LCP is text or the inline SVG.
- Every hub is a genuine reading path. If a section is only there for SEO, cut it.

DONE WHEN
CLS is 0, LCP is under 1.2s on a throttled 4G Moto G, and a stranger can name
the six pillars after ten seconds on the homepage.
```

---

## Prompt 5 — Article template and editorial trust layer

```
Build the article template. This page is the product.

BUILD
1. Header: breadcrumb, pillar, H1, lede, evidence badge, author, reviewer,
   published and updated dates, reading time.
2. Body: 68ch measure, generous leading, subheads that scan, MDX components
   from Prompt 3 available inside content.
3. Sticky TOC on desktop that tracks position; collapsible summary on mobile.
4. KeyTakeaways at the top — three to five sentences, each independently true.
5. Inline citations: [^1] style, superscript, links to the reference list, and
   the reference list renders full bibliographic detail with a DOI or URL.
6. "What the evidence says" module: the claim, the strength, the caveat, and
   what would change our mind.
7. "Try tonight" module: the smallest concrete action from the article.
8. When to see a doctor — required on any article touching a sleep disorder,
   rendered from a shared component so the wording never drifts.
9. Footer: reviewer byline with credentials, correction history, related
   articles, next in the cluster, newsletter.
10. /editorial-standards: sourcing, review process, corrections, funding,
    affiliate disclosure, and what we refuse to publish. Write it properly —
    this page is the reason the site gets to call itself an authority.

CONSTRAINTS
- No claim without a citation. No citation without a working link.
- Affiliate links disclosed inline at first use, not only in the footer.
- Print stylesheet that produces a clean, readable page.

DONE WHEN
A seed article renders end to end, every footnote round-trips both ways, and
the page is fully navigable and comprehensible with CSS disabled.
```

---

## Prompt 6 — Interactive tools

```
Build the tools. These earn the links and the return visits.

1. Wind-down planner — enter your wake time and how long you take to fall
   asleep; get a personalised 90-minute runway with timed steps. Shareable via
   URL state.
2. Breathing pacer — an animated visual guide for 4-7-8, box breathing,
   physiological sigh, and coherent breathing at 5.5 breaths/min. Audio cue
   optional and off by default. Honours prefers-reduced-motion with a
   non-animated count.
3. Sleep-need estimator — age band, sleep debt over the last week, and a plain
   reading of what it means. States its assumptions and its limits on screen.
4. Bedroom audit — a scored checklist across light, temperature, sound, air and
   bedding, with a prioritised fix list at the end.
5. Chronotype questionnaire — a short, sourced instrument with a clear
   "this is not a diagnosis" frame.

CONSTRAINTS
- Each tool is one client component in an otherwise static page.
- State in the URL, never on a server. No account, no email wall.
- Every tool has a written explainer beneath it and cites its basis.
- Every tool works with a keyboard alone and announces results to screen readers.

DONE WHEN
Each tool is under 20KB of client JS gzipped, works offline after first load,
and its results are reachable without a mouse.
```

---

## Prompt 7 — Search, discovery and the newsletter

```
Make 400 articles findable.

BUILD
1. Client-side search over a prebuilt index (title, description, headings,
   keywords). Cmd/Ctrl-K, arrow-key navigation, grouped by pillar, recent
   searches, empty and no-result states that suggest a path forward.
2. Filter and sort on hub pages: cluster, evidence level, reading time,
   recently updated.
3. Related-articles engine: shared cluster, then shared keywords, then same
   pillar. Never the same three articles on every page.
4. "Continue reading" path — every article proposes the sensible next one.
5. Newsletter: a real double opt-in flow, one field, honest expectations, a
   confirmation page worth reading, and an unsubscribe link that works in one
   click. Inline blocks only — no interstitials, no exit-intent, no pop-ups.
6. RSS, JSON feed, and a sitemap that splits by pillar.

CONSTRAINTS
- Search index under 300KB gzipped, loaded on interaction, not on page load.
- Zero tracking inside the search box.

DONE WHEN
Search returns useful results for "can't fall asleep", "4-7-8", "bedroom too
warm" and "naps" from a cold cache in under 150ms.
```

---

## Prompt 8 — SEO, structured data, performance and accessibility

```
Make Aromatabs legible to search engines and to everyone.

BUILD
1. Metadata: unique title and description per route, canonical URLs, OG and
   Twitter cards using assets/social/posts/og-*.svg as the template, with a
   dynamic OG image route that renders the article title into the same design.
2. JSON-LD: Organization, WebSite + SearchAction, Article (with author,
   reviewedBy, datePublished, dateModified, citation), BreadcrumbList,
   FAQPage where FAQ frontmatter exists, HowTo on the routine articles.
3. E-E-A-T surface: /reviewers with real credentials and links, author pages,
   visible review dates, a correction log, and a funding statement.
4. robots.txt, sitemap index, hreflang scaffolding for later, 301 map file.
5. Performance: static generation everywhere, next/image with explicit
   dimensions, preload the two critical fonts, inline critical CSS, keep total
   client JS on an article page under 40KB gzipped.
6. Accessibility pass: heading order, landmarks, skip link, focus management on
   route change, form labels and errors, live regions on tools, colour-blind
   check on the evidence badges, full keyboard walkthrough of every page.

CONSTRAINTS
- No structured data describing anything the page does not actually show.
- No SEO copy written for machines. If it reads badly aloud, rewrite it.

DONE WHEN
Rich Results Test passes on Article, FAQ and Breadcrumb; Lighthouse ≥ 95 across
all four categories on homepage, hub, article and tool pages; axe-core reports
zero violations sitewide.
```

---

## Prompt 9 — Commerce, quality gates and launch

```
Connect the commercial layer without compromising the editorial one, then ship.

BUILD
1. Product surface: /shop for Aromatabs tabs, plus contextual product modules
   inside articles that are clearly labelled and never dressed as editorial.
   A product only appears where it is genuinely relevant.
2. Affiliate handling: a single link component that applies rel="sponsored
   nofollow", logs the click, and renders the disclosure inline at first use.
   A central affiliates.ts registry — no bare affiliate URLs in content.
3. Analytics: privacy-first, cookieless, self-hostable. Track pageviews,
   scroll depth on articles, tool completions, and newsletter conversions.
   Nothing else.
4. Testing: Vitest for lib/content and the tool logic, Playwright for the
   critical paths (search, newsletter, each tool, article navigation),
   axe-core in CI, visual regression on the styleguide.
5. CI: typecheck, lint, test, build, Lighthouse CI budget, broken-link check
   across all internal links and all citation URLs. Red CI blocks the merge.
6. Launch checklist: 404 and 500 pages, security headers, CSP, favicon set,
   web manifest, sitemap submitted, analytics verified, newsletter round-trip
   tested with a real address, legal pages (privacy, terms, affiliate
   disclosure, medical disclaimer), and a monitored contact route.

CONSTRAINTS
- Commercial modules never appear above the first substantive section.
- A citation URL that 404s fails the build. Authority is a maintenance job.

DONE WHEN
CI is green, the Playwright suite covers every critical path, and the launch
checklist is signed off item by item.
```

---

## After the nine

The build is done; the site is not. What follows is editorial cadence:

- Two to three researched articles a week, each one reviewed before publication.
- A quarterly re-review of every article marked `strong` or `moderate` — the
  evidence moves, and `updatedAt` has to mean something.
- Monthly broken-citation sweep.
- A quarterly read of what people actually searched for and did not find.
