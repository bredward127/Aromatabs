import type { EvidenceLevel } from '@/lib/content-schema';

const copy: Record<EvidenceLevel, { label: string; meaning: string }> = {
  strong: {
    label: 'Strong evidence',
    meaning: 'Consistent findings across multiple good-quality studies.',
  },
  moderate: {
    label: 'Moderate evidence',
    meaning: 'Reasonable support, with real limitations we name in the text.',
  },
  emerging: {
    label: 'Emerging evidence',
    meaning: 'Plausible and early. Small studies, or few of them.',
  },
  contested: {
    label: 'Contested',
    meaning: 'The popular account runs ahead of what the research shows.',
  },
};

/**
 * Colour is never the only signal - the level is always spelled out in words.
 */
export function EvidenceBadge({ level }: { level: EvidenceLevel }) {
  const { label, meaning } = copy[level];
  return (
    <span
      className="inline-flex items-center gap-2 rounded-pill border border-hairline px-3 py-1 text-xs font-semibold text-content"
      title={meaning}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-pill bg-accent" />
      {label}
    </span>
  );
}
