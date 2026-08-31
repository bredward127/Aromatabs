import Link from 'next/link';
import { Section } from '@/components/layout/Section';
import { Prose } from '@/components/layout/Prose';
import { pillars } from '@/lib/site';

export default function NotFound() {
  return (
    <Section tone="linen" spacing="loose">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-accent">
        404
      </p>
      <h1 className="mt-5 font-display text-4xl sm:text-5xl">
        That page isn&rsquo;t here
      </h1>
      <Prose className="mt-6">
        <p>
          It may not be written yet. Most of the site arrives with the content model; in
          the meantime, these are the topics we cover:
        </p>
        <ul>
          {pillars.map((pillar) => (
            <li key={pillar.slug}>
              <Link href={`/${pillar.slug}`}>{pillar.name}</Link> — {pillar.blurb}
            </li>
          ))}
        </ul>
      </Prose>
    </Section>
  );
}
