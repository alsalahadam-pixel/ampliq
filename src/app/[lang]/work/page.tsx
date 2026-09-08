import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { Arrow } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProjectCard, ProjectMedia } from "@/components/work/project-card";
import { pillars } from "@/content/pillars";
import { projects } from "@/content/projects";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { route, workHref } from "@/lib/routes";
import { pad } from "@/lib/utils";

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
        "Selected projects from AMPLIQ — website design and development, described as what the work actually was, with no invented results.",
    },
    de: {
      title: "Arbeiten",
      description:
        "Ausgewählte Projekte von AMPLIQ — Webdesign und Entwicklung, beschrieben wie die Arbeit tatsächlich war, ohne erfundene Ergebnisse.",
    },
  }[lang];

  return buildMetadata({ locale: lang, path: "/work", ...copy });
}

/**
 * How the portfolio is presented. States the editorial rules of this page
 * rather than padding it out with placeholder projects — a short portfolio
 * presented deliberately reads better than a long one presented dishonestly.
 */
const editorial = {
  en: {
    eyebrow: "Editorial standard",
    title: "How we present work here",
    items: [
      {
        title: "Scope, not spin",
        body: "Each case study describes the work that was actually carried out, in the words we would use in a scoping call.",
      },
      {
        title: "No borrowed numbers",
        body: "Where performance data hasn't been measured and confirmed with the client, the page says so instead of estimating.",
      },
      {
        title: "Concepts are labelled",
        body: "Self-initiated studies are marked as concepts everywhere they appear, so nothing implies a client relationship that doesn't exist.",
      },
    ],
  },
  de: {
    eyebrow: "Redaktioneller Maßstab",
    title: "Wie wir Arbeiten hier darstellen",
    items: [
      {
        title: "Umfang statt Inszenierung",
        body: "Jede Case Study beschreibt die tatsächlich geleistete Arbeit — in denselben Worten, die wir im Scoping-Gespräch verwenden.",
      },
      {
        title: "Keine geliehenen Zahlen",
        body: "Wo Ergebnisse nicht gemessen und mit dem Kunden abgestimmt sind, steht das dort — statt einer Schätzung.",
      },
      {
        title: "Konzepte sind gekennzeichnet",
        body: "Eigeninitiierte Studien sind überall als Konzept markiert. Nichts suggeriert eine Kundenbeziehung, die es nicht gibt.",
      },
    ],
  },
};

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const [featured, ...rest] = projects;
  const copy = editorial[lang];

  return (
    <>
      <PageHero eyebrow={dict.nav.work} title={dict.work.title} lead={dict.work.lead} />

      {/* Featured project as an editorial spread rather than a full-bleed panel. */}
      {featured ? (
        <Section tone="paper" labelledBy="featured-heading">
          <div className="shell">
            <article className="group grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <ProjectMedia
                  project={featured}
                  locale={lang}
                  label={dict.work.imagePlaceholder}
                  src={featured.gallery[0]?.src}
                  alt={featured.gallery[0]?.alt[lang]}
                  priority
                  className="aspect-[4/3]"
                />
              </div>

              <div className="flex flex-col justify-between lg:col-span-5 lg:py-2">
                <div>
                  <p className="eyebrow text-accent">{featured.category[lang]}</p>
                  <h2 id="featured-heading" className="text-display-md mt-5">
                    <Link href={workHref(lang, featured.slug)} className="link-underline">
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="text-lead mt-5 max-w-[44ch] text-graphite">
                    {featured.summary[lang]}
                  </p>

                  <dl className="mt-8 border-t border-rule">
                    <div className="flex gap-6 border-b border-rule py-3.5">
                      <dt className="w-28 shrink-0 text-sm text-graphite">
                        {dict.work.metaRole}
                      </dt>
                      <dd className="text-sm text-ink">{featured.role[lang]}</dd>
                    </div>
                    <div className="flex gap-6 border-b border-rule py-3.5">
                      <dt className="w-28 shrink-0 text-sm text-graphite">
                        {dict.work.metaScope}
                      </dt>
                      <dd className="text-sm text-ink">
                        {featured.scope[lang].join(" · ")}
                      </dd>
                    </div>
                  </dl>
                </div>

                <Link
                  href={workHref(lang, featured.slug)}
                  className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em]"
                >
                  <span className="link-underline">{dict.cta.readMore}</span>
                  <Arrow />
                </Link>
              </div>
            </article>

            {rest.length > 0 ? (
              <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-8">
                {rest.map((project) => (
                  <div key={project.slug} data-reveal>
                    <ProjectCard project={project} locale={lang} dict={dict} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* The editorial rules of this page — substance in place of filler. */}
      <Section tone="ink" labelledBy="editorial-heading">
        <div className="shell">
          <SectionHeader
            id="editorial-heading"
            eyebrow={copy.eyebrow}
            headline={copy.title}
            lead={dict.home.work.openBody}
            tone="dark"
          />
          <ul className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-3 lg:gap-8">
            {copy.items.map((item, index) => (
              <li
                key={item.title}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
                className="border-t border-white/15 pt-6"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent-soft">
                  {pad(index + 1)}
                </span>
                <h3 className="font-display mt-4 text-[1.25rem] font-bold tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-fog">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* What a project can cover, so the page still answers "can you do X?". */}
      <Section tone="paper-soft" labelledBy="capabilities-heading">
        <div className="shell">
          <SectionHeader
            id="capabilities-heading"
            eyebrow={dict.home.services.eyebrow}
            headline={dict.home.services.headline}
            action={
              <Link
                href={route(lang, "services")}
                className="group hidden shrink-0 items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em] lg:inline-flex lg:pb-2"
              >
                <span className="link-underline">{dict.cta.allServices}</span>
                <Arrow />
              </Link>
            }
          />
          <div className="mt-12 grid gap-10 border-t border-rule-strong pt-10 lg:grid-cols-3 lg:gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.key} data-reveal>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent">
                    {pad(pillar.index)}
                  </span>
                  <h3 className="font-display text-lg font-bold tracking-[-0.03em] uppercase">
                    {pillar.label}
                  </h3>
                </div>
                <ul className="mt-5">
                  {pillar.disciplines[lang].map((discipline) => (
                    <li
                      key={discipline}
                      className="border-t border-rule py-2.5 text-[0.9375rem] text-graphite last:border-b"
                    >
                      {discipline}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
