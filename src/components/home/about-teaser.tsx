import Link from "next/link";

import { Disc } from "@/components/brand/logo";
import { Arrow } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";

/**
 * A short band rather than a full section — the studio's own story earns a
 * paragraph here and a page of its own, not a third of the home page.
 */
export function AboutTeaser({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { about } = dict.home;

  return (
    <section
      aria-labelledby="about-teaser-heading"
      className="relative overflow-hidden bg-paper py-20 lg:py-28"
    >
      <div className="shell">
        <div className="grid items-start gap-10 border-y border-rule-strong py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
          <div className="lg:col-span-4">
            <div data-reveal>
              <Eyebrow>{about.eyebrow}</Eyebrow>
            </div>
            <Disc className="mt-8 hidden h-12 w-12 text-rule-strong lg:block" />
          </div>

          <div className="lg:col-span-8">
            <h2
              id="about-teaser-heading"
              data-reveal
              className="text-display-md max-w-[20ch]"
            >
              {about.headline}
            </h2>
            <p
              data-reveal
              style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
              className="text-lead mt-6 max-w-[54ch] text-graphite"
            >
              {about.body}
            </p>
            <Link
              href={route(locale, "about")}
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em]"
            >
              <span className="link-underline">{about.link}</span>
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
