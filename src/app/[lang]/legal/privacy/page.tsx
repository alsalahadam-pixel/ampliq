import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { LegalDraftNotice } from "@/components/layout/legal-notice";
import { Section } from "@/components/ui/section";
import { getDictionary } from "@/lib/dictionary";
import { LOCALE_COOKIE, isLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { analyticsEnabled, contactEndpoint, legalEntity, site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/legal/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const dict = getDictionary(lang);
  return buildMetadata({
    locale: lang,
    path: "/legal/privacy",
    title: dict.legal.privacyTitle,
    description:
      lang === "de"
        ? "Datenschutzerklärung von AMPLIQ: welche Daten diese Website verarbeitet und welche nicht."
        : "AMPLIQ privacy policy: what data this website processes, and what it does not.",
    noIndex: true,
  });
}

/**
 * The technical descriptions below are accurate for this build: fonts are
 * self-hosted, no third-party scripts load unless an analytics ID is
 * configured, and the only cookie is the language preference. The legal
 * framing still needs review before launch — hence the notice at the top.
 */
const copy = {
  en: {
    lead: "What this website processes, what it stores, and what it does not.",
    sections: [
      {
        title: "Who is responsible",
        body: [
          "The controller for data processing on this website is the provider named in the imprint. Contact details for data protection enquiries are listed there.",
        ],
      },
      {
        title: "Hosting and server logs",
        body: [
          "When you open this site, the hosting provider automatically records technical data that your browser transmits: IP address, date and time of the request, the page requested, referrer, browser and operating system.",
          "This processing is necessary to deliver the site and to maintain its stability and security. The legal basis is Art. 6 (1) (f) GDPR. Log data is not merged with other data sources and is deleted after a short retention period defined by the hosting provider.",
        ],
      },
      {
        title: "Cookies",
        body: [
          "This website sets one cookie, and only after you actively choose a language: it stores your selection so that later visits open in the same language. It contains no identifier and is not used for analysis.",
          "No consent banner is shown because no cookie requiring consent is set. If tracking is introduced later, a consent mechanism will be added and no such script will run before consent is given.",
        ],
        list: [
          `${LOCALE_COOKIE} — stores your language preference (English or German). Stored for 12 months. Strictly necessary for the function you requested.`,
        ],
      },
      {
        title: "Fonts",
        body: [
          "Typefaces are self-hosted and delivered from the same server as the rest of the site. No connection is made to Google Fonts or any other font service, and no data is transmitted to third parties when the fonts load.",
        ],
      },
      {
        title: "Contact form and email",
        body: [
          contactEndpoint
            ? "If you send an enquiry through the contact form, the details you enter are transmitted to us and stored for the purpose of processing your request. The legal basis is Art. 6 (1) (b) GDPR for pre-contractual measures, and Art. 6 (1) (f) GDPR for general enquiries."
            : "The contact form is not yet connected to a delivery service. Until it is, submissions are not transmitted or stored anywhere, and the form says so on screen. Enquiries by email are processed and stored for the purpose of answering them.",
          "Your details are not passed to third parties without your consent, and are deleted once the enquiry is resolved and no statutory retention period applies.",
        ],
      },
      {
        title: "Analytics and tracking",
        body: [
          analyticsEnabled
            ? "This site loads analytics or marketing tags. Details of the specific services, their purposes, recipients and retention periods must be completed here before launch, together with a consent mechanism."
            : "This site currently loads no analytics, no advertising pixels and no third-party tracking of any kind. Nothing is measured about your visit beyond the server logs described above.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "You have the right to information about the data we hold about you, to correction or erasure, to restriction of processing, to object to processing, and to data portability. You also have the right to lodge a complaint with a supervisory authority.",
          "To exercise any of these rights, contact us using the details in the imprint.",
        ],
      },
      {
        title: "External links",
        body: [
          "This site links to external websites. Once you follow such a link, this policy no longer applies and the privacy policy of the respective provider takes over.",
        ],
      },
    ],
  },
  de: {
    lead: "Was diese Website verarbeitet, was sie speichert — und was nicht.",
    sections: [
      {
        title: "Verantwortliche Stelle",
        body: [
          "Verantwortlich für die Datenverarbeitung auf dieser Website ist der im Impressum genannte Anbieter. Die Kontaktdaten für Datenschutzanfragen finden Sie dort.",
        ],
      },
      {
        title: "Hosting und Server-Logfiles",
        body: [
          "Beim Aufruf dieser Website erfasst der Hosting-Anbieter automatisch technische Daten, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite, Referrer sowie Browser und Betriebssystem.",
          "Diese Verarbeitung ist erforderlich, um die Website auszuliefern und ihren stabilen und sicheren Betrieb zu gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Die Logdaten werden nicht mit anderen Datenquellen zusammengeführt und nach einer kurzen, vom Hosting-Anbieter festgelegten Frist gelöscht.",
        ],
      },
      {
        title: "Cookies",
        body: [
          "Diese Website setzt genau ein Cookie — und zwar erst, wenn Sie aktiv eine Sprache wählen: Es speichert Ihre Auswahl, damit spätere Besuche in derselben Sprache öffnen. Es enthält keine Kennung und wird nicht zur Auswertung verwendet.",
          "Ein Consent-Banner wird nicht angezeigt, weil kein einwilligungspflichtiges Cookie gesetzt wird. Sollte später Tracking hinzukommen, wird ein Einwilligungsmechanismus ergänzt; entsprechende Skripte laufen dann erst nach Ihrer Einwilligung.",
        ],
        list: [
          `${LOCALE_COOKIE} — speichert Ihre Sprachwahl (Deutsch oder Englisch). Speicherdauer 12 Monate. Technisch notwendig für die von Ihnen gewünschte Funktion.`,
        ],
      },
      {
        title: "Schriftarten",
        body: [
          "Die verwendeten Schriften werden lokal ausgeliefert und vom selben Server geladen wie die übrige Website. Es besteht keine Verbindung zu Google Fonts oder einem anderen Schriftdienst; beim Laden der Schriften werden keine Daten an Dritte übertragen.",
        ],
      },
      {
        title: "Kontaktformular und E-Mail",
        body: [
          contactEndpoint
            ? "Wenn Sie uns über das Kontaktformular eine Anfrage senden, werden Ihre Angaben zum Zweck der Bearbeitung übermittelt und gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche Maßnahmen sowie Art. 6 Abs. 1 lit. f DSGVO für allgemeine Anfragen."
            : "Das Kontaktformular ist noch nicht an einen Versanddienst angebunden. Bis dahin werden Eingaben weder übertragen noch gespeichert; das Formular weist im Betrieb darauf hin. Anfragen per E-Mail werden zum Zweck der Beantwortung verarbeitet und gespeichert.",
          "Ihre Angaben werden ohne Ihre Einwilligung nicht an Dritte weitergegeben und gelöscht, sobald die Anfrage erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        ],
      },
      {
        title: "Analyse und Tracking",
        body: [
          analyticsEnabled
            ? "Auf dieser Website werden Analyse- oder Marketing-Tags geladen. Die konkreten Dienste, ihre Zwecke, Empfänger und Speicherdauern sind hier vor dem Launch zu ergänzen — zusammen mit einem Einwilligungsmechanismus."
            : "Diese Website lädt derzeit keine Analysewerkzeuge, keine Werbepixel und kein Tracking Dritter. Über die oben beschriebenen Server-Logfiles hinaus wird zu Ihrem Besuch nichts gemessen.",
        ],
      },
      {
        title: "Ihre Rechte",
        body: [
          "Sie haben das Recht auf Auskunft über die zu Ihrer Person gespeicherten Daten, auf Berichtigung oder Löschung, auf Einschränkung der Verarbeitung, auf Widerspruch gegen die Verarbeitung sowie auf Datenübertragbarkeit. Ihnen steht zudem ein Beschwerderecht bei einer Aufsichtsbehörde zu.",
          "Zur Ausübung dieser Rechte wenden Sie sich bitte an die im Impressum genannten Kontaktdaten.",
        ],
      },
      {
        title: "Externe Links",
        body: [
          "Diese Website verlinkt auf externe Websites. Sobald Sie einem solchen Link folgen, gilt diese Erklärung nicht mehr, sondern die Datenschutzerklärung des jeweiligen Anbieters.",
        ],
      },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/legal/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const text = copy[lang];

  return (
    <>
      <PageHero
        eyebrow={dict.footer.legalTitle}
        title={dict.legal.privacyTitle}
        lead={text.lead}
        size="compact"
      />

      <Section tone="paper">
        <div className="shell">
          <div className="max-w-[72ch]">
            <LegalDraftNotice dict={dict} />

            {text.sections.map((section, index) => (
              <section
                key={section.title}
                id={index === 2 ? "cookies" : undefined}
                className="mt-12 scroll-mt-28"
              >
                <h2 className="font-display text-display-sm">{section.title}</h2>
                <div className="mt-4 flex flex-col gap-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[0.9375rem] leading-relaxed text-graphite"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                {"list" in section && section.list ? (
                  <ul className="mt-5 border-t border-rule">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="border-b border-rule py-3 font-mono text-[0.8125rem] leading-relaxed text-ink"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <p className="mt-14 text-xs text-graphite">
              {dict.legal.lastUpdated}: —{" "}
              {legalEntity.dataProtectionContact ?? site.email}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
