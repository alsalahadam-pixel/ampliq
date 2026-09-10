import Link from "next/link";

import { pillars } from "@/content/pillars";
import { Section, SectionHeader } from "@/components/ui/section";
import { Arrow } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route, serviceHref } from "@/lib/routes";
import { pad } from "@/lib/utils";

/**
 * The signature section: three pillars presented as one connected system.
 *
 * The connection is drawn rather than implied — a hairline runs through all
 * three columns with a node at each pillar, echoing the DISC's centre dot. On
 * small screens the same line runs vertically down the left edge.
 */
export function SystemSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { system } = dict.home;

  return (
    <Section tone="ink" labelledBy="system-heading">
      <div className="shell">
        <SectionHeader
          id="system-heading"
          eyebrow={system.eyebrow}
          headline={system.headline}
          lead={system.body}
          tone="dark"
        />

        <div className="relative mt-16 lg:mt-24">
          {/* Horizontal connector (desktop). Draws itself in with the section,
              so the three layers visibly become one system rather than
              arriving as three finished columns. */}
          <span
            aria-hidden="true"
            data-reveal="rule"
            className="absolute top-[7px] right-0 left-0 hidden h-px origin-left bg-white/12 lg:block"
          />
          {/* Vertical connector (mobile / tablet). */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[7px] w-px bg-white/12 lg:hidden"
          />

          <ol className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            {pillars.map((pillar, index) => (
              <li
                key={pillar.key}
                data-reveal
                style={{ "--reveal-delay": `${index * 110}ms` } as React.CSSProperties}
                className="relative pl-9 lg:pt-9 lg:pl-0"
              >
                {/* Node on the connector line. */}
                <span
                  aria-hidden="true"
                  className="absolute top-1 left-0 block h-[15px] w-[15px] rounded-full border border-white/25 bg-ink lg:top-0 lg:left-0"
                >
                  <span className="absolute inset-[3px] rounded-full bg-accent-soft" />
                </span>

                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-fog">
                    {pad(pillar.index)}
                  </span>
                  <h3 className="font-display text-display-sm tracking-[-0.03em] uppercase">
                    {pillar.label}
                  </h3>
                </div>

                <p className="mt-4 font-display text-lg font-semibold tracking-[-0.02em] text-paper/90">
                  {pillar.title[locale]}
                </p>
                <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-fog">
                  {pillar.body[locale]}
                </p>

                {/* Each discipline with a page is a link, so the system can
                    actually be walked. The rest stay as text rather than
                    linking to something that does not exist. */}
                <ul className="mt-7 flex flex-col">
                  {pillar.disciplines.map((discipline) => (
                    <li
                      key={discipline.label.en}
                      className="border-t border-white/10 last:border-b"
                    >
                      {discipline.slug ? (
                        <Link
                          href={serviceHref(locale, discipline.slug)}
                          className="group/item flex items-center justify-between gap-3 py-2.5 text-sm text-paper/75 transition-colors duration-300 hover:text-paper"
                        >
                          <span className="link-underline">
                            {discipline.label[locale]}
                          </span>
                          <Arrow className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                        </Link>
                      ) : (
                        <span className="block py-2.5 text-sm text-paper/75">
                          {discipline.label[locale]}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div
          data-reveal
          className="mt-14 flex flex-col gap-5 border-t border-white/12 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-[48ch] text-[0.9375rem] text-fog">{system.note}</p>
          <Link
            href={route(locale, "services")}
            className="group inline-flex shrink-0 items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] text-paper"
          >
            <span className="link-underline">{dict.cta.allServices}</span>
            <Arrow />
          </Link>
        </div>
      </div>
    </Section>
  );
}
