import { z } from 'zod';
import { clusterPairs, pillarSlugs } from './taxonomy';
import { peopleIds } from './people';

export const evidenceLevels = ['strong', 'moderate', 'emerging', 'contested'] as const;
export type EvidenceLevel = (typeof evidenceLevels)[number];

export const citationSchema = z.object({
  id: z.string().min(1),
  authors: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  title: z.string().min(1),
  journal: z.string().min(1).optional(),
  url: z.string().url(),
  doi: z.string().min(1).optional(),
});

export const faqSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
});

export const frontmatterSchema = z
  .object({
    title: z.string().min(1),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase and hyphenated'),
    pillar: z.enum(pillarSlugs as [string, ...string[]]),
    cluster: z.string().min(1),
    description: z.string().min(1).max(160),
    publishedAt: z.iso.date(),
    updatedAt: z.iso.date(),
    author: z.enum(peopleIds as [string, ...string[]]),
    reviewedBy: z.enum(peopleIds as [string, ...string[]]).optional(),
    reviewedAt: z.iso.date().optional(),
    evidenceLevel: z.enum(evidenceLevels),
    citations: z.array(citationSchema).default([]),
    related: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    hero: z.string().optional(),
    faq: z.array(faqSchema).optional(),
    draft: z.boolean().default(false),
  })
  .superRefine((value, ctx) => {
    // The cluster has to exist on the pillar that claims it.
    if (!clusterPairs.includes(`${value.pillar}/${value.cluster}`)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cluster'],
        message: `"${value.cluster}" is not a cluster of the "${value.pillar}" pillar. Valid: ${clusterPairs
          .filter((pair) => pair.startsWith(`${value.pillar}/`))
          .map((pair) => pair.split('/')[1])
          .join(', ')}`,
      });
    }

    // Anything we present as well-evidenced needs a named reviewer.
    if (
      (value.evidenceLevel === 'strong' || value.evidenceLevel === 'moderate') &&
      !value.reviewedBy
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['reviewedBy'],
        message: `evidenceLevel "${value.evidenceLevel}" requires reviewedBy`,
      });
    }

    if (value.reviewedBy && !value.reviewedAt) {
      ctx.addIssue({
        code: 'custom',
        path: ['reviewedAt'],
        message: 'reviewedBy is set, so reviewedAt is required',
      });
    }

    if (new Date(value.updatedAt) < new Date(value.publishedAt)) {
      ctx.addIssue({
        code: 'custom',
        path: ['updatedAt'],
        message: 'updatedAt cannot be earlier than publishedAt',
      });
    }

    // Duplicate citation ids would silently break footnote round-tripping.
    const ids = value.citations.map((c) => c.id);
    const duplicate = ids.find((id, i) => ids.indexOf(id) !== i);
    if (duplicate) {
      ctx.addIssue({
        code: 'custom',
        path: ['citations'],
        message: `duplicate citation id "${duplicate}"`,
      });
    }
  });

export type Frontmatter = z.infer<typeof frontmatterSchema>;
export type Citation = z.infer<typeof citationSchema>;
export type Faq = z.infer<typeof faqSchema>;
