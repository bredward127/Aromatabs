import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { RippleField } from '@/components/layout/RippleField';
import { Prose } from '@/components/layout/Prose';
import { site } from '@/lib/site';

/**
 * A holding page. The real homepage - hero, start-here, pillars, tools,
 * trust band - is built once the content model exists.
 */
export default function HomePage() {
  return (
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
            The foundation is in place: tokens, type, layout primitives and site chrome.
            Content, templates and tools follow.{' '}
            {/* prefetch off until the route exists - see SiteHeader. */}
            <Link href="/editorial-standards" prefetch={false}>
              How we work
            </Link>
            .
          </p>
        </Prose>
      </div>
    </Section>
  );
}
