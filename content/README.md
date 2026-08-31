# Content

Articles live at `content/<pillar>/<slug>.mdx`. The directory decides the
pillar, the filename decides the slug, and both are checked against the
frontmatter — a mismatch fails the build.

Nothing outside `lib/content.ts` reads this directory.

## Frontmatter

Validated by `lib/content-schema.ts` at build time. A malformed file stops the
build with the path and the offending field; it does not ship.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `slug` | yes | lowercase, hyphenated, must equal the filename |
| `pillar` | yes | one of the six in `lib/taxonomy.ts`, must equal the directory |
| `cluster` | yes | must be a cluster **of that pillar** |
| `description` | yes | 160 characters maximum |
| `publishedAt` / `updatedAt` | yes | `YYYY-MM-DD`; `updatedAt` cannot precede `publishedAt` |
| `author` | yes | an id from `lib/people.ts` |
| `reviewedBy` | conditional | **required** when `evidenceLevel` is `strong` or `moderate` |
| `reviewedAt` | conditional | required whenever `reviewedBy` is set |
| `evidenceLevel` | yes | `strong` \| `moderate` \| `emerging` \| `contested` |
| `citations[]` | yes (may be empty) | `{ id, authors, year, title, journal?, url, doi? }` |
| `related[]` | no | slugs of other articles; every entry must exist |
| `keywords[]` | no | |
| `hero` | no | |
| `faq[]` | no | `{ q, a }` |
| `draft` | no | defaults to false; drafts are excluded from production builds |

`readingTime` is derived from the body, not declared.

## Citations

Cite in the body with `[^id]`, matching a citation id in the frontmatter. Two
rules are enforced at build time and both are fatal:

- a `[^id]` with no matching citation
- a citation that is never cited in the body

Footnote markers are rewritten into superscript links to the reference list.

> **Before publishing, verify every citation against its primary source.**
> The seed references are real papers, but their DOIs and URLs were written
> without network access and have not been machine-checked. Run
> `npm run check:citations` on a networked machine; where a `pubmed.ncbi.nlm.nih.gov/?term=`
> lookup link is used, replace it with a direct DOI once confirmed.

## Related links, and the three-sibling rule

Every published article must resolve at least three related articles or the
build fails. Resolution is bidirectional by construction, in this order:

1. slugs listed in `related`
2. articles that list *this* article in their `related` (so a one-way link
   still connects both ways)
3. other articles in the same cluster
4. other articles in the same pillar

## Adding a pillar or cluster

Edit `lib/taxonomy.ts`. Routes, hub pages, navigation, the footer and the
frontmatter validator all read from it — there is nowhere else to update.
