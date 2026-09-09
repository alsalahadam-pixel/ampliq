import Link from "next/link";

import { sortedInsights } from "@/content/insights";
import { InsightCard } from "@/components/insights/insight-card";
import { Arrow } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";

export function InsightsTeaser({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { insights } = dict.home;
  const latest = sortedInsights.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <Section tone="paper-soft" labelledBy="insights-heading">
      <div className="shell">
        <SectionHeader
          id="insights-heading"
          eyebrow={insights.eyebrow}
          headline={insights.headline}
          lead={insights.body}
          action={
            <Link
              href={route(locale, "insights")}
              className="group hidden shrink-0 items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] lg:inline-flex lg:pb-2"
            >
              <span className="link-underline">{dict.cta.allInsights}</span>
              <Arrow />
            </Link>
          }
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-3 lg:gap-8">
          {latest.map((insight, index) => (
            <div
              key={insight.slug}
              data-reveal
              style={{ "--reveal-delay": `${index * 100}ms` } as React.CSSProperties}
            >
              <InsightCard insight={insight} locale={locale} dict={dict} />
            </div>
          ))}
        </div>

        <Link
          href={route(locale, "insights")}
          className="group mt-12 inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] lg:hidden"
        >
          <span className="link-underline">{dict.cta.allInsights}</span>
          <Arrow />
        </Link>
      </div>
    </Section>
  );
}
