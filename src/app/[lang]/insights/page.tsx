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
  const [featured, ...rest] = sortedInsights;

  return (
    <>
      <PageHero
        eyebrow={dict.nav.insights}
        title={dict.insights.title}
        lead={dict.insights.lead}
      />

      <Section tone="paper" labelledBy="insights-list">
        <div className="shell">
          {/* The hero carries the h1; the list still needs a heading of its own
              so the outline does not jump straight to the card titles. */}
          <h2 id="insights-list" className="sr-only">
            {dict.insights.title}
          </h2>

          {/* The most recent piece leads at full width, the rest sit beside it.
              With a small, deliberately un-padded archive this reads as an
              edited page rather than a grid waiting to be filled. */}
          {featured ? (
            // The card draws its own rule; the wrapper only carries the reveal.
            <div data-reveal>
              <InsightCard
                insight={featured}
                locale={lang}
                dict={dict}
                featured
              />
            </div>
          ) : null}

          {rest.length > 0 ? (
            <div
              data-reveal-stagger
              className="mt-16 grid gap-12 sm:grid-cols-2 lg:mt-20 lg:gap-8"
            >
              {rest.map((insight) => (
                <div key={insight.slug}>
                  <InsightCard insight={insight} locale={lang} dict={dict} />
                </div>
              ))}
            </div>
          ) : null}
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
