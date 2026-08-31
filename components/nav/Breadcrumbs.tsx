import Link from 'next/link';

export type Crumb = { href?: string; label: string };

/**
 * Hub → cluster → article, on every page below the top level. Marked up as an
 * ordered list inside a labelled nav so the trail is announced as a trail.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="rounded-sm underline-offset-4 transition hover:text-content hover:underline"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="text-content">
                  {crumb.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-muted/60">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
