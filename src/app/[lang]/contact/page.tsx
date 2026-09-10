import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { processSteps } from "@/content/process";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { route } from "@/lib/routes";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { contact } from "@/lib/site";
import { pad } from "@/lib/utils";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = {
    en: {
      title: "Start a project",
      description:
        "Tell us where your business is today and what you want to reach. We reply within two working days — or book a free 30-minute consultation.",
    },
    de: {
      title: "Projekt starten",
      description:
        "Erzählen Sie uns, wo Ihr Unternehmen heute steht und was Sie erreichen möchten. Antwort innerhalb von zwei Werktagen — oder 30 Minuten kostenlose Beratung.",
    },
  }[lang];

  return buildMetadata({ locale: lang, path: "/contact", ...copy });
}

export default async function ContactPage({
  params,
}: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);

  return (
    <>
      <PageHero
        eyebrow={dict.nav.contact}
        title={dict.contact.title}
        lead={dict.contact.lead}
      />

      <Section tone="paper">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <ContactForm locale={lang} dict={dict} />
            </div>

            <aside className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
              <div className="border border-rule bg-paper-soft p-7">
                <h2 className="font-display text-[1.25rem] font-bold tracking-[-0.03em]">
                  {dict.contact.directTitle}
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">
                  {dict.contact.directBody}
                </p>
                <dl className="mt-5 flex flex-col gap-4">
                  <div>
                    <dt className="text-xs text-graphite">
                      {dict.contact.generalLabel}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${contact.info}`}
                        className="link-underline text-[0.9375rem] font-medium break-all"
                      >
                        {contact.info}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-graphite">
                      {dict.contact.projectLabel}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${contact.project}`}
                        className="link-underline text-[0.9375rem] font-medium break-all"
                      >
                        {contact.project}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-graphite">
                      {dict.contact.helpLabel}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${contact.help}`}
                        className="link-underline text-[0.9375rem] font-medium break-all"
                      >
                        {contact.help}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div id="consultation" className="scroll-mt-28 border border-rule p-7">
                <h2 className="font-display text-[1.25rem] font-bold tracking-[-0.03em]">
                  {dict.contact.consultationTitle}
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">
                  {dict.contact.consultationBody}
                </p>
                <ButtonLink
                  href={route(lang, "call")}
                  variant="outline"
                  size="sm"
                  className="mt-5 w-full"
                >
                  {dict.cta.talk}
                </ButtonLink>
              </div>

              {/* What happens next — removes the main hesitation before sending. */}
              <div>
                <h2 className="eyebrow text-graphite">{dict.home.process.eyebrow}</h2>
                <ol className="mt-5 border-t border-rule">
                  {processSteps.slice(0, 3).map((step, index) => (
                    <li key={step.title.en} className="flex gap-4 border-b border-rule py-4">
                      <span className="font-mono text-[0.6875rem] leading-[1.7] tracking-[0.16em] text-accent">
                        {pad(index + 1)}
                      </span>
                      <div>
                        <h3 className="font-display text-[1rem] font-bold tracking-[-0.02em]">
                          {step.title[lang]}
                        </h3>
                        <p className="mt-1 text-[0.875rem] leading-relaxed text-graphite">
                          {step.body[lang]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <JsonLd
        data={[
          breadcrumbSchema(lang, [
            { name: "AMPLIQ", path: "" },
            { name: dict.nav.contact, path: "/contact" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: dict.contact.title,
            description: dict.contact.lead,
          },
        ]}
      />
    </>
  );
}
