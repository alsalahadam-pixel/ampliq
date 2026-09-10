import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalDocument, type LegalChapter } from "@/components/legal/legal-document";
import { PageHero } from "@/components/layout/page-hero";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/i18n";
import { LEGAL_UPDATED } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

/**
 * Shared shell for every legal document.
 *
 * All five pages are `noindex`: they are legally required disclosures, not
 * content anyone should reach through search, and keeping them out of the
 * index saves crawl budget for the pages that do sell.
 */
export function legalMetadata({
  lang,
  path,
  title,
  description,
}: {
  lang: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  if (!isLocale(lang)) return {};
  return buildMetadata({ locale: lang, path, title, description, noIndex: true });
}

export function LegalPage({
  lang,
  title,
  lead,
  chapters,
  before,
}: {
  lang: Locale;
  title: string;
  lead: string;
  chapters: LegalChapter[];
  before?: React.ReactNode;
}) {
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageHero size="compact" eyebrow={dict.legal.indexTitle} title={title} lead={lead} />
      <LegalDocument
        chapters={chapters}
        dict={dict}
        updated={LEGAL_UPDATED}
        before={before}
      />
    </>
  );
}
