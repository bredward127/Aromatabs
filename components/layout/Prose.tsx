import type { ReactNode } from 'react';

type ProseProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The reading column: 68ch, generous leading, serif headings, sans body.
 * Styled with plain descendant selectors rather than a typography plugin so
 * the rules stay legible and the tokens stay the single source of truth.
 */
export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={[
        'measure',
        '[&_p]:my-5 [&_p]:text-content',
        '[&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:text-3xl',
        '[&_h3]:mb-2 [&_h3]:mt-9 [&_h3]:text-2xl',
        '[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6',
        '[&_li]:my-2',
        '[&_a]:text-link [&_a]:underline [&_a]:underline-offset-4',
        '[&_a:hover]:decoration-2',
        '[&_strong]:font-semibold',
        '[&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-hairline',
        '[&_blockquote]:pl-6 [&_blockquote]:font-display [&_blockquote]:text-xl',
        '[&_hr]:my-12 [&_hr]:border-hairline',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  );
}
