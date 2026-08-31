type RippleFieldProps = {
  /**
   * Where the rings radiate from, as a percentage of the box. The origin
   * normally sits off-canvas or near an edge so only the arcs are seen.
   */
  origin?: { x: number; y: number };
  rings?: number;
  opacity?: number;
  /** Radius of the innermost ring and the gap between rings, in % of the box. */
  start?: number;
  step?: number;
  /** Rings fade as they travel outward, the way real ones do. */
  fade?: boolean;
  className?: string;
};

/**
 * The house background texture: oversized concentric echoes of the mark.
 * Pure SVG, no JS, aria-hidden. Never placed behind body copy.
 */
export function RippleField({
  origin = { x: 84, y: 52 },
  rings = 9,
  opacity = 0.16,
  start = 10,
  step = 8.5,
  fade = true,
  className,
}: RippleFieldProps) {
  const circles = Array.from({ length: rings }, (_, i) => {
    const r = start + i * step;
    const o = fade ? opacity * (1 - i / (rings + 2)) : opacity;
    return { r, o, key: i };
  });

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={[
        'pointer-events-none absolute inset-0 h-full w-full',
        className ?? '',
      ].join(' ')}
    >
      {circles.map(({ r, o, key }) => (
        <circle
          key={key}
          cx={origin.x}
          cy={origin.y}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.22}
          opacity={o.toFixed(3)}
        />
      ))}
    </svg>
  );
}
