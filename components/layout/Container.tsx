import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  /** `prose` is the 68ch reading measure; `narrow` suits forms and notes. */
  width?: 'default' | 'narrow' | 'prose';
  className?: string;
};

const widths = {
  default: 'max-w-container',
  narrow: 'max-w-narrow',
  prose: 'max-w-prose',
} as const;

export function Container({ children, width = 'default', className }: ContainerProps) {
  return (
    <div
      className={['mx-auto w-full px-6 sm:px-8', widths[width], className ?? ''].join(
        ' ',
      )}
    >
      {children}
    </div>
  );
}
