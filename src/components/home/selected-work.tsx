import Link from "next/link";

import { DiscArc } from "@/components/brand/disc-field";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/work/project-card";
import { Arrow } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import type { Dictionary } from "@/lib/dictionary";
import type { Locale } from "@/lib/i18n";
import { route } from "@/lib/routes";

export function SelectedWork({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { work } = dict.home;
  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <Section tone="paper" labelledBy="work-heading">
      <div className="shell">
        <SectionHeader
          id="work-heading"
          eyebrow={work.eyebrow}
          headline={work.headline}
          lead={work.body}
          action={
            <Link
              href={route(locale, "work")}
              className="group hidden shrink-0 items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] lg:inline-flex lg:pb-2"
            >
              <span className="link-underline">{dict.cta.allWork}</span>
              <Arrow />
            </Link>
          }
        />

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          {featured ? (
            <div data-reveal className="lg:col-span-8">
              <ProjectCard
                project={featured}
                locale={locale}
                dict={dict}
                featured
                priority
              />
            </div>
          ) : null}

          {/* Honest counterpart to a short portfolio: an invitation, not filler. */}
          <aside
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="flex flex-col justify-between gap-8 border border-rule bg-paper-soft p-8 lg:col-span-4"
          >
            <div>
              <DiscArc className="h-8 w-full text-rule-strong" strokeWidth={1} />
              <h3 className="font-display mt-8 text-2xl font-bold tracking-[-0.03em]">
                {work.openTitle}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-graphite">
                {work.openBody}
              </p>
            </div>
            <Link
              href={route(locale, "contact")}
              className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em]"
            >
              <span className="link-underline">{dict.cta.start}</span>
              <Arrow />
            </Link>
          </aside>

          {rest.map((project, index) => (
            <div
              key={project.slug}
              data-reveal
              style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
              className="lg:col-span-6"
            >
              <ProjectCard project={project} locale={locale} dict={dict} />
            </div>
          ))}
        </div>

        <Link
          href={route(locale, "work")}
          className="group mt-12 inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] lg:hidden"
        >
          <span className="link-underline">{dict.cta.allWork}</span>
          <Arrow />
        </Link>
      </div>
    </Section>
  );
}
