import 'server-only';

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

import { frontmatterSchema, type Citation, type Frontmatter } from './content-schema';
import {
  findCluster,
  findPillar,
  pillars,
  type ClusterDefinition,
  type PillarDefinition,
} from './taxonomy';
import { findPerson, type Person } from './people';

const CONTENT_DIR = join(process.cwd(), 'content');

/** Enough related links that no article is a dead end. */
const MIN_RELATED = 3;

/** `[^smith2020]` in the body, resolved against the citations in frontmatter. */
const FOOTNOTE_MARKER = /\[\^([A-Za-z0-9_-]+)\]/g;

export type Article = Frontmatter & {
  /** `<pillar>/<cluster>/<slug>` - unique, and the URL path. */
  path: string;
  body: string;
  readingTime: number;
  wordCount: number;
  headings: { depth: number; text: string; id: string }[];
};

export type ArticleWithContext = Article & {
  pillarInfo: PillarDefinition;
  clusterInfo: ClusterDefinition;
  authorInfo: Person;
  reviewerInfo?: Person;
};

// ---------------------------------------------------------------- loading ---

function mdxFiles(): { pillar: string; file: string; absolute: string }[] {
  let pillarDirs: string[];
  try {
    pillarDirs = readdirSync(CONTENT_DIR).filter((entry) =>
      statSync(join(CONTENT_DIR, entry)).isDirectory(),
    );
  } catch {
    throw new Error(
      `No content directory at ${CONTENT_DIR}. Articles live in content/<pillar>/<slug>.mdx`,
    );
  }

  return pillarDirs.flatMap((pillar) =>
    readdirSync(join(CONTENT_DIR, pillar))
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => ({ pillar, file, absolute: join(CONTENT_DIR, pillar, file) })),
  );
}

