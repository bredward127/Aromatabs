import Link from 'next/link';
import type { MDXComponents } from 'mdx/types';

function headingId(children: React.ReactNode): string {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * The MDX surface. Deliberately small for now - the editorial components
 * (callouts, key takeaways, evidence modules) arrive with the article template.
 * Footnote references resolve to the reference list rendered below the body.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ children }) => (
    <h2 id={headingId(children)} className="mb-3 mt-12 scroll-mt-24 text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 id={headingId(children)} className="mb-2 mt-9 scroll-mt-24 text-2xl">
      {children}
    </h3>
  ),
  a: ({ href, children }) => {
    const url = href ?? '#';
    // Footnote markers render as small superscript links into the references.
    if (url.startsWith('#user-content-fn-') || url.startsWith('#fn-')) {
      return (
        <sup>
          <a href={url} className="text-link no-underline">
            {children}
          </a>
        </sup>
      );
    }
    if (url.startsWith('/')) {
      return (
        <Link href={url} className="text-link underline underline-offset-4">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-link underline underline-offset-4"
      >
        {children}
      </a>
    );
  },
};
