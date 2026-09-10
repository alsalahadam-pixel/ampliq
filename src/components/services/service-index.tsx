import Link from "next/link";

import { pillars } from "@/content/pillars";
import { services } from "@/content/services";
import { Arrow } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { serviceHref } from "@/lib/routes";
import { pad } from "@/lib/utils";

/**
 * The service catalogue as an index rather than a grid of cards: disciplines
 * grouped under their layer, each one a full-width row that reveals its
 * one-liner on hover. Reads like a contents page, scales to any number of
 * services, and stays legible on a phone.
 */
export function ServiceIndex({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      {pillars.map((pillar) => {
        const entries = services.filter((service) => service.pillar === pillar.key);

        return (
          <section key={pillar.key} aria-labelledby={`services-${pillar.key}`}>
            <div className="flex items-baseline gap-4 border-b border-rule pb-4">
              <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent">
                {pad(pillar.index)}
              </span>
              <h3
                id={`services-${pillar.key}`}
                className="font-display text-xl font-bold tracking-[-0.03em] uppercase"
              >
                {pillar.label}
              </h3>
              <span className="ml-auto hidden text-sm text-graphite sm:block">
                {pillar.title[locale]}
              </span>
            </div>

            <ul>
              {entries.map((service, index) => (
                <li
                  key={service.slug}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 60}ms` } as React.CSSProperties}
                >
                  <Link
                    href={serviceHref(locale, service.slug)}
                    className="group relative flex flex-col gap-1.5 border-b border-rule py-6 transition-colors duration-300 hover:border-ink sm:flex-row sm:items-center sm:justify-between sm:gap-10"
                  >
                    {/* The accent rule draws in from the left on hover — the row
                        reacts as one object rather than as a hovered link. */}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-[-1px] left-0 h-px w-0 bg-accent transition-[width] duration-500 ease-out-expo group-hover:w-full"
                    />
                    <span className="font-display text-[1.375rem] leading-tight font-bold tracking-[-0.03em] transition-transform duration-500 ease-out-expo sm:text-[1.75rem] sm:group-hover:translate-x-3">
                      {service.title[locale]}
                    </span>
                    <span className="flex items-center gap-6 sm:shrink-0">
                      <span className="text-[0.9375rem] text-graphite transition-colors duration-300 group-hover:text-ink">
                        {service.tagline[locale]}
                      </span>
                      <Arrow className="hidden text-graphite transition-colors duration-300 group-hover:text-ink sm:block" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
