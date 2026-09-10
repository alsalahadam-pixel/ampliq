import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { Arrow } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { LEGAL_UPDATED } from "@/content/legal";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { legalIsPublished } from "@/lib/legal";
import { route, type RouteKey } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  // Nothing is prerendered while the section is unpublished; the page's own
  // guard answers 404 for anything that reaches it.
  return legalIsPublished ? locales.map((lang) => ({ lang })) : [];
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    path: "/legal",
    title: dict.legal.indexTitle,
    description: dict.legal.indexLead,
    noIndex: true,
  });
}

export default async function LegalIndexPage({
  params,
}: PageProps<"/[lang]/legal">) {
  const { lang } = await params;
  if (!isLocale(lang) || !legalIsPublished) notFound();

  const dict = getDictionary(lang);

  const documents: { key: RouteKey; title: string; lead: string }[] = [
    { key: "imprint", title: dict.legal.imprintTitle, lead: dict.legal.imprintLead },
    { key: "privacy", title: dict.legal.privacyTitle, lead: dict.legal.privacyLead },
    { key: "terms", title: dict.legal.termsTitle, lead: dict.legal.termsLead },
    {
      key: "cancellation",
      title: dict.legal.cancellationTitle,
      lead: dict.legal.cancellationLead,
    },
    { key: "cookies", title: dict.legal.cookiesTitle, lead: dict.legal.cookiesLead },
  ];

  return (
    <>
      <PageHero
        size="compact"
        eyebrow={dict.legal.indexTitle}
        title={dict.legal.indexTitle}
        lead={dict.legal.indexLead}
      />

      <Section tone="paper">
        <div className="shell">
          <ul className="border-t border-rule">
            {documents.map((document, index) => (
              <li key={document.key} data-reveal>
                <Link
                  href={route(lang, document.key)}
                  className="group flex flex-col gap-3 border-b border-rule py-8 transition-colors duration-300 hover:bg-paper-soft sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-accent sm:w-12 sm:shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1">
                    <span className="font-display flex items-center gap-3 text-[1.375rem] leading-tight font-bold tracking-[-0.03em]">
                      {document.title}
                      <Arrow className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </span>
                    <span className="mt-2 block max-w-[60ch] text-[0.9375rem] leading-relaxed text-graphite">
                      {document.lead}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs text-graphite">
            {dict.legal.lastUpdated}:{" "}
            <time dateTime={LEGAL_UPDATED}>{LEGAL_UPDATED}</time>
          </p>
        </div>
      </Section>
    </>
  );
}
