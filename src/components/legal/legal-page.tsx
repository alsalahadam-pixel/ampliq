import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalDocument, type LegalChapter } from "@/components/legal/legal-document";
import { PageHero } from "@/components/layout/page-hero";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/i18n";
import { legalIsPublished } from "@/lib/legal";
import { LEGAL_UPDATED } from "@/content/legal";
import { buildMetadata } from "@/lib/seo";

/**
 * Shared shell for every legal document.
 *
 * Both halves are gated on `legalIsPublished`. While the section is
 * unpublished the routes answer 404 like any address that does not exist —
 * no explanation page, nothing that hints there is something here waiting to
 * be finished. The pages themselves stay in the repository, complete, and
 * come back the moment the entity details are supplied.
 *
 * Once published they are `noindex`: legally required disclosures rather than
 * content anyone should reach through search.
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
  if (!isLocale(lang) || !legalIsPublished) return {};
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
  if (!isLocale(lang) || !legalIsPublished) notFound();
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
