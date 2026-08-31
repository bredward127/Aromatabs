import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';

import { ArticleCard, formatDate } from '@/components/content/ArticleCard';
import { CitationList } from '@/components/content/CitationList';
import { EvidenceBadge } from '@/components/content/EvidenceBadge';
import { mdxComponents } from '@/components/content/mdx';
import { Breadcrumbs } from '@/components/nav/Breadcrumbs';
import { Prose } from '@/components/layout/Prose';
import { Section } from '@/components/layout/Section';
import {
  getAllArticles,
  getArticleWithContext,
  getRelated,
  linkFootnotes,
} from '@/lib/content';

type Params = { pillar: string; cluster: string; slug: string };

export function generateStaticParams(): Params[] {
  return getAllArticles().map((article) => ({
    pillar: article.pillar,
    cluster: article.cluster,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pillar, cluster, slug } = await params;
  const article = getArticleWithContext(pillar, cluster, slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    keywords: [...article.keywords],
    alternates: { canonical: `/${article.path}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { pillar, cluster, slug } = await params;
  const article = getArticleWithContext(pillar, cluster, slug);
  if (!article) notFound();

  const related = getRelated(article.slug, 3);
  const reviewPending = article.reviewerInfo?.status === 'pending';

  return (
    <>
      <Section tone="linen" spacing="tight" as="article">
        <Breadcrumbs
          trail={[
            { href: '/', label: 'Home' },
            { href: `/${article.pillar}`, label: article.pillarInfo.name },
            {
              href: `/${article.pillar}/${article.cluster}`,
              label: article.clusterInfo.name,
            },
            { label: article.title },
          ]}
        />

        <header className="measure">
          <h1 className="font-display text-4xl leading-[1.12] sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg text-muted">{article.description}</p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <EvidenceBadge level={article.evidenceLevel} />
            <span className="text-sm text-muted">{article.readingTime} min read</span>
          </div>

          <dl className="mt-6 grid gap-x-8 gap-y-2 border-t border-hairline pt-6 text-sm sm:grid-cols-2">
            <div className="flex gap-2">
              <dt className="text-muted">Written by</dt>
              <dd className="text-content">{article.authorInfo.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted">Updated</dt>
              <dd className="text-content">
                <time dateTime={article.updatedAt}>
                  {formatDate(article.updatedAt)}
                </time>
              </dd>
            </div>
          </dl>

          {reviewPending && (
            <p className="mt-6 rounded-lg border border-hairline p-5 text-sm text-muted">
              <span className="font-semibold text-content">
                Awaiting clinical review.
              </span>{' '}
              {article.reviewerInfo?.bio}
            </p>
          )}
        </header>

        <Prose className="mt-12">
          <MDXRemote
            source={linkFootnotes(article)}
            components={mdxComponents}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </Prose>

        <div className="measure">
          <CitationList citations={article.citations} />

          {article.faq && article.faq.length > 0 && (
            <section
              aria-labelledby="faq"
              className="mt-16 border-t border-hairline pt-8"
            >
              <h2 id="faq" className="font-display text-2xl">
                Common questions
              </h2>
              <div className="mt-4 divide-y divide-hairline">
                {article.faq.map((entry) => (
                  <details key={entry.q} className="group py-4">
                    <summary className="cursor-pointer list-none font-semibold marker:content-none">
                      {entry.q}
                    </summary>
                    <p className="mt-3 text-muted">{entry.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      </Section>

      <Section tone="cloud" spacing="default">
        <h2 className="font-display text-2xl">Read next</h2>
        <p className="mt-2 text-sm text-muted">
          More from{' '}
          <Link
            href={`/${article.pillar}`}
            className="text-link underline underline-offset-4"
          >
            {article.pillarInfo.name.toLowerCase()}
          </Link>
          .
        </p>
        <div className="mt-4">
          {related.map((item) => (
            <ArticleCard key={item.slug} article={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
