import { DROP, RIPPLES, STROKE } from './mark-geometry';

type MarkProps = {
  /** Rendered size in pixels. The mark holds up from 16px upward. */
  size?: number;
  /** `tab` draws the filled squircle; `glyph` is the drop and ripples alone. */
  variant?: 'tab' | 'glyph';
  className?: string;
};

/**
 * A tab dissolving into still water: one drop above three spreading ripples.
 * Colours come from --mark-tab / --mark-ink, which the theme and the section
 * tone both set, so the mark inverts on dark grounds without a second file.
 */
export function Mark({ size = 40, variant = 'tab', className }: MarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {variant === 'tab' && <use href="#at-squircle" fill="var(--mark-tab)" />}
      <g
        fill={variant === 'tab' ? 'var(--mark-ink)' : 'currentColor'}
        stroke={variant === 'tab' ? 'var(--mark-ink)' : 'currentColor'}
      >
        <circle cx={DROP.cx} cy={DROP.cy} r={DROP.r} stroke="none" />
        {RIPPLES.map((ripple) => (
          <path
            key={ripple.d}
            d={ripple.d}
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        ))}
      </g>
    </svg>
  );
}
