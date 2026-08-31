'use client';

/**
 * Only fires when the root layout itself fails, so it has to render its own
 * <html> and cannot rely on any of the app's styles being present.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#F3EEE4',
          color: '#0F1E1C',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ maxWidth: '32rem' }}>
          <h1
            style={{
              fontFamily: 'ui-serif, Georgia, serif',
              fontSize: '2rem',
              margin: 0,
            }}
          >
            Aromatabs is temporarily unavailable
          </h1>
          <p style={{ marginTop: '1rem', lineHeight: 1.6 }}>
            Something failed before the page could be built. Reloading usually fixes it.
          </p>
          {error.digest && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              padding: '0.7rem 1.25rem',
              borderRadius: '0.5rem',
              border: 0,
              background: '#2E7D6F',
              color: '#FDFBF7',
              font: 'inherit',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
