import Link from 'next/link';
import type { Article } from '@/lib/content';
import { findPillar } from '@/lib/taxonomy';

type ArticleCardProps = {
  article: Article;
  /** Show which pillar it belongs to - useful outside a pillar's own pages. */
  showPillar?: boolean;
};

export function ArticleCard({ article, showPillar = false }: ArticleCardProps) {
  const pillar = findPillar(article.pillar);
  return (
    <article className="group border-t border-hairline py-6">
      <h3 className="font-display text-xl leading-snug">
        <Link
          href={`/${article.path}`}
          className="rounded-sm underline-offset-4 group-hover:underline"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 max-w-prose text-sm text-muted">{article.description}</p>
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        {showPillar && pillar && (
          <>
            <span className="font-semibold uppercase tracking-[0.14em] text-link">
              {pillar.name}
            </span>
            <span aria-hidden="true">·</span>
          </>
        )}
        <span>{article.readingTime} min read</span>
        <span aria-hidden="true">·</span>
        <span>
          Updated{' '}
          <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
        </span>
      </p>
    </article>
  );
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
