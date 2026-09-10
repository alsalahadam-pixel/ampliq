import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutTeaser } from "@/components/home/about-teaser";
import { Hero } from "@/components/home/hero";
import { InsightsTeaser } from "@/components/home/insights-teaser";
import { Positioning } from "@/components/home/positioning";
import { Principles } from "@/components/home/principles";
import { Problem } from "@/components/home/problem";
import { ServicesSection } from "@/components/home/services-section";
import { SystemSection } from "@/components/home/system";
import { FinalCta } from "@/components/sections/final-cta";
import { PackagesSection } from "@/components/sections/packages-section";
import { ProcessRail } from "@/components/sections/process-rail";
import { getDictionary } from "@/lib/dictionary";
import { isLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = {
    en: {
      title: "AMPLIQ — Marketing & creative agency",
      description:
        "AMPLIQ connects brand, design and marketing into one system: web design, branding, content and growth for companies in Germany.",
    },
    de: {
      title: "AMPLIQ — Marketing- & Kreativagentur",
      description:
        "AMPLIQ verbindet Marke, Design und Marketing zu einem System: Webdesign, Branding, Content und Wachstum für Unternehmen in Deutschland.",
    },
  }[lang];

  return {
    ...buildMetadata({ locale: lang, path: "", ...copy }),
    // The home page owns the site title rather than the "%s — AMPLIQ" template.
    title: { absolute: copy.title },
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <Hero locale={lang} dict={dict} />
      <Positioning dict={dict} />
      <Problem dict={dict} />
      <SystemSection locale={lang} dict={dict} />
      <ServicesSection locale={lang} dict={dict} />
      <PackagesSection locale={lang} dict={dict} />
      <ProcessRail locale={lang} dict={dict} />
      <Principles dict={dict} />
      <AboutTeaser locale={lang} dict={dict} />
      <InsightsTeaser locale={lang} dict={dict} />
      <FinalCta locale={lang} dict={dict} />
    </>
  );
}
