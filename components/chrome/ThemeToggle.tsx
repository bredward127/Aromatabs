'use client';

/**
 * The only client component on the site. It cycles system -> light -> dark
 * and writes the choice to the document element; which icon shows is decided
 * in CSS from [data-theme-pref], so this renders identically on server and
 * client and never mismatches on hydration.
 */
const order = ['system', 'light', 'dark'] as const;
type Pref = (typeof order)[number];

export function ThemeToggle({ className }: { className?: string }) {
  function cycle() {
    const el = document.documentElement;
    const current = (el.dataset.themePref ?? 'system') as Pref;
    const index = order.indexOf(current);
    const next = order[(index + 1) % order.length] ?? 'system';

    el.dataset.themePref = next;
    try {
      if (next === 'system') {
        delete el.dataset.theme;
        localStorage.removeItem('at-theme');
      } else {
        el.dataset.theme = next;
        localStorage.setItem('at-theme', next);
      }
    } catch {
      // Private browsing with storage blocked: the choice still applies to
      // this page, it just will not survive a reload.
      if (next === 'system') delete el.dataset.theme;
      else el.dataset.theme = next;
    }
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className={[
        'theme-toggle inline-flex h-10 items-center gap-2 rounded-md px-3',
        'text-sm text-muted transition hover:bg-surface hover:text-content',
        className ?? '',
      ].join(' ')}
    >
      <span className="theme-face theme-face--system items-center gap-2">
        <MonitorIcon />
        <span className="hidden sm:inline">System theme</span>
      </span>
      <span className="theme-face theme-face--light items-center gap-2">
        <SunIcon />
        <span className="hidden sm:inline">Light theme</span>
      </span>
      <span className="theme-face theme-face--dark items-center gap-2">
        <MoonIcon />
        <span className="hidden sm:inline">Dark theme</span>
      </span>
      <span className="sr-only">Change colour theme</span>
    </button>
  );
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function MonitorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}
