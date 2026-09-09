import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { Arrow, ButtonLink } from "@/components/ui/button";
import { FaqList } from "@/components/ui/faq";
import { Section } from "@/components/ui/section";
import { pillarByKey } from "@/content/pillars";
import { serviceBySlug, services } from "@/content/services";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  serviceSchema,
} from "@/lib/seo";
import { route, serviceHref } from "@/lib/routes";
import { pad } from "@/lib/utils";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    services.map((service) => ({ lang, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const service = serviceBySlug[slug];
  if (!isLocale(lang) || !service) return {};

  return buildMetadata({
    locale: lang,
    path: `/services/${slug}`,
    title: service.seo.title[lang],
    description: service.seo.description[lang],
  });
}

export default async function ServicePage({
  params,
}: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const service = serviceBySlug[slug];
  if (!service) notFound();

  const dict = getDictionary(lang);
  const pillar = pillarByKey[service.pillar];
  const related = service.related
    .map((entry) => serviceBySlug[entry])
    .filter(Boolean);

  const faqs = service.faqs.map((faq) => ({
    question: faq.question[lang],
    answer: faq.answer[lang],
  }));

  return (
    <>
      <PageHero
        breadcrumb={{ label: dict.services.title, href: route(lang, "services") }}
        title={service.title[lang]}
        lead={service.summary[lang]}
        actions={
          <>
            <ButtonLink href={route(lang, "start")} tone="dark">
              {dict.cta.start}
            </ButtonLink>
            <ButtonLink
              href={route(lang, "contact")}
              variant="outline"
              tone="dark"
            >
              {dict.cta.enquiry}
            </ButtonLink>
          </>
        }
        meta={
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="eyebrow text-fog">{dict.services.pillarLabel}</span>
            <span className="font-display text-lg font-bold tracking-[-0.02em] uppercase">
              {pad(pillar.index)} — {pillar.label}
            </span>
            <span className="text-sm text-fog">{pillar.title[lang]}</span>
          </div>
        }
      />

      {/* Problem / approach, side by side. A bridge between the hero and the
          detail below, so it carries less vertical space than a full section. */}
      <Section tone="paper" bleed className="py-16 sm:py-20 lg:py-24">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div data-reveal>
              <h2 className="eyebrow text-graphite">{dict.services.problemTitle}</h2>
              <p className="text-display-sm mt-6 max-w-[26ch]">
                {service.tagline[lang]}
              </p>
              <p className="text-lead mt-6 max-w-[52ch] text-graphite">
                {service.problem[lang]}
              </p>
            </div>
            <div
              data-reveal
              style={{ "--reveal-delay": "90ms" } as React.CSSProperties}
              className="border-t border-rule pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16"
            >
              <h2 className="eyebrow text-graphite">{dict.services.solutionTitle}</h2>
              <p className="text-lead mt-6 max-w-[52ch] text-ink">
                {service.solution[lang]}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Deliverables + process. */}
      <Section tone="ink" labelledBy="deliverables-heading">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 id="deliverables-heading" data-reveal className="text-display-md max-w-[14ch]">
                {dict.services.deliverablesTitle}
              </h2>
              <ul data-reveal className="mt-8 border-t border-white/15">
                {service.deliverables[lang].map((item) => (
                  <li
                    key={item}
                    className="border-b border-white/15 py-4 text-[1.0625rem] tracking-[-0.01em] text-paper/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 lg:pl-8">
              <h2 className="eyebrow text-fog">{dict.services.processTitle}</h2>
              <ol className="mt-8 grid gap-8 sm:grid-cols-2">
                {service.process.map((step, index) => (
                  <li
                    key={step.title.en}
                    data-reveal
                    style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
                    className="border-t border-white/15 pt-5"
                  >
                    <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent-soft">
                      {pad(index + 1)}
                    </span>
                    <h3 className="font-display mt-3 text-lg font-bold tracking-[-0.02em]">
                      {step.title[lang]}
                    </h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-fog">
                      {step.body[lang]}
                    </p>
                  </li>
                ))}
              </ol>

              <h2 className="eyebrow mt-14 text-fog">{dict.services.useCasesTitle}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {service.useCases[lang].map((item) => (
                  <li
                    key={item}
                    className="flex gap-4 text-[0.9375rem] leading-relaxed text-paper/85"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-[5px] w-[5px] shrink-0 rounded-full bg-accent-soft"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper" labelledBy="faq-heading">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 id="faq-heading" data-reveal className="text-display-md lg:col-span-4">
              {dict.services.faqTitle}
            </h2>
            <div data-reveal className="lg:col-span-8">
              <FaqList items={faqs} />
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-10 border-t border-rule pt-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            {related.length > 0 ? (
              <div>
                <h2 className="eyebrow text-graphite">{dict.services.relatedTitle}</h2>
                <ul className="mt-6 flex flex-wrap gap-3">
                  {related.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={serviceHref(lang, entry.slug)}
                        className="group inline-flex items-center gap-2 border border-rule-strong px-4 py-2.5 text-[0.9375rem] transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        {entry.title[lang]}
                        <Arrow />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Connects a discipline to a price without forcing an enquiry. */}
            <div className="lg:max-w-[34ch]">
              <h2 className="eyebrow text-graphite">{dict.packages.title}</h2>
              <p className="mt-6 text-[0.9375rem] leading-relaxed text-graphite">
                {dict.home.packages.body}
              </p>
              <Link
                href={route(lang, "packages")}
                className="group mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-[-0.01em]"
              >
                <span className="link-underline">{dict.packages.title}</span>
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <FinalCta locale={lang} dict={dict} />

      <JsonLd
        data={[
          serviceSchema({
            locale: lang,
            name: service.title[lang],
            description: service.summary[lang],
            path: `/services/${service.slug}`,
          }),
          faqSchema(faqs),
          breadcrumbSchema(lang, [
            { name: "AMPLIQ", path: "" },
            { name: dict.services.title, path: "/services" },
            { name: service.title[lang], path: `/services/${service.slug}` },
          ]),
        ]}
      />
    </>
  );
}
