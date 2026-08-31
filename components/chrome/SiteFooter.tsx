import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Lockup } from '@/components/brand/Lockup';
import { RippleField } from '@/components/layout/RippleField';
import { footerLinks, pillars, site } from '@/lib/site';

// Same as the header: prefetch stays off until these routes exist.
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="tone-deep relative overflow-hidden bg-page text-content">
      <RippleField
        origin={{ x: 12, y: 96 }}
        rings={8}
        opacity={0.22}
        className="text-at-brand300"
      />

      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Lockup
              orientation="stacked"
              size={44}
              tagline
              href={null}
              className="!items-start"
            />
            <p className="mt-6 max-w-xs text-sm text-muted">{site.description}</p>
          </div>

          <FooterColumn title="Topics">
            {pillars.map((pillar) => (
              <FooterLink key={pillar.slug} href={`/${pillar.slug}`}>
                {pillar.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="About">
            {footerLinks.about.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Legal">
            {footerLinks.legal.map((link) => (
              <FooterLink key={link.href} href={link.href}>
                {link.label}
              </FooterLink>
            ))}
          </FooterColumn>
        </div>

        <NewsletterSlot />

        <div className="mt-12 border-t border-hairline pt-8">
          <p className="max-w-prose text-sm text-muted">
            Aromatabs publishes guidance, not medical advice. Nothing here diagnoses or
            treats a condition. If your sleep is badly disrupted, or you are worried
            about it, speak to a doctor. Every claim we make is cited, and we say so
            when the evidence is thin.
          </p>
          <p className="mt-6 text-sm text-muted">
            © {year} {site.name}.{' '}
            <Link
              href="/editorial-standards"
              prefetch={false}
              className="text-link underline underline-offset-4"
            >
              How we work
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-link">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        prefetch={false}
        className="rounded-sm text-sm text-muted underline-offset-4 transition hover:text-content hover:underline"
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * A slot, not a form. The real double opt-in flow is built later; shipping a
 * field that silently discards an address would be worse than shipping none.
 */
function NewsletterSlot() {
  return (
    <div className="mt-14 rounded-lg border border-hairline p-6 sm:p-8">
      <h2 className="font-display text-xl">One letter a week</h2>
      <p className="mt-2 max-w-prose text-sm text-muted">
        New guides on sleep, breath and recovery. No pop-ups, no daily mail-outs,
        one-click unsubscribe. Sign-up opens when the first guides publish.
      </p>
    </div>
  );
}
