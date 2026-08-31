import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/nav/Breadcrumbs';
import { Prose } from '@/components/layout/Prose';
import { Section } from '@/components/layout/Section';
import { people } from '@/lib/people';

export const metadata: Metadata = {
  title: 'Reviewers',
  description: 'Who writes and who reviews what we publish, and what each role means.',
  alternates: { canonical: '/reviewers' },
};

export default function ReviewersPage() {
  return (
    <Section tone="linen" spacing="default">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Reviewers' }]} />
      <h1 className="font-display text-4xl sm:text-5xl">Reviewers</h1>
      <Prose className="mt-8">
        <p>
          Guides labelled <strong>strong</strong> or <strong>moderate</strong> require a
          named clinical reviewer. That requirement is enforced in the build: an article
          claiming either level without a reviewer will not compile.
        </p>
        <p>
          The honest position today is that the seat is unfilled. Rather than print a
          plausible-looking name, we leave it empty and mark every affected guide with
          an &ldquo;awaiting clinical review&rdquo; notice. Reviewers will be listed
          here with their credentials, and the guides they have signed, before launch.
        </p>
      </Prose>

      <ul className="mt-12 space-y-8">
        {people.map((person) => (
          <li key={person.id} className="border-t border-hairline pt-6">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-display text-2xl">{person.name}</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-link">
                {person.role}
              </span>
              {person.status === 'pending' && (
                <span className="rounded-pill border border-hairline px-3 py-1 text-xs text-muted">
                  Seat unfilled
                </span>
              )}
            </div>
            {person.credentials && (
              <p className="mt-2 text-sm text-content">{person.credentials}</p>
            )}
            <p className="mt-3 max-w-prose text-muted">{person.bio}</p>
          </li>
        ))}
      </ul>

      <p className="mt-12 max-w-prose text-muted">
        Our full process is set out in the{' '}
        <Link
          href="/editorial-standards"
          className="text-link underline underline-offset-4"
        >
          editorial standards
        </Link>
        .
      </p>
    </Section>
  );
}
