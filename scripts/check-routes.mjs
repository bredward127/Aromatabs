/**
 * Proves the content model end to end: every route the taxonomy and the corpus
 * imply is reachable, and every page below the top level carries the right
 * breadcrumb trail.
 *
 *   npx next build && npx next start -p 3111
 *   node scripts/check-routes.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ORIGIN = process.env.CHECK_ORIGIN ?? 'http://localhost:3111';
const CONTENT = join(process.cwd(), 'content');

let failures = 0;
const check = (ok, label, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'pass' : 'FAIL'}  ${label}${detail ? `  ${detail}` : ''}`);
};

/** Frontmatter fields we need, without pulling in a YAML parser. */
function readFront(file) {
  const raw = readFileSync(file, 'utf8');
  const front = raw.split('---')[1] ?? '';
  const field = (name) => {
    const m = new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(front);
    return m?.[1]?.trim().replace(/^['"]|['"]$/g, '');
  };
  return {
    slug: field('slug'),
    pillar: field('pillar'),
    cluster: field('cluster'),
    title: field('title'),
    draft: field('draft') === 'true',
  };
}

const articles = readdirSync(CONTENT)
  .filter((entry) => statSync(join(CONTENT, entry)).isDirectory())
  .flatMap((pillar) =>
    readdirSync(join(CONTENT, pillar))
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => readFront(join(CONTENT, pillar, f))),
  )
  .filter((a) => !a.draft);

const pillarSlugs = [...new Set(articles.map((a) => a.pillar))];
const clusterPaths = [...new Set(articles.map((a) => `${a.pillar}/${a.cluster}`))];
const staticPages = [
  '/',
  '/about',
  '/editorial-standards',
  '/reviewers',
  '/contact',
  '/tools',
];

function breadcrumbTrail(html) {
  const nav = /<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/.exec(html);
  if (!nav) return null;
  return [...nav[0].matchAll(/>([^<>]+)</g)]
    .map((m) => m[1].trim())
    .filter((text) => text && text !== '/')
    .map((text) =>
      text
        .replace(/&#x27;|&rsquo;/g, "'")
        .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
        .replace(/&amp;/g, '&'),
    );
}

async function get(path) {
  const res = await fetch(ORIGIN + path);
  return { status: res.status, html: await res.text() };
}

console.log(
  `${pillarSlugs.length} pillars, ${clusterPaths.length} clusters, ${articles.length} articles.\n`,
);

for (const page of staticPages) {
  const { status } = await get(page);
  check(status === 200, `${page} renders`, String(status));
}

for (const pillar of pillarSlugs) {
  const { status, html } = await get(`/${pillar}`);
  const trail = breadcrumbTrail(html);
  check(status === 200, `/${pillar} renders`, String(status));
  check(
    trail?.[0] === 'Home' && trail?.length === 2,
    `/${pillar} breadcrumb`,
    trail?.join(' / ') ?? '',
  );
}

for (const path of clusterPaths) {
  const { status, html } = await get(`/${path}`);
  const trail = breadcrumbTrail(html);
  check(status === 200, `/${path} renders`, String(status));
  check(
    trail?.length === 3 && trail[0] === 'Home',
    `/${path} breadcrumb`,
    trail?.join(' / ') ?? '',
  );
}

for (const article of articles) {
  const path = `/${article.pillar}/${article.cluster}/${article.slug}`;
  const { status, html } = await get(path);
  const trail = breadcrumbTrail(html);
  check(status === 200, `${path} renders`, String(status));
  check(
    trail?.length === 4 && trail[0] === 'Home' && trail[3] === article.title,
    `${path} breadcrumb ends at its own title`,
    trail?.join(' / ') ?? '',
  );
  // No article should be a dead end.
  const relatedCount = (
    html.match(/class="group border-t border-hairline py-6"/g) ?? []
  ).length;
  check(relatedCount >= 3, `${path} offers at least 3 related`, String(relatedCount));
}

const missing = await get('/definitely-not-a-page');
check(missing.status === 404, 'unknown path returns 404', String(missing.status));

console.log(
  failures === 0 ? '\nall route checks passed' : `\n${failures} check(s) failed`,
);
process.exit(failures === 0 ? 0 : 1);
