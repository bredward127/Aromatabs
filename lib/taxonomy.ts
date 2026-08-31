/**
 * The site's spine. Pillars and clusters are structure, not content, so they
 * live in typed config rather than on disk - which lets zod reject an article
 * that claims a cluster its pillar does not have.
 */

export type ClusterDefinition = {
  slug: string;
  name: string;
  /** One line for cluster cards and hub sections. */
  blurb: string;
};

export type PillarDefinition = {
  slug: string;
  name: string;
  blurb: string;
  /** What the hub covers, written for someone who knows nothing. */
  orientation: string[];
  /** Said plainly, so readers do not go looking for what is not here. */
  outOfScope: string;
  /** The two pillars a reader most often needs next. */
  neighbours: readonly string[];
  clusters: readonly ClusterDefinition[];
};

export const pillars = [
  {
    slug: 'sleep',
    name: 'Sleep',
    blurb: 'Architecture, timing, chronotype, and what goes wrong.',
    orientation: [
      'Sleep is not one state. It is a structured sequence your brain runs several times a night, and most of what people call \u201cbad sleep\u201d is a problem with the structure, the timing, or the pressure behind it rather than the number of hours.',
      'This pillar covers how a night is built, what governs when you get sleepy, how much of your timing is fixed, and the point at which disrupted sleep stops being a habit problem and starts being a clinical one.',
    ],
    outOfScope:
      'We do not diagnose sleep disorders, review prescription medicines, or tell you what to take. Where a symptom needs a clinician, we say so and stop.',
    neighbours: ['wind-down', 'environment'],
    clusters: [
      {
        slug: 'how-sleep-works',
        name: 'How sleep works',
        blurb:
          'The architecture of a night, and the two systems that decide when it starts.',
      },
      {
        slug: 'timing-and-chronotype',
        name: 'Timing and chronotype',
        blurb:
          'When your body wants to sleep, how much of that you can move, and what debt really means.',
      },
    ],
  },
  {
    slug: 'wind-down',
    name: 'Wind-down',
    blurb: 'The ninety-minute runway from alert to asleep.',
    orientation: [
      'Falling asleep is a handover, not a switch. The body needs a run-up to make it: core temperature has to start falling, arousal has to come down, and the day has to be given an ending.',
      'This pillar is about that run-up — what has to happen physiologically, what light and screens actually do to it, and how to build an evening you will still be doing in a month.',
    ],
    outOfScope:
      'This is not a list of sleep-hygiene rules to follow perfectly. Where a habit has thin evidence behind it, we say that instead of repeating it.',
    neighbours: ['sleep', 'stress'],
    clusters: [
      {
        slug: 'the-runway',
        name: 'The runway',
        blurb: 'What the last ninety minutes are for, and how to use them.',
      },
      {
        slug: 'light-and-screens',
        name: 'Light and screens',
        blurb: 'What evening light does, and how much of the screen panic holds up.',
      },
    ],
  },
  {
    slug: 'breath',
    name: 'Breath',
    blurb: 'Paced breathing, the physiology, and which techniques hold up.',
    orientation: [
      'Breathing is the one autonomic function you can drive deliberately, which is why slowing it is the fastest lever most people have on their own arousal.',
      'This pillar covers the mechanism — why a long exhale changes your heart rate, what heart rate variability is and is not — and then the specific techniques, with an honest account of how good the evidence is for each.',
    ],
    outOfScope:
      'Breathwork is not a treatment for anxiety disorders, asthma, or sleep apnoea. Intense or breath-holding practices are outside what we cover.',
    neighbours: ['stress', 'wind-down'],
    clusters: [
      {
        slug: 'physiology',
        name: 'Physiology',
        blurb: 'What slow breathing does to the nervous system, and how we know.',
      },
      {
        slug: 'techniques',
        name: 'Techniques',
        blurb:
          'The specific patterns, what each is for, and how well they are supported.',
      },
    ],
  },
  {
    slug: 'stress',
    name: 'Stress',
    blurb: 'The stress response, recovery, and nervous-system basics.',
    orientation: [
      'The stress response is not the problem. It is fast, useful, and designed to end. The trouble starts when it does not end — when the thinking outlasts the event and the body stays braced for something that already happened.',
      'This pillar covers what the response actually is, why it persists, what it costs, and what recovery requires beyond doing less.',
    ],
    outOfScope:
      'We do not treat anxiety, depression or trauma, and we do not offer therapy. Where the answer is a clinician, we point you there.',
    neighbours: ['breath', 'rest'],
    clusters: [
      {
        slug: 'the-stress-response',
        name: 'The stress response',
        blurb: 'What fires, what it costs, and why it outlives the stressor.',
      },
      {
        slug: 'recovery',
        name: 'Recovery',
        blurb:
          'What actually brings the system back down, and what only looks like it does.',
      },
    ],
  },
  {
    slug: 'environment',
    name: 'Environment',
    blurb: 'Light, temperature, sound, air, scent, the bedroom.',
    orientation: [
      'The room you sleep in is doing something to your sleep whether you have thought about it or not. Temperature, light, noise and air quality all have measurable effects, and they are among the few variables you can change tonight.',
      'This pillar covers what the evidence supports for each, in rough order of how much difference it makes.',
    ],
    outOfScope:
      'We do not review mattresses, and we do not publish product roundups dressed as research. Where we recommend a piece of kit, the disclosure is on the same screen.',
    neighbours: ['sleep', 'wind-down'],
    clusters: [
      {
        slug: 'temperature-and-air',
        name: 'Temperature and air',
        blurb:
          'The strongest environmental lever, and the one most people get backwards.',
      },
      {
        slug: 'sound-and-light',
        name: 'Sound and light',
        blurb: 'Noise, masking, blackout, and the light at both ends of the night.',
      },
    ],
  },
  {
    slug: 'rest',
    name: 'Rest',
    blurb: "Rest that isn't sleep: naps, stillness, time off, burnout.",
    orientation: [
      'Sleep is one kind of rest. It is not the only one, and treating it as the only one is how people end up sleeping badly and resting less.',
      'This pillar covers napping as a dosed intervention with real trade-offs, the forms of rest that are not sleep at all, and the point where exhaustion stops being tiredness and becomes something a weekend cannot fix.',
    ],
    outOfScope:
      'Burnout is an occupational phenomenon, not a medical diagnosis, and we treat it as one. We do not offer clinical assessment.',
    neighbours: ['stress', 'sleep'],
    clusters: [
      {
        slug: 'naps',
        name: 'Naps',
        blurb: 'Dose, timing, and what a nap costs you later.',
      },
      {
        slug: 'beyond-sleep',
        name: 'Beyond sleep',
        blurb: 'Rest that is not sleep, and the exhaustion that rest does not fix.',
      },
    ],
  },
] as const satisfies readonly PillarDefinition[];

export type PillarSlug = (typeof pillars)[number]['slug'];

export const pillarSlugs = pillars.map((p) => p.slug) as PillarSlug[];

export function findPillar(slug: string): PillarDefinition | undefined {
  return pillars.find((p) => p.slug === slug);
}

export function findCluster(
  pillarSlug: string,
  clusterSlug: string,
): ClusterDefinition | undefined {
  return findPillar(pillarSlug)?.clusters.find((c) => c.slug === clusterSlug);
}

/** Every valid "pillar/cluster" pair, used by the frontmatter validator. */
export const clusterPairs = pillars.flatMap((p) =>
  p.clusters.map((c) => `${p.slug}/${c.slug}`),
);
