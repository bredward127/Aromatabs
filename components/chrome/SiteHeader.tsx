import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Lockup } from '@/components/brand/Lockup';
import { pillars } from '@/lib/site';
import { ThemeToggle } from './ThemeToggle';

// Prefetch is off on the topic links: their routes arrive with the content
// model, and until then every page load would fire six 404s. Turn it back on
// (delete the prop) once /[pillar] exists.
export function SiteHeader() {
  return (
    <header className="border-b border-hairline bg-page">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Lockup size={34} />

          <nav aria-label="Topics" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {pillars.map((pillar) => (
                <li key={pillar.slug}>
                  <Link
                    href={`/${pillar.slug}`}
                    prefetch={false}
                    className="rounded-sm text-sm text-muted underline-offset-8 transition hover:text-content hover:underline"
                  >
                    {pillar.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <SearchStub />
            <ThemeToggle />
          </div>
        </div>

        {/* Below the large breakpoint the topics wrap onto their own row
            rather than collapsing behind a menu button, which would need
            client JavaScript for six links. */}
        <nav
          aria-label="Topics"
          className="nav-scroller -mx-1 overflow-x-auto pb-3 lg:hidden"
        >
          <ul className="flex items-center gap-1">
            {pillars.map((pillar) => (
              <li key={pillar.slug}>
                <Link
                  href={`/${pillar.slug}`}
                  prefetch={false}
                  className="inline-block whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-content"
                >
                  {pillar.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

/**
 * Search arrives with the content model. Until then this is present and
 * focusable but honest about doing nothing - marked aria-disabled rather
 * than `disabled`, so keyboard users can still find it and hear why.
 */
function SearchStub() {
  return (
    <button
      type="button"
      aria-disabled="true"
      className="inline-flex h-10 cursor-not-allowed items-center gap-2 rounded-md px-3 text-sm text-muted"
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="hidden sm:inline">Search</span>
      <span className="sr-only">Search — not available yet</span>
    </button>
  );
}
