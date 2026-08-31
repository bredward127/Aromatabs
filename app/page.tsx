import Link from 'next/link';

import { ArticleCard } from '@/components/content/ArticleCard';
import { Prose } from '@/components/layout/Prose';
import { RippleField } from '@/components/layout/RippleField';
import { Section } from '@/components/layout/Section';
import { getAllPillars, getRecentlyUpdated } from '@/lib/content';
import { site } from '@/lib/site';

/**
 * A hub, not the finished homepage. The hero, start-here path, tools strip and
 * trust band arrive with the homepage build; this exists so the taxonomy is
 * reachable and every route has a way in.
 */
export default function HomePage() {
  const pillars = getAllPillars();
  const recent = getRecentlyUpdated(4);

  return (
    <>
      <Section tone="linen" spacing="loose" className="overflow-hidden">
        <RippleField
          origin={{ x: 88, y: 30 }}
          rings={9}
          opacity={0.14}
          className="text-at-brand"
        />
        <div className="relative">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {site.descriptor}
          </p>
          <h1 className="mt-5 max-w-[16ch] font-display text-4xl leading-[1.08] sm:text-6xl">
            {site.tagline}
          </h1>
          <Prose className="mt-8">
            <p>{site.description}</p>
            <p>
              Every claim is cited. Where the evidence is thin we label it and say so.{' '}
              <Link href="/editorial-standards">How we work</Link>.
            </p>
          </Prose>
        </div>
      </Section>

      <Section tone="cloud" spacing="default">
        <h2 className="font-display text-2xl">The six topics</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {pillars.map((pillar) => (
            <li key={pillar.slug} className="border-t border-hairline py-6">
              <h3 className="font-display text-xl">
                <Link
                  href={`/${pillar.slug}`}
                  className="rounded-sm underline-offset-4 hover:underline"
                >
                  {pillar.name}
                </Link>
              </h3>
              <p className="mt-2 max-w-prose text-sm text-muted">{pillar.blurb}</p>
              <p className="mt-3 text-xs text-muted">
                {pillar.articleCount} {pillar.articleCount === 1 ? 'guide' : 'guides'}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="linen" spacing="default">
        <h2 className="font-display text-2xl">Recently updated</h2>
        <p className="mt-2 max-w-prose text-sm text-muted">
          When a guide changes, the date changes with it.
        </p>
        <div className="mt-6">
          {recent.map((article) => (
            <ArticleCard key={article.slug} article={article} showPillar />
          ))}
        </div>
      </Section>
    </>
  );
}
