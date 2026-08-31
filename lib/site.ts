export const site = {
  name: 'Aromatabs',
  wordmark: 'aromatabs',
  tagline: 'The art & science of rest',
  descriptor: 'Everything rest & relaxation',
  url: 'https://aromatabs.com',
  description:
    'Long-form, evidence-led guides to sleep, wind-down, breath, stress, ' +
    'recovery and the environment you rest in.',
} as const;

export type Pillar = {
  slug: string;
  name: string;
  /** One line, plain, for nav and hub headers. */
  blurb: string;
};

/** The six pillars. Their hub routes arrive with the content model. */
export const pillars: readonly Pillar[] = [
  {
    slug: 'sleep',
    name: 'Sleep',
    blurb: 'Architecture, timing, chronotype, and what goes wrong.',
  },
  {
    slug: 'wind-down',
    name: 'Wind-down',
    blurb: 'The ninety-minute runway from alert to asleep.',
  },
  {
    slug: 'breath',
    name: 'Breath',
    blurb: 'Paced breathing, the physiology, and which techniques hold up.',
  },
  {
    slug: 'stress',
    name: 'Stress',
    blurb: 'The stress response, recovery, and nervous-system basics.',
  },
  {
    slug: 'environment',
    name: 'Environment',
    blurb: 'Light, temperature, sound, air, scent, the bedroom.',
  },
  {
    slug: 'rest',
    name: 'Rest',
    blurb: "Rest that isn't sleep: naps, stillness, time off, burnout.",
  },
] as const;

export const footerLinks = {
  about: [
    { href: '/about', label: 'About' },
    { href: '/editorial-standards', label: 'Editorial standards' },
    { href: '/reviewers', label: 'Reviewers' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
    { href: '/affiliate-disclosure', label: 'Affiliate disclosure' },
    { href: '/medical-disclaimer', label: 'Medical disclaimer' },
  ],
} as const;
