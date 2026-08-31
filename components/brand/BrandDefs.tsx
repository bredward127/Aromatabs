import { SQUIRCLE } from './mark-geometry';

/**
 * Rendered once per document. Holds the mark's gradients and its silhouette
 * so every <Mark> on the page can reference them instead of repeating a
 * four-kilobyte path. Referenced by url(#...) from CSS custom properties.
 */
export function BrandDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      className="absolute"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <linearGradient id="at-tab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--at-brand)" />
          <stop offset="1" stopColor="var(--at-deep)" />
        </linearGradient>
        <linearGradient id="at-tab-reverse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--at-cloud)" />
          <stop offset="1" stopColor="var(--at-mist)" />
        </linearGradient>
        <path id="at-squircle" d={SQUIRCLE} />
      </defs>
    </svg>
  );
}
