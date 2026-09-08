import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { LegalDraftNotice, LegalValue } from "@/components/layout/legal-notice";
import { Section } from "@/components/ui/section";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { legalEntity, site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal/imprint">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    path: "/legal/imprint",
    title: dict.legal.imprintTitle,
    description:
      lang === "de"
        ? "Impressum und Anbieterkennzeichnung von AMPLIQ."
        : "Imprint and provider identification for AMPLIQ.",
    // Not useful in search results, and it must never outrank a real page.
    noIndex: true,
  });
}

const copy = {
  en: {
    lead: "Provider identification under § 5 DDG and § 18 (2) MStV.",
    providerTitle: "Provider",
    contactTitle: "Contact",
    taxTitle: "Tax and register",
    responsibleTitle: "Responsible for editorial content",
    responsibleBody:
      "Under § 18 (2) MStV, responsibility for the editorial content of this site sits with the representative named above, at the address given above.",
    disputeTitle: "Dispute resolution",
    disputeBody:
      "The European Commission provides a platform for online dispute resolution at ec.europa.eu/consumers/odr. We are neither obliged nor willing to take part in dispute resolution proceedings before a consumer arbitration board.",
    liabilityTitle: "Liability for links",
    liabilityBody:
      "This site contains links to external websites over whose content we have no control. Responsibility for that content always lies with the respective provider. Linked pages were checked for legal violations at the time of linking; no such violations were apparent.",
    copyrightTitle: "Copyright",
    copyrightBody:
      "Content and works on these pages are subject to German copyright law. Reproduction, adaptation, distribution and any form of use beyond the limits of copyright require written consent.",
  },
  de: {
    lead: "Anbieterkennzeichnung gemäß § 5 DDG und § 18 Abs. 2 MStV.",
    providerTitle: "Anbieter",
    contactTitle: "Kontakt",
    taxTitle: "Steuer und Register",
    responsibleTitle: "Redaktionell verantwortlich",
    responsibleBody:
      "Verantwortlich für die redaktionellen Inhalte dieser Website im Sinne des § 18 Abs. 2 MStV ist die oben genannte vertretungsberechtigte Person unter der oben genannten Anschrift.",
    disputeTitle: "Streitschlichtung",
    disputeBody:
      "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: ec.europa.eu/consumers/odr. Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir weder verpflichtet noch bereit.",
    liabilityTitle: "Haftung für Links",
    liabilityBody:
      "Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar.",
    copyrightTitle: "Urheberrecht",
    copyrightBody:
      "Die durch die Betreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.",
  },
};

export default async function ImprintPage({
  params,
}: PageProps<"/[lang]/legal/imprint">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const text = copy[lang];
  const missing = dict.legal.missingValue;

  const address = [
    legalEntity.street,
    [legalEntity.postalCode, legalEntity.city].filter(Boolean).join(" ") || null,
    legalEntity.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <PageHero
        eyebrow={dict.footer.legalTitle}
        title={dict.legal.imprintTitle}
        lead={text.lead}
        size="compact"
      />

      <Section tone="paper">
        <div className="shell">
          <div className="max-w-[72ch]">
            <LegalDraftNotice dict={dict} />

            <h2 className="font-display mt-14 text-display-sm">{text.providerTitle}</h2>
            <dl className="mt-6 border-t border-rule">
              <LegalValue
                label={lang === "de" ? "Unternehmen" : "Company"}
                value={legalEntity.companyName}
                missingLabel={missing}
              />
              <LegalValue
                label={lang === "de" ? "Rechtsform" : "Legal form"}
                value={legalEntity.legalForm}
                missingLabel={missing}
              />
              <LegalValue
                label={lang === "de" ? "Vertreten durch" : "Represented by"}
                value={legalEntity.representative}
                missingLabel={missing}
              />
              <LegalValue
                label={lang === "de" ? "Anschrift" : "Address"}
                value={address || null}
                missingLabel={missing}
              />
            </dl>

            <h2 className="font-display mt-14 text-display-sm">{text.contactTitle}</h2>
            <dl className="mt-6 border-t border-rule">
              <LegalValue
                label={lang === "de" ? "E-Mail" : "Email"}
                value={legalEntity.email ?? site.email}
                missingLabel={missing}
              />
              <LegalValue
                label={lang === "de" ? "Telefon" : "Phone"}
                value={legalEntity.phone}
                missingLabel={missing}
              />
            </dl>

            <h2 className="font-display mt-14 text-display-sm">{text.taxTitle}</h2>
            <dl className="mt-6 border-t border-rule">
              <LegalValue
                label={lang === "de" ? "Umsatzsteuer-ID" : "VAT ID"}
                value={legalEntity.vatId}
                missingLabel={missing}
              />
              <LegalValue
                label={lang === "de" ? "Registergericht" : "Register court"}
                value={legalEntity.registerCourt}
                missingLabel={missing}
              />
              <LegalValue
                label={lang === "de" ? "Registernummer" : "Register number"}
                value={legalEntity.registerNumber}
                missingLabel={missing}
              />
            </dl>

            {[
              { title: text.responsibleTitle, body: text.responsibleBody },
              { title: text.disputeTitle, body: text.disputeBody },
              { title: text.liabilityTitle, body: text.liabilityBody },
              { title: text.copyrightTitle, body: text.copyrightBody },
            ].map((block) => (
              <section key={block.title} className="mt-12">
                <h2 className="font-display text-[1.25rem] font-bold tracking-[-0.03em]">
                  {block.title}
                </h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">
                  {block.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
