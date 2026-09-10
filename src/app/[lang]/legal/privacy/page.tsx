import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import { privacyChapters } from "@/content/legal";
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
}: PageProps<"/[lang]/legal/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);
  return legalMetadata({
    lang,
    path: "/legal/privacy",
    title: dict.legal.privacyTitle,
    description: dict.legal.privacyLead,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/legal/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang) || !legalIsPublished) notFound();

  const dict = getDictionary(lang);

  return (
    <LegalPage
      lang={lang}
      title={dict.legal.privacyTitle}
      lead={dict.legal.privacyLead}
      chapters={privacyChapters(lang)}
    />
  );
}
