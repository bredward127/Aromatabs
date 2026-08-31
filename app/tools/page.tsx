import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/nav/Breadcrumbs';
import { Prose } from '@/components/layout/Prose';
import { Section } from '@/components/layout/Section';

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'Interactive guides for wind-down, breathing, sleep need and the bedroom.',
  alternates: { canonical: '/tools' },
};

const planned = [
  {
    name: 'Wind-down planner',
    description:
      'Your wake time and how long you take to fall asleep, turned into a timed ninety-minute runway.',
  },
  {
    name: 'Breathing pacer',
    description:
      'A visual guide for coherent breathing, box breathing, 4-7-8 and the physiological sigh.',
  },
  {
    name: 'Sleep-need estimator',
    description:
      'Age band and last week’s sleep, with a plain reading of what it means and what it cannot tell you.',
  },
  {
    name: 'Bedroom audit',
    description:
      'A scored checklist across light, temperature, sound, air and bedding, with a prioritised fix list.',
  },
];

export default function ToolsPage() {
  return (
    <Section tone="linen" spacing="default">
      <Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Tools' }]} />
      <h1 className="font-display text-4xl sm:text-5xl">Tools</h1>
      <Prose className="mt-8">
        <p>
          Each of these will state its assumptions and its limits on screen, cite what
          it is based on, and work without an account or an email address.
        </p>
        <p>
          None of them is built yet. This page lists what is coming, and nothing more.
        </p>
      </Prose>

      <ul className="mt-10 divide-y divide-hairline border-t border-hairline">
        {planned.map((tool) => (
          <li key={tool.name} className="py-6">
            <h2 className="font-display text-xl">{tool.name}</h2>
            <p className="mt-2 max-w-prose text-muted">{tool.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
