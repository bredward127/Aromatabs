import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/nav/Breadcrumbs';
import { Prose } from '@/components/layout/Prose';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'How to reach us, and what we can and cannot answer.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <Section tone="linen" spacing="default">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Contact' }]} />
      <h1 className="font-display text-4xl sm:text-5xl">Contact</h1>
      <Prose className="mt-8">
        <h2>Corrections</h2>
        <p>
          If we have got something wrong — a claim, a citation, a link that no longer
          resolves — we want to know. Corrections take priority over everything else in
          the inbox.
        </p>

        <h2>Anything else</h2>
        <p>
          Questions about the site, the research, or how we work are welcome. We read
          everything and reply to what we can.
        </p>

        <h2>What we cannot do</h2>
        <p>
          We cannot answer questions about your own health, review your symptoms, or
          tell you whether something is safe for you to take. Those need a clinician who
          knows your history. This is not caution for its own sake — it is the same
          principle as the rest of our{' '}
          <Link href="/editorial-standards">editorial standards</Link>.
        </p>
        <p>
          We do not accept guest posts, sponsored placements, or link exchanges, and
          those messages do not get a reply.
        </p>
      </Prose>

      <p className="mt-10 rounded-lg border border-hairline p-6 text-muted">
        A monitored contact route goes live with launch. Until then there is nothing
        here that would reach anyone, and we would rather say that than show you a form
        that quietly discards what you write.
      </p>
    </Section>
  );
}
