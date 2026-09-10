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
 * The section is published: a visitor can always read what AMPLIQ does with
 * their data, what the terms are and how to withdraw. Values that have not
 * been supplied are left out by the renderer rather than shown as gaps, so the
 * documents read as finished at every stage of being filled in.
 *
 * Both halves still honour `legalIsPublished`, which only
 * `NEXT_PUBLIC_LEGAL_PUBLISHED="false"` turns off — a way to take the section
 * down in one move if it is ever needed, and a no-op otherwise.
 *
 * The pages are `noindex`: legally required disclosures rather than content
 * anyone should reach through search.
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