const WORDS_PER_MINUTE = 200;

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function parseHeadings(body: string): Article['headings'] {
  const headings: Article['headings'] = [];
  let inFence = false;
  for (const line of body.split('\n')) {
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
    if (match?.[1] && match[2]) {
      const text = match[2].replace(/[*_`]/g, '');
      headings.push({ depth: match[1].length, text, id: slugifyHeading(text) });
    }
  }
  return headings;
}

function fail(relativePath: string, detail: string): never {
  throw new Error(`content/${relativePath}\n  ${detail}`);
}

function loadAll(): Article[] {
  const articles: Article[] = [];

  for (const { pillar, file, absolute } of mdxFiles()) {
    const relative = `${pillar}/${file}`;
    const raw = readFileSync(absolute, 'utf8');
    const { data, content } = matter(raw);

    const parsed = frontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('\n');
      fail(relative, `invalid frontmatter\n${issues}`);
    }

    const front = parsed.data;

    // The directory is authoritative: a file cannot claim a pillar it is not in.
    if (front.pillar !== pillar) {
      fail(
        relative,
        `frontmatter pillar "${front.pillar}" does not match its directory`,
      );
    }
    const expectedFile = `${front.slug}.mdx`;
    if (file !== expectedFile) {
      fail(
        relative,
        `slug "${front.slug}" does not match the filename (expected ${expectedFile})`,
      );
    }
    if (findPerson(front.author) === undefined) {
      fail(relative, `unknown author "${front.author}"`);
    }

    // A footnote that points at a citation which does not exist is a broken
    // claim, so it stops the build rather than rendering as literal text.
    const citationIds = new Set(front.citations.map((c) => c.id));
    const referenced = new Set<string>();
    for (const match of content.matchAll(FOOTNOTE_MARKER)) {
      const id = match[1];
      if (!id) continue;
      if (!citationIds.has(id)) {
        fail(relative, `footnote [^${id}] has no matching citation in frontmatter`);
      }
      referenced.add(id);
    }
    for (const id of citationIds) {
      if (!referenced.has(id)) {
        fail(
          relative,
          `citation "${id}" is never cited in the body. Cite it with [^${id}] or remove it.`,
        );
      }
    }

    const words = content.trim().split(/\s+/).filter(Boolean).length;

    articles.push({
      ...front,
      path: `${front.pillar}/${front.cluster}/${front.slug}`,
      body: content,
      wordCount: words,
      readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      headings: parseHeadings(content),
    });
  }

  const paths = new Set<string>();
  for (const article of articles) {
    if (paths.has(article.path)) {
      throw new Error(`Two articles resolve to the same path: ${article.path}`);
    }
    paths.add(article.path);
  }

  // Cross-file checks. These run once, at build time, and are fatal - a broken
  // link between articles is a content bug, not a runtime surprise.
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  for (const article of articles) {
    for (const slug of article.related) {
      if (!bySlug.has(slug)) {
        fail(
          `${article.pillar}/${article.slug}.mdx`,
          `related: "${slug}" does not exist`,
        );
      }
      if (slug === article.slug) {
        fail(
          `${article.pillar}/${article.slug}.mdx`,
          'related: an article cannot relate to itself',
        );
      }
    }
  }

  const published = articles.filter((a) => !a.draft);
  for (const article of published) {
    const count = resolveRelated(article, published).length;
    if (count < MIN_RELATED) {
      fail(
        `${article.pillar}/${article.slug}.mdx`,
        `resolves only ${count} related article(s); every article needs at least ${MIN_RELATED}. ` +
          `Add slugs to related[], or publish more articles in ${article.pillar}.`,
      );
    }
  }

  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/**
 * Parsed once per process. Next builds each route in the same worker, so this
 * reads and validates the corpus a single time rather than per page.
 */
let cache: Article[] | undefined;

function corpus(): Article[] {
  cache ??= loadAll();
  return cache;
}

// ------------------------------------------------------------------- api ----

function isVisible(article: Article): boolean {
  // Drafts are visible while developing so they can be previewed, and never
  // in a production build.
  return !article.draft || process.env.NODE_ENV === 'development';
}

export function getAllArticles(): Article[] {
  return corpus().filter(isVisible);
}

export function getArticle(slug: string): Article | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

export function getAllPillars(): (PillarDefinition & {
  articleCount: number;
  clusters: (ClusterDefinition & { articles: Article[] })[];
})[] {
  return pillars.map((pillar) => getPillar(pillar.slug)!);
}

export function getPillar(slug: string) {
  const pillar = findPillar(slug);
  if (!pillar) return undefined;
  const articles = getAllArticles().filter((article) => article.pillar === slug);
  return {
    ...pillar,
    articleCount: articles.length,
    clusters: pillar.clusters.map((cluster) => ({
      ...cluster,
      articles: articles.filter((article) => article.cluster === cluster.slug),
    })),
  };
}

export function getCluster(pillarSlug: string, clusterSlug: string) {
  const pillar = findPillar(pillarSlug);
  const cluster = findCluster(pillarSlug, clusterSlug);
  if (!pillar || !cluster) return undefined;
  return {
    ...cluster,
    pillarInfo: pillar,
    articles: getAllArticles().filter(
      (article) => article.pillar === pillarSlug && article.cluster === clusterSlug,
    ),
  };
}

/**
 * Related links are bidirectional by construction: an article that names you
 * is related to you whether or not you named it back. Explicit links come
 * first, then reverse links, then cluster siblings, then pillar siblings -
 * so no article is ever a dead end.
 */
function resolveRelated(article: Article, pool: Article[]): Article[] {
  const bySlug = new Map(pool.map((a) => [a.slug, a]));
  const ordered: Article[] = [];
  const seen = new Set<string>([article.slug]);

  const push = (candidate: Article | undefined) => {
    if (!candidate || seen.has(candidate.slug)) return;
    seen.add(candidate.slug);
    ordered.push(candidate);
  };

  for (const slug of article.related) push(bySlug.get(slug));
  for (const other of pool) if (other.related.includes(article.slug)) push(other);
  for (const other of pool) {
    if (other.pillar === article.pillar && other.cluster === article.cluster)
      push(other);
  }
  for (const other of pool) if (other.pillar === article.pillar) push(other);

  return ordered;
}

export function getRelated(slug: string, limit = 4): Article[] {
  const pool = getAllArticles();
  const article = pool.find((a) => a.slug === slug);
  if (!article) return [];
  return resolveRelated(article, pool).slice(0, limit);
}

export function getArticleWithContext(
  pillarSlug: string,
  clusterSlug: string,
  slug: string,
): ArticleWithContext | undefined {
  const article = getAllArticles().find(
    (a) => a.slug === slug && a.pillar === pillarSlug && a.cluster === clusterSlug,
  );
  if (!article) return undefined;
  const pillarInfo = findPillar(article.pillar);
  const clusterInfo = findCluster(article.pillar, article.cluster);
  const authorInfo = findPerson(article.author);
  if (!pillarInfo || !clusterInfo || !authorInfo) return undefined;
  const reviewer = article.reviewedBy ? findPerson(article.reviewedBy) : undefined;
  return {
    ...article,
    pillarInfo,
    clusterInfo,
    authorInfo,
    ...(reviewer ? { reviewerInfo: reviewer } : {}),
  };
}

export function getRecentlyUpdated(limit = 6): Article[] {
  return [...getAllArticles()]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export type SearchDocument = {
  path: string;
  title: string;
  description: string;
  pillar: string;
  cluster: string;
  keywords: string[];
  headings: string[];
};

/** Consumed by the search index in a later step; built here so the shape is fixed. */
export function buildSearchIndex(): SearchDocument[] {
  return getAllArticles().map((article) => ({
    path: article.path,
    title: article.title,
    description: article.description,
    pillar: article.pillar,
    cluster: article.cluster,
    keywords: article.keywords,
    headings: article.headings.map((h) => h.text),
  }));
}

export function getAllCitations(): (Citation & { articlePath: string })[] {
  return getAllArticles().flatMap((article) =>
    article.citations.map((citation) => ({ ...citation, articlePath: article.path })),
  );
}

/**
 * Rewrites `[^id]` markers into superscript links to the reference list.
 * Done here rather than in a remark plugin because the citation data lives in
 * frontmatter, not in the body.
 */
export function linkFootnotes(article: Article): string {
  const order = new Map(article.citations.map((citation, i) => [citation.id, i + 1]));
  return article.body.replace(FOOTNOTE_MARKER, (match, id: string) => {
    const index = order.get(id);
    if (index === undefined) return match;
    return `<sup><a href="#ref-${id}" aria-label="Reference ${index}" className="text-link no-underline">${index}</a></sup>`;
  });
}
