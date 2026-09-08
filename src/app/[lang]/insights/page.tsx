import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InsightCard } from "@/components/insights/insight-card";
import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { sortedInsights } from "@/content/insights";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/insights">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = {
    en: {
      title: "Insights",
      description:
        "Practical writing on branding, websites and marketing for companies in Germany — what things cost, what to do first, and what wastes money.",
    },
    de: {
      title: "Insights",
      description:
        "Praktische Texte zu Marke, Website und Marketing für Unternehmen in Deutschland — was Dinge kosten, was zuerst sinnvoll ist und was Budget verbrennt.",
    },
  }[lang];

  return buildMetadata({ locale: lang, path: "/insights", ...copy });
}

export default async function InsightsPage({
  params,
}: PageProps<"/[lang]/insights">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.insights}
        title={dict.insights.title}
        lead={dict.insights.lead}
      />

      <Section tone="paper">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
            {sortedInsights.map((insight, index) => (
              <div
                key={insight.slug}
                data-reveal
                style={{ "--reveal-delay": `${(index % 3) * 90}ms` } as React.CSSProperties}
              >
                <InsightCard insight={insight} locale={lang} dict={dict} />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <FinalCta locale={lang} dict={dict} />

      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: "AMPLIQ", path: "" },
          { name: dict.insights.title, path: "/insights" },
        ])}
      />
    </>
  );
}
