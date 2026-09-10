import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { ProcessRail } from "@/components/sections/process-rail";
import { JsonLd } from "@/components/seo/json-ld";
import { services } from "@/content/services";
import { ServiceIndex } from "@/components/services/service-index";
import { Section } from "@/components/ui/section";
import { pillars } from "@/content/pillars";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata, serviceListSchema } from "@/lib/seo";
import { pad } from "@/lib/utils";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = {
    en: {
      title: "Services",
      description:
        "Web design, branding, visual identity, photography, video, SEO, Meta Ads and social media, organised into three layers that work together.",
    },
    de: {
      title: "Leistungen",
      description:
        "Webdesign, Branding, Visual Identity, Fotografie, Video, SEO, Meta Ads und Social Media — organisiert in drei Ebenen, die zusammenarbeiten.",
    },
  }[lang];

  return buildMetadata({ locale: lang, path: "/services", ...copy });
}

export default async function ServicesPage({
  params,
}: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.services}
        title={dict.services.title}
        lead={dict.services.lead}
      />

      {/* The three layers, restated as the frame for the index below. */}
      <Section tone="paper-soft" bleed className="py-16 lg:py-20">
        <div className="shell">
          <ol className="grid gap-8 border-t border-rule-strong pt-8 lg:grid-cols-3 lg:gap-10">
            {pillars.map((pillar, index) => (
              <li
                key={pillar.key}
                data-reveal
                style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.6875rem] tracking-[0.16em] text-accent">
                    {pad(pillar.index)}
                  </span>
                  <h2 className="font-display text-xl font-bold tracking-[-0.03em] uppercase">
                    {pillar.label}
                  </h2>
                  <span className="text-sm text-graphite">— {pillar.title[lang]}</span>
                </div>
                <p className="mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-graphite">
                  {pillar.body[lang]}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="paper">
        <div className="shell">
          <ServiceIndex locale={lang} />
        </div>
      </Section>

      <ProcessRail locale={lang} dict={dict} />

      <FinalCta locale={lang} dict={dict} />

      <JsonLd
        data={[
          breadcrumbSchema(lang, [
            { name: "AMPLIQ", path: "" },
            { name: dict.services.title, path: "/services" },
          ]),
          serviceListSchema({
            locale: lang,
            name: dict.services.title,
            items: services.map((service) => ({
              name: service.title[lang],
              description: service.summary[lang],
              path: `/services/${service.slug}`,
            })),
          }),
        ]}
      />
    </>
  );
}
