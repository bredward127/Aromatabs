import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/nav/Breadcrumbs';
import { Prose } from '@/components/layout/Prose';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'About',
  description:
    'What Aromatabs is for, who it is for, and how the commercial side is kept out of the editorial.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <Section tone="linen" spacing="default">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'About' }]} />
      <h1 className="font-display text-4xl sm:text-5xl">About</h1>
      <Prose className="mt-8">
        <p>
          Aromatabs is a reference on rest and relaxation. Sleep, the hours before it,
          breathing, the stress response, recovery, and the room you sleep in.
        </p>
        <p>
          It exists because most writing in this area is either too thin to act on or
          too confident to trust. The research is genuinely interesting and genuinely
          uncertain in places, and treating readers as capable of handling that is the
          whole editorial position.
        </p>

        <h2>Who it is for</h2>
        <p>
          Adults who sleep badly and are tired of being sold to. You have probably
          arrived from a search with one specific question. We would like the answer to
          be good enough that you come back.
        </p>

        <h2>How we work</h2>
        <p>
          Every claim carries a citation, and every citation links to the source. Where
          the evidence is thin we label it and say so in the text. Where the popular
          account has run ahead of the research — and in this field it often has — we
          say that too.
        </p>
        <p>
          Each guide carries an evidence label, the date it was last updated, and who
          wrote it. The full process is set out in our{' '}
          <Link href="/editorial-standards">editorial standards</Link>.
        </p>

        <h2>The commercial side</h2>
        <p>
          Aromatabs sells aromatherapy tabs, and some links on this site will eventually
          earn a commission. That layer sits underneath the editorial and never on top
          of it: no product appears in a guide unless it is genuinely relevant,
          disclosure appears inline at first use rather than only in the footer, and
          nothing we sell changes what the research says.
        </p>
        <p>
          If we ever have to choose between a guide being accurate and a guide being
          commercially useful, the guide stays accurate.
        </p>

        <h2>What we do not do</h2>
        <p>
          We do not give medical advice, diagnose anything, or tell you what to take.
          Where the right answer is a doctor, we say so and stop.
        </p>
      </Prose>
    </Section>
  );
}
