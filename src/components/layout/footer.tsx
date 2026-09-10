import Link from "next/link";

import { Disc } from "@/components/brand/logo";
import { Logo } from "@/components/brand/logo";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { href, route } from "@/lib/routes";
import { activeSocials, contact, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const nav = [
    { label: dict.nav.services, href: route(locale, "services") },
    { label: dict.nav.packages, href: route(locale, "packages") },
    { label: dict.nav.about, href: route(locale, "about") },
    { label: dict.nav.insights, href: route(locale, "insights") },
    { label: dict.cta.start, href: route(locale, "start"), emphasis: true },
    { label: dict.nav.contact, href: route(locale, "contact") },
  ];

  const legal = [
    { label: dict.legal.imprintTitle, href: route(locale, "imprint") },
    { label: dict.legal.privacyTitle, href: route(locale, "privacy") },
    { label: dict.legal.termsTitle, href: route(locale, "terms") },
    { label: dict.legal.cancellationTitle, href: route(locale, "cancellation") },
    { label: dict.legal.cookiesTitle, href: route(locale, "cookies") },
  ];

  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-paper">
      <div className="shell relative py-16 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link
              href={href(locale)}
              className="-my-2 inline-block py-2 transition-opacity duration-200 hover:opacity-70"
              aria-label="AMPLIQ — home"
            >
              <Logo className="text-[1.375rem]" />
            </Link>
            <p className="text-display-sm mt-6 max-w-[14ch] text-paper/90">
              {dict.footer.tagline}
            </p>
            <p className="mt-8 max-w-[34ch] text-sm leading-relaxed text-fog">
              {dict.footer.builtNote}
            </p>
          </div>

          <nav className="lg:col-span-3" aria-label={dict.footer.navTitle}>
            <h2 className="eyebrow text-fog">{dict.footer.navTitle}</h2>
            {/* No gap between the rows: each link carries its own vertical
                padding instead, so the tappable areas meet rather than leaving
                dead space between them on a phone. */}
            <ul className="mt-5 flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      "link-underline inline-block py-1.5 text-[0.9375rem] transition-colors duration-200 hover:text-paper",
                      item.emphasis ? "text-paper" : "text-paper/80",
                    )}
                  >
                    {item.label}
                    {item.emphasis ? (
                      <span aria-hidden="true" className="ml-1.5 text-accent-soft">
                        →
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="eyebrow text-fog">{dict.footer.contactTitle}</h2>
            {/* The general address leads; the specialised two follow, smaller,
                for people who already know which one they want. */}
            <ul className="mt-6 flex flex-col gap-4">
              <li>
                <a
                  href={`mailto:${contact.info}`}
                  className="link-underline inline-block text-[0.9375rem] break-all text-paper transition-colors duration-200 hover:text-accent-soft"
                >
                  {contact.info}
                </a>
              </li>
              <li>
                <span className="block text-xs text-fog">
                  {dict.footer.projectLabel}
                </span>
                <a
                  href={`mailto:${contact.project}`}
                  className="link-underline mt-1 inline-block text-[0.875rem] break-all text-paper/70 transition-colors duration-200 hover:text-paper"
                >
                  {contact.project}
                </a>
              </li>
              <li>
                <span className="block text-xs text-fog">
                  {dict.footer.helpLabel}
                </span>
                <a
                  href={`mailto:${contact.help}`}
                  className="link-underline mt-1 inline-block text-[0.875rem] break-all text-paper/70 transition-colors duration-200 hover:text-paper"
                >
                  {contact.help}
                </a>
              </li>
              {site.phone ? (
                <li>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="link-underline text-[0.9375rem] text-paper/80 transition-colors duration-200 hover:text-paper"
                  >
                    {site.phone}
                  </a>
                </li>
              ) : null}
            </ul>

            {activeSocials.length > 0 ? (
              <>
                <h2 className="eyebrow mt-10 text-fog">{dict.footer.socialTitle}</h2>
                <ul className="mt-6 flex flex-col gap-3">
                  {activeSocials.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        rel="noopener noreferrer me"
                        target="_blank"
                        className="link-underline text-[0.9375rem] text-paper/80 transition-colors duration-200 hover:text-paper"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>

          <nav className="lg:col-span-2" aria-label={dict.footer.legalTitle}>
            <h2 className="eyebrow text-fog">{dict.footer.legalTitle}</h2>
            <ul className="mt-5 flex flex-col">
              {legal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="link-underline inline-block py-1.5 text-[0.9375rem] text-paper/80 transition-colors duration-200 hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fine tracking-[0.02em] text-fog">
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <Disc className="h-7 w-7 text-paper/30" />
        </div>
      </div>
    </footer>
  );
}
