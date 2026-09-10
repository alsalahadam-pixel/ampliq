import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import { imprintChapters } from "@/content/legal";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { legalIsPublished } from "@/lib/legal";

export function generateStaticParams() {
  // Nothing is prerendered while the section is unpublished; the page's own
  // guard answers 404 for anything that reaches it.
  return legalIsPublished ? locales.map((lang) => ({ lang })) : [];
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal/imprint">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);
  return legalMetadata({
    lang,
    path: "/legal/imprint",
    title: dict.legal.imprintTitle,
    description: dict.legal.imprintLead,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/legal/imprint">) {
  const { lang } = await params;
  if (!isLocale(lang) || !legalIsPublished) notFound();

  const dict = getDictionary(lang);

  return (
    <LegalPage
      lang={lang}
      title={dict.legal.imprintTitle}
      lead={dict.legal.imprintLead}
      chapters={imprintChapters(lang)}
    />
  );
}
