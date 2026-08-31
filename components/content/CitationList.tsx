import type { Citation } from '@/lib/content-schema';

/**
 * Full bibliographic detail with a working link on every entry. The article
 * template that renders footnote round-trips properly comes later; this is the
 * reference list itself, which no article should ship without.
 */
export function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <section
      aria-labelledby="references"
      className="mt-16 border-t border-hairline pt-8"
    >
      <h2 id="references" className="font-display text-2xl">
        References
      </h2>
      <ol className="mt-6 space-y-5">
        {citations.map((citation, index) => (
          <li
            key={citation.id}
            id={`ref-${citation.id}`}
            className="text-sm text-muted"
          >
            <span className="mr-2 font-semibold text-content">{index + 1}.</span>
            {citation.authors} ({citation.year}).{' '}
            <a
              href={citation.url}
              rel="noopener noreferrer"
              target="_blank"
              className="text-link underline underline-offset-4"
            >
              {citation.title}
            </a>
            {citation.journal ? (
              <>
                . <em>{citation.journal}</em>
              </>
            ) : null}
            .{citation.doi ? <span className="ml-1">doi:{citation.doi}</span> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
