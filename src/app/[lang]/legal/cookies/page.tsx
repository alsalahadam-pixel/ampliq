import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage, legalMetadata } from "@/components/legal/legal-page";
import { cookieChapters } from "@/content/legal";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal/cookies">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);
  return legalMetadata({
    lang,
    path: "/legal/cookies",
    title: dict.legal.cookiesTitle,
    description: dict.legal.cookiesLead,
  });
}

export default async function Page({ params }: PageProps<"/[lang]/legal/cookies">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <LegalPage
      lang={lang}
      title={dict.legal.cookiesTitle}
      lead={dict.legal.cookiesLead}
      chapters={cookieChapters(lang)}
    />
  );
}
