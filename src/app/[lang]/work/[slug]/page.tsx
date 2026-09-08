import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { Rule, Section } from "@/components/ui/section";
import { ProjectCard, ProjectMedia } from "@/components/work/project-card";
import { projectBySlug, projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { getDictionary } from "@/lib/dictionary";
import { type Locale, isLocale, locales } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    projects.map((project) => ({ lang, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = projectBySlug[slug];
  if (!isLocale(lang) || !project) return {};

  return buildMetadata({
    locale: lang,
    path: `/work/${slug}`,
    title: project.seo.title[lang],
    description: project.seo.description[lang],
  });
}

/** A titled block of paragraphs — the repeating unit of a case study. */
function Chapter({
  index,
  title,
  paragraphs,
}: {
  index: string;
  title: string;
  paragraphs: string[];
}) {
  return (
    <div
      data-reveal
      className="grid gap-6 border-t border-rule py-10 lg:grid-cols-12 lg:gap-10 lg:py-14"
    >
      <div className="flex items-baseline gap-4 lg:col-span-4">
        <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent">
          {index}
        </span>
        <h2 className="font-display text-[1.5rem] leading-tight font-bold tracking-[-0.03em] lg:text-[1.75rem]">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-5 lg:col-span-8">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lead max-w-[60ch] text-graphite">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function MetaRow({ project, locale, dict }: { project: Project; locale: Locale; dict: ReturnType<typeof getDictionary> }) {
  const items = [
    { label: dict.work.metaClient, value: project.client },
    { label: dict.work.metaCategory, value: project.category[locale] },
    { label: dict.work.metaRole, value: project.role[locale] },
    ...(project.year ? [{ label: dict.work.metaYear, value: project.year }] : []),
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="eyebrow text-fog">{item.label}</dt>
          <dd className="mt-2 text-[0.9375rem] text-paper">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const project = projectBySlug[slug];
  if (!project) notFound();

  const dict = getDictionary(lang);
  const related = projects.filter((entry) => entry.slug !== project.slug).slice(0, 2);

  return (
    <>
      <PageHero
        breadcrumb={{ label: dict.cta.backToWork, href: `/${lang}/work` }}
        title={project.title}
        lead={project.summary[lang]}
        meta={<MetaRow project={project} locale={lang} dict={dict} />}
        size="large"
      />

      {project.status === "concept" ? (
        <div className="bg-accent-wash">
          <div className="shell py-4">
            <p className="text-sm text-ink">
              <span className="font-mono text-[0.625rem] tracking-[0.16em] uppercase">
                {dict.common.concept}
              </span>{" "}
              — {dict.work.conceptNotice}
            </p>
          </div>
        </div>
      ) : null}

      {/* Lead visual. */}
      <Section tone="paper" bleed className="pt-12 lg:pt-16">
        <div className="shell">
          <div data-reveal>
            <ProjectMedia
              project={project}
              locale={lang}
              label={dict.work.imagePlaceholder}
              src={project.gallery[0]?.src}
              alt={project.gallery[0]?.alt[lang]}
              priority
              className="aspect-[16/9]"
            />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="shell">
          <Chapter index="01" title={dict.work.challenge} paragraphs={project.brief[lang]} />
          <Chapter index="02" title={dict.work.approach} paragraphs={project.approach[lang]} />
          <Chapter index="03" title={dict.work.creative} paragraphs={project.creative[lang]} />
          <Chapter index="04" title={dict.work.execution} paragraphs={project.execution[lang]} />
        </div>
      </Section>

      {/* Gallery. Slots stay labelled until real imagery is added. */}
      {project.gallery.length > 1 ? (
        <Section tone="paper-soft" labelledBy="gallery-heading">
          <div className="shell">
            <h2 id="gallery-heading" className="eyebrow text-graphite">
              {dict.work.gallery}
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {project.gallery.slice(1).map((item, index) => (
                <div
                  key={item.alt.en}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
                  className={cn(item.wide && "lg:col-span-2")}
                >
                  <ProjectMedia
                    project={project}
                    locale={lang}
                    label={dict.work.imagePlaceholder}
                    src={item.src}
                    alt={item.alt[lang]}
                    tone={index % 2 === 0 ? "light" : "dark"}
                    className="aspect-[4/3]"
                  />
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section tone="ink" labelledBy="delivered-heading">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2
                id="delivered-heading"
                data-reveal
                className="text-display-md max-w-[14ch]"
              >
                {dict.work.delivered}
              </h2>
              <p
                data-reveal
                className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-fog"
              >
                {dict.work.resultsPending}
              </p>
            </div>

            <div className="lg:col-span-7">
              <ul data-reveal className="border-t border-white/15">
                {project.delivered[lang].map((item) => (
                  <li
                    key={item}
                    className="border-b border-white/15 py-4 text-[1.0625rem] tracking-[-0.01em] text-paper/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="eyebrow mt-12 text-fog">{dict.work.learnings}</h3>
              <div className="mt-5 flex flex-col gap-4">
                {project.learnings[lang].map((item) => (
                  <p key={item} className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-fog">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="paper" labelledBy="related-heading">
          <div className="shell">
            <h2 id="related-heading" className="eyebrow text-graphite">
              {dict.work.related}
            </h2>
            <Rule className="mt-4" />
            <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-8">
              {related.map((entry) => (
                <div key={entry.slug} data-reveal>
                  <ProjectCard project={entry} locale={lang} dict={dict} />
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <FinalCta locale={lang} dict={dict} />

      <JsonLd
        data={[
          breadcrumbSchema(lang, [
            { name: "AMPLIQ", path: "" },
            { name: dict.work.title, path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.summary[lang],
            url: `${siteUrl}/${lang}/work/${project.slug}`,
            creator: { "@id": `${siteUrl}/#organization` },
          },
        ]}
      />
    </>
  );
}
