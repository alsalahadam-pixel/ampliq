import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InsightCard, formatDate } from "@/components/insights/insight-card";
import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { insightBySlug, insights, sortedInsights } from "@/content/insights";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { route } from "@/lib/routes";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    insights.map((insight) => ({ lang, slug: insight.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/insights/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const insight = insightBySlug[slug];
  if (!isLocale(lang) || !insight) return {};

  return buildMetadata({
    locale: lang,
    path: `/insights/${slug}`,
    title: insight.seo.title[lang],
    description: insight.seo.description[lang],
    type: "article",
    publishedTime: insight.publishedAt,
  });
}

/** Stable id for the in-article contents links. */
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

export default async function InsightPage({
  params,
}: PageProps<"/[lang]/insights/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const insight = insightBySlug[slug];
  if (!insight) notFound();

  const dict = getDictionary(lang);
  const related = sortedInsights.filter((entry) => entry.slug !== slug).slice(0, 2);
  const headings = insight.sections.map((section) => ({
    id: slugify(section.heading.en),
    label: section.heading[lang],
  }));

  return (
    <>
      <PageHero
        breadcrumb={{ label: dict.cta.backToInsights, href: route(lang, "insights") }}
        title={insight.title[lang]}
        meta={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.6875rem] tracking-[0.16em] text-fog uppercase">
            <span className="text-accent-soft">{insight.category[lang]}</span>
            <span aria-hidden="true">/</span>
            <time dateTime={insight.publishedAt}>
              {formatDate(insight.publishedAt, lang)}
            </time>
            <span aria-hidden="true">/</span>
            <span>
              {insight.readingMinutes} {dict.insights.readingTime}
            </span>
          </div>
        }
      />

      <Section tone="paper">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Contents rail. */}
            <aside className="lg:col-span-3">
              <nav
                aria-labelledby="toc-heading"
                className="lg:sticky lg:top-28"
              >
                <h2 id="toc-heading" className="eyebrow text-graphite">
                  {dict.insights.tableOfContents}
                </h2>
                <ol className="mt-5 flex flex-col gap-3 border-t border-rule pt-5">
                  {headings.map((heading, index) => (
                    <li key={heading.id} className="flex gap-3">
                      <span className="font-mono text-[0.625rem] tracking-[0.14em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <a
                        href={`#${heading.id}`}
                        className="link-underline -my-3 inline-block py-3 text-sm leading-snug text-graphite transition-colors duration-200 hover:text-ink"
                      >
                        {heading.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="lg:col-span-8 lg:col-start-5">
              <div className="flex flex-col gap-6">
                {insight.intro[lang].map((paragraph) => (
                  <p
                    key={paragraph}
                    data-reveal
                    className="text-lead max-w-[64ch] text-ink"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {insight.sections.map((section, index) => (
                <section key={headings[index].id} className="mt-14">
                  <h2
                    id={headings[index].id}
                    className="font-display max-w-[24ch] scroll-mt-28 text-[1.625rem] leading-tight font-bold tracking-[-0.03em] sm:text-[2rem]"
                  >
                    {section.heading[lang]}
                  </h2>

                  <div className="mt-6 flex flex-col gap-5">
                    {section.paragraphs[lang].map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-[64ch] text-[1.0625rem] leading-[1.7] text-graphite"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.bullets ? (
                    <ul className="mt-7 border-t border-rule">
                      {section.bullets[lang].map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-4 border-b border-rule py-3.5 text-[1.0625rem] leading-relaxed text-ink"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.6em] h-[5px] w-[5px] shrink-0 rounded-full bg-accent"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              {/* Closing note doubles as the article's call to action. */}
              <div className="mt-16 border-t border-ink pt-8">
                <p className="text-lead max-w-[60ch] text-ink">{insight.closing[lang]}</p>
                <div className="mt-8 border border-rule bg-paper-soft p-8">
                  <h2 className="font-display text-[1.375rem] font-bold tracking-[-0.03em]">
                    {dict.insights.ctaTitle}
                  </h2>
                  <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-graphite">
                    {dict.insights.ctaBody}
                  </p>
                  <Link
                    href={route(lang, "start")}
                    className="mt-6 inline-flex h-13 items-center justify-center rounded-[2px] bg-ink px-6 text-[0.9375rem] font-medium text-paper transition-colors duration-300 hover:bg-accent"
                  >
                    {dict.cta.start}
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="paper-soft" labelledBy="more-articles-heading">
          <div className="shell">
            <h2 id="more-articles-heading" className="eyebrow text-graphite">
              {dict.insights.moreArticles}
            </h2>
            <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-8">
              {related.map((entry) => (
                <div key={entry.slug} data-reveal>
                  <InsightCard insight={entry} locale={lang} dict={dict} />
                </div>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <FinalCta locale={lang} dict={dict} />

      <JsonLd
        data={[
          articleSchema({
            locale: lang,
            title: insight.title[lang],
            description: insight.excerpt[lang],
            path: `/insights/${insight.slug}`,
            publishedAt: insight.publishedAt,
          }),
          breadcrumbSchema(lang, [
            { name: "AMPLIQ", path: "" },
            { name: dict.insights.title, path: "/insights" },
            { name: insight.title[lang], path: `/insights/${insight.slug}` },
          ]),
        ]}
      />
    </>
  );
}
