import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleCard } from '@/components/content/ArticleCard';
import { Breadcrumbs } from '@/components/nav/Breadcrumbs';
import { Prose } from '@/components/layout/Prose';
import { RippleField } from '@/components/layout/RippleField';
import { Section } from '@/components/layout/Section';
import { getPillar } from '@/lib/content';
import { findPillar, pillars } from '@/lib/taxonomy';

type Params = { pillar: string };

export function generateStaticParams(): Params[] {
  return pillars.map((pillar) => ({ pillar: pillar.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pillar } = await params;
  const info = findPillar(pillar);
  if (!info) return {};
  return {
    title: info.name,
    description: info.blurb,
    alternates: { canonical: `/${info.slug}` },
  };
}

export default async function PillarPage({ params }: { params: Promise<Params> }) {
  const { pillar: slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  return (
    <>
      <Section tone="linen" spacing="tight" className="overflow-hidden">
        <RippleField
          origin={{ x: 92, y: 20 }}
          rings={8}
          opacity={0.12}
          className="text-at-brand"
        />
        <div className="relative">
          <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: pillar.name }]} />
          <h1 className="max-w-[18ch] font-display text-4xl leading-tight sm:text-5xl">
            {pillar.name}
          </h1>
          <p className="mt-4 max-w-prose text-lg text-muted">{pillar.blurb}</p>
          <Prose className="mt-8">
            {pillar.orientation.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </Prose>
          <p className="mt-8 max-w-prose rounded-lg border border-hairline p-5 text-sm text-muted">
            <span className="font-semibold text-content">
              What this pillar does not cover.
            </span>{' '}
            {pillar.outOfScope}
          </p>
        </div>
      </Section>

      <Section tone="cloud" spacing="default">
        <h2 className="sr-only">Clusters</h2>
        <div className="space-y-16">
          {pillar.clusters.map((cluster) => (
            <section key={cluster.slug} aria-labelledby={`cluster-${cluster.slug}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 id={`cluster-${cluster.slug}`} className="font-display text-2xl">
                  <Link
                    href={`/${pillar.slug}/${cluster.slug}`}
                    className="rounded-sm underline-offset-4 hover:underline"
                  >
                    {cluster.name}
                  </Link>
                </h3>
                <p className="text-sm text-muted">
                  {cluster.articles.length}{' '}
                  {cluster.articles.length === 1 ? 'guide' : 'guides'}
                </p>
              </div>
              <p className="mt-2 max-w-prose text-muted">{cluster.blurb}</p>
              <div className="mt-6">
                {cluster.articles.length === 0 ? (
                  <p className="border-t border-hairline py-6 text-sm text-muted">
                    Nothing published in this cluster yet.
                  </p>
                ) : (
                  cluster.articles.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))
                )}
              </div>
            </section>
          ))}
        </div>
      </Section>

      <Section tone="linen" spacing="tight">
        <h2 className="font-display text-2xl">Where to go next</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {pillar.neighbours.map((neighbour) => {
            const info = findPillar(neighbour);
            if (!info) return null;
            return (
              <li key={neighbour} className="rounded-lg border border-hairline p-5">
                <Link
                  href={`/${info.slug}`}
                  className="rounded-sm font-display text-xl underline-offset-4 hover:underline"
                >
                  {info.name}
                </Link>
                <p className="mt-2 text-sm text-muted">{info.blurb}</p>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}
