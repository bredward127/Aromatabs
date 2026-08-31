import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleCard } from '@/components/content/ArticleCard';
import { Breadcrumbs } from '@/components/nav/Breadcrumbs';
import { Section } from '@/components/layout/Section';
import { getCluster } from '@/lib/content';
import { findCluster, findPillar, pillars } from '@/lib/taxonomy';

type Params = { pillar: string; cluster: string };

export function generateStaticParams(): Params[] {
  return pillars.flatMap((pillar) =>
    pillar.clusters.map((cluster) => ({ pillar: pillar.slug, cluster: cluster.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { pillar, cluster } = await params;
  const info = findCluster(pillar, cluster);
  if (!info) return {};
  return {
    title: info.name,
    description: info.blurb,
    alternates: { canonical: `/${pillar}/${cluster}` },
  };
}

export default async function ClusterPage({ params }: { params: Promise<Params> }) {
  const { pillar: pillarSlug, cluster: clusterSlug } = await params;
  const cluster = getCluster(pillarSlug, clusterSlug);
  if (!cluster) notFound();

  const siblings =
    findPillar(pillarSlug)?.clusters.filter((c) => c.slug !== clusterSlug) ?? [];

  return (
    <>
      <Section tone="linen" spacing="tight">
        <Breadcrumbs
          trail={[
            { href: '/', label: 'Home' },
            { href: `/${cluster.pillarInfo.slug}`, label: cluster.pillarInfo.name },
            { label: cluster.name },
          ]}
        />
        <h1 className="max-w-[20ch] font-display text-4xl leading-tight sm:text-5xl">
          {cluster.name}
        </h1>
        <p className="mt-4 max-w-prose text-lg text-muted">{cluster.blurb}</p>
      </Section>

      <Section tone="cloud" spacing="default">
        <h2 className="font-display text-xl">In reading order</h2>
        <div className="mt-4">
          {cluster.articles.length === 0 ? (
            <p className="border-t border-hairline py-6 text-sm text-muted">
              Nothing published here yet.
            </p>
          ) : (
            cluster.articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))
          )}
        </div>
      </Section>

      {siblings.length > 0 && (
        <Section tone="linen" spacing="tight">
          <h2 className="font-display text-2xl">
            Also in {cluster.pillarInfo.name.toLowerCase()}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {siblings.map((sibling) => (
              <li key={sibling.slug} className="rounded-lg border border-hairline p-5">
                <Link
                  href={`/${cluster.pillarInfo.slug}/${sibling.slug}`}
                  className="rounded-sm font-display text-xl underline-offset-4 hover:underline"
                >
                  {sibling.name}
                </Link>
                <p className="mt-2 text-sm text-muted">{sibling.blurb}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
