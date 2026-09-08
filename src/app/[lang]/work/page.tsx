import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/work/project-card";
import { projects } from "@/content/projects";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = {
    en: {
      title: "Work",
      description:
        "Selected projects from AMPLIQ — website design and development work, described as what it actually was.",
    },
    de: {
      title: "Arbeiten",
      description:
        "Ausgewählte Projekte von AMPLIQ — Webdesign und Entwicklung, beschrieben so, wie die Arbeit tatsächlich war.",
    },
  }[lang];

  return buildMetadata({ locale: lang, path: "/work", ...copy });
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <PageHero eyebrow={dict.nav.work} title={dict.work.title} lead={dict.work.lead} />

      <Section tone="paper">
        <div className="shell">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-20">
            {projects.map((project, index) => (
              <div
                key={project.slug}
                data-reveal
                style={{ "--reveal-delay": `${(index % 2) * 90}ms` } as React.CSSProperties}
                className={index === 0 ? "lg:col-span-2" : ""}
              >
                <ProjectCard
                  project={project}
                  locale={lang}
                  dict={dict}
                  featured={index === 0}
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Honest about the size of the portfolio rather than padding it out. */}
          <div
            data-reveal
            className="mt-20 border-t border-rule-strong pt-10 lg:mt-28"
          >
            <h2 className="font-display text-display-sm max-w-[20ch]">
              {dict.home.work.openTitle}
            </h2>
            <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-graphite">
              {dict.home.work.openBody}
            </p>
          </div>
        </div>
      </Section>

      <FinalCta locale={lang} dict={dict} />

      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: "AMPLIQ", path: "" },
          { name: dict.work.title, path: "/work" },
        ])}
      />
    </>
  );
}
