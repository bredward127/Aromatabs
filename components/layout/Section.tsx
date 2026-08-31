import type { ReactNode } from 'react';
import { Container } from './Container';

export type Tone = 'linen' | 'cloud' | 'deep' | 'brand';

type SectionProps = {
  children: ReactNode;
  /** Sets the ground and remaps the foreground tokens for everything inside. */
  tone?: Tone;
  spacing?: 'tight' | 'default' | 'loose' | 'none';
  width?: 'default' | 'narrow' | 'prose' | 'full';
  as?: 'section' | 'div' | 'header' | 'footer' | 'article' | 'aside';
  className?: string;
  id?: string;
};

const tones: Record<Tone, string> = {
  linen: 'tone-linen',
  cloud: 'tone-cloud',
  deep: 'tone-deep',
  brand: 'tone-brand',
};

const spacings = {
  none: '',
  tight: 'py-10 sm:py-14',
  default: 'py-16 sm:py-24',
  loose: 'py-24 sm:py-36',
} as const;

export function Section({
  children,
  tone = 'linen',
  spacing = 'default',
  width = 'default',
  as: Tag = 'section',
  className,
  id,
}: SectionProps) {
  const inner =
    width === 'full' ? children : <Container width={width}>{children}</Container>;
  return (
    <Tag
      id={id}
      className={[
        tones[tone],
        'relative bg-page text-content',
        spacings[spacing],
        className ?? '',
      ].join(' ')}
    >
      {inner}
    </Tag>
  );
}
