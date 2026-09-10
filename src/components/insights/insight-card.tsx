import Link from "next/link";

import type { Insight } from "@/content/types";
import { Arrow } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionary";
import { type Locale, localeTags } from "@/lib/i18n";
import { insightHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeTags[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function InsightCard({
  insight,
  locale,
  dict,
  className,
  /** The lead item on the index: wider type, excerpt beside the title. */
  featured = false,
}: {
  insight: Insight;
  locale: Locale;
  dict: Dictionary;
  className?: string;
  featured?: boolean;
}) {
  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={insightHref(locale, insight.slug)}
        className="relative flex h-full flex-col border-t border-ink pt-6 transition-colors duration-300"
      >
        {/* The top rule turns accent and thickens fractionally on hover — the
            card's own hairline doing the work, rather than a shadow. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -top-px h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-600 ease-out-expo group-hover:scale-x-100"
        />
        <div className="flex items-center gap-3 font-mono text-[0.625rem] tracking-[0.16em] text-graphite uppercase">
          <span className="text-accent">{insight.category[locale]}</span>
          <span aria-hidden="true" className="h-[3px] w-[3px] rounded-full bg-rule-strong" />
          <span>
            {insight.readingMinutes} {dict.insights.readingTime}
          </span>
        </div>

        <div
          className={cn(
            featured &&
              "mt-6 grid gap-6 lg:grid-cols-12 lg:items-baseline lg:gap-16",
          )}
        >
          <h3
            className={cn(
              "font-display leading-[1.15] font-bold tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent",
              featured
                ? "text-display-md max-w-[18ch] lg:col-span-7"
                : "mt-5 text-[1.375rem]",
            )}
          >
            {insight.title[locale]}
          </h3>

          <p
            className={cn(
              "leading-relaxed text-graphite",
              featured
                ? "max-w-[52ch] text-lead lg:col-span-5"
                : "mt-4 text-[0.9375rem]",
            )}
          >
            {insight.excerpt[locale]}
          </p>
        </div>

        <div className="mt-6 flex flex-1 items-end">
          <span className="inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em]">
            <span className="link-underline">{dict.cta.readMore}</span>
            <Arrow />
          </span>
        </div>
      </Link>
    </article>
  );
}
