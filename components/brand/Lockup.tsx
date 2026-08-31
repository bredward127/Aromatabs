import Link from 'next/link';
import { site } from '@/lib/site';
import { Mark } from './Mark';

type LockupProps = {
  orientation?: 'horizontal' | 'stacked';
  /** Mark height in pixels. Everything else is proportioned from it. */
  size?: number;
  tagline?: boolean;
  /** Stacked lockups centre by default; the footer wants them ranged left. */
  align?: 'center' | 'start';
  /** Wrap in a link home. Off for the footer, where home is already linked. */
  href?: string | null;
  className?: string;
};

/**
 * The wordmark is live text in the display face at the brand's tracking
 * rather than an image, so it stays crisp, selectable and translatable.
 * Ratios follow build/build_logos.py.
 */
export function Lockup({
  orientation = 'horizontal',
  size = 40,
  tagline = false,
  align = 'center',
  href = '/',
  className,
}: LockupProps) {
  const stacked = orientation === 'stacked';
  const cross =
    align === 'start' ? 'items-start text-left' : 'items-center text-center';
  const wordSize = size * 0.8;
  const tagSize = Math.max(9, size * 0.15);

  const inner = (
    <span
      className={[
        'inline-flex',
        stacked ? `flex-col gap-3 ${cross}` : 'flex-row items-center',
        className ?? '',
      ].join(' ')}
      style={stacked ? undefined : { gap: size * 0.3 }}
    >
      <Mark size={stacked ? size * 1.5 : size} />
      <span className={stacked ? `flex flex-col ${cross}` : 'flex flex-col'}>
        <span
          className="font-display font-semibold leading-none text-content"
          style={{ fontSize: wordSize, letterSpacing: '0.008em' }}
        >
          {site.wordmark}
        </span>
        {tagline && (
          <span
            className="font-body font-semibold uppercase leading-none text-link"
            style={{
              fontSize: tagSize,
              letterSpacing: '0.19em',
              marginTop: size * 0.14,
            }}
          >
            {site.tagline}
          </span>
        )}
      </span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link
      href={href}
      className="inline-flex rounded-sm"
      aria-label={`${site.name} — home`}
    >
      {inner}
    </Link>
  );
}
