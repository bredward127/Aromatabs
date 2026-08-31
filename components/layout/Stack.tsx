import type { ElementType, ReactNode } from 'react';

type StackProps = {
  children: ReactNode;
  /** Steps map onto the token space scale, not arbitrary pixel values. */
  gap?: 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24;
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  as?: ElementType;
  className?: string;
};

const gaps = {
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
  16: 'gap-16',
  24: 'gap-24',
} as const;

const alignments = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
} as const;

const justifications = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const;

export function Stack({
  children,
  gap = 6,
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  as: Tag = 'div',
  className,
}: StackProps) {
  return (
    <Tag
      className={[
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row',
        gaps[gap],
        alignments[align],
        justifications[justify],
        wrap ? 'flex-wrap' : '',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </Tag>
  );
}
