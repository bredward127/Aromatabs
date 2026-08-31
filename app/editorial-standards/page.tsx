import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/nav/Breadcrumbs';
import { Prose } from '@/components/layout/Prose';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'Editorial standards',
  description:
    'How we source, review, label and correct what we publish — and what we refuse to publish.',
  alternates: { canonical: '/editorial-standards' },
};

export default function EditorialStandardsPage() {
  return (
    <Section tone="linen" spacing="default">
      <Breadcrumbs
        trail={[{ href: '/', label: 'Home' }, { label: 'Editorial standards' }]}
      />
      <h1 className="font-display text-4xl sm:text-5xl">Editorial standards</h1>
      <p className="mt-5 max-w-prose text-lg text-muted">
        This page is the reason the site gets to call itself an authority. If we fall
        short of what is written here, tell us.
      </p>
      <Prose className="mt-10">
        <h2>Sourcing</h2>
        <p>
          Every health claim carries a citation, and every citation links to the source.
          We prefer systematic reviews and meta-analyses, then controlled trials, then
          observational work — and we say which we are relying on when it matters.
        </p>
        <p>
          If we cannot cite it, we cut it. This is a real constraint and it means some
          plausible advice does not appear here.
        </p>

        <h2>Evidence labels</h2>
        <p>Every guide carries one of four labels:</p>
        <ul>
          <li>
            <strong>Strong</strong> — consistent findings across multiple good-quality
            studies.
          </li>
          <li>
            <strong>Moderate</strong> — reasonable support, with limitations we name in
            the text.
          </li>
          <li>
            <strong>Emerging</strong> — plausible and early. Small studies, or few of
            them.
          </li>
          <li>
            <strong>Contested</strong> — the popular account runs ahead of what the
            research shows.
          </li>
        </ul>
        <p>
          The label describes the evidence, not our confidence in the advice. A
          contested topic is not one we are unsure about; it is usually one where we are
          fairly sure the received wisdom is overstated.
        </p>

        <h2>Review</h2>
        <p>
          Anything labelled strong or moderate requires a named clinical reviewer before
          publication. The build will not accept an article that claims that level of
          evidence without one.
        </p>
        <p>
          We are being explicit about where that currently stands:{' '}
          <strong>no guide on this site has yet been signed off by a clinician.</strong>{' '}
          The review seat exists, the requirement is enforced in the build, and every
          affected guide displays an &ldquo;awaiting clinical review&rdquo; notice until
          a real reviewer signs it. See <Link href="/reviewers">reviewers</Link>.
        </p>

        <h2>Corrections</h2>
        <p>
          When we get something wrong we correct it, note what changed, and update the
          date. We do not quietly edit a claim out of existence.
        </p>
        <p>
          Guides labelled strong or moderate are re-reviewed at least once a year. The
          evidence moves, and an update date has to mean something.
        </p>

        <h2>Funding and independence</h2>
        <p>
          Aromatabs sells its own products and will earn affiliate commission on some
          links. Commercial arrangements never buy coverage, placement, or a conclusion.
          Affiliate links are disclosed inline at first use, not only in the footer.
        </p>
        <p>We do not accept sponsored posts or guest posts.</p>

        <h2>What we refuse to publish</h2>
        <ul>
          <li>Health claims we cannot source.</li>
          <li>Statistics we have not checked against the primary source.</li>
          <li>Product roundups written to rank rather than to help.</li>
          <li>Anything that reads as a diagnosis or a treatment plan.</li>
          <li>Before-and-after testimonials and other unverifiable social proof.</li>
        </ul>

        <h2>Not medical advice</h2>
        <p>
          Everything here is general guidance. It is not a substitute for advice from a
          qualified clinician who knows your history. Every guide that touches a sleep
          disorder carries a section telling you when to see a doctor, and we would
          rather send you to one too early than too late.
        </p>
      </Prose>
    </Section>
  );
}
