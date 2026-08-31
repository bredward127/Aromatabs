'use client';

import { useEffect } from 'react';

/**
 * Route-level error boundary. Next requires this to be a client component -
 * it has to attach to a React error boundary and offer a retry.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Reporting is wired up with the rest of the observability work.
    console.error(error);
  }, [error]);

  return (
    <section className="tone-linen bg-page py-24 text-content sm:py-36">
      <div className="mx-auto w-full max-w-container px-6 sm:px-8">
        <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Something went wrong
        </p>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl">
          This page didn&rsquo;t load
        </h1>
        <p className="mt-6 max-w-prose text-muted">
          The fault is ours, not yours. Try again — and if it keeps happening, the
          problem is on our side and we would like to hear about it.
        </p>
        {error.digest && (
          <p className="mt-3 text-sm text-muted">
            Reference: <code>{error.digest}</code>
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex h-11 items-center rounded-md bg-at-brand px-5 text-sm font-semibold text-at-cloud transition hover:bg-at-brand600"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
