/**
 * Legal document content.
 *
 * Written to the structure German law expects — §5 DDG and §18 MStV for the
 * Impressum, the GDPR articles for the privacy policy, §§ 312g/355 BGB for the
 * cancellation notice — with every entity-specific value pulled from
 * `@/lib/legal`.
 *
 * Two rules govern what goes in a sentence here. Nothing is invented: a fact
 * AMPLIQ does not have is written as `legalValue(...)`, which resolves to a
 * bracketed token, and the renderer drops the sentence, row or chapter that
 * contains one. And nothing describes the state of the paperwork: no sentence
 * says a value is coming, is being confirmed, or is required before launch. A
 * document is what is known about the subject, not a progress report on itself.
 *
 * Where a statement only holds once a value exists — the supervisory authority,
 * the register entry, the processors — it lives in its own block or chapter so
 * that it appears with the value and is simply absent until then.
 *
 * **Nothing here is a substitute for legal review.** The structure is right and
 * the technical statements describe what this build actually does; the wording
 * still wants a qualified lawyer before it is relied on.
 */

import type { LegalChapter } from "@/components/legal/legal-document";
import type { Locale } from "@/lib/i18n";
import { entityName, legalValue, noticeAddress } from "@/lib/legal";
import { contact, site, siteUrl } from "@/lib/site";

/** The date the wording below last changed. Bump it when you edit a document. */
export const LEGAL_UPDATED = "2026-09-09";

type Chapters = Record<Locale, LegalChapter[]>;

const domain = siteUrl.replace(/^https?:\/\//, "");

/**
 * How the contracting party is named where the AGB has to introduce it: the
 * registered designation with the trading name after it once the two differ,
 * and the trading name on its own until then. Never a bracketed token — the
 * sentence it opens is the one that says what the document governs, and losing
 * it would leave the chapter without its subject.
 */
const contractingParty: Record<Locale, string> = {
  en: entityName === site.name ? site.name : `${entityName} ("${site.name}")`,
  de: entityName === site.name ? site.name : `${entityName} („${site.name}“)`,
};

/* ------------------------------------------------------------------ *
 * Impressum
 * ------------------------------------------------------------------ */

/**
 * The Impressum.
 *
 * Register details, tax numbers and the supervisory authority appear as their
 * own rows and chapters once they are supplied, and are simply absent until
 * then. Nothing announces their absence: a business without a Handelsregister
 * entry has nothing to declare on that point, and a sentence saying so tells a
 * visitor about the company's status rather than about the provider, which is
 * not what § 5 DDG asks for.
 */
export function imprintChapters(locale: Locale): LegalChapter[] {
  const chapters: Chapters = {
    en: [
      {
        id: "provider",
        heading: "Service provider",
        blocks: [
          {
            kind: "text",
            value:
              "Information in accordance with § 5 DDG (Digitale-Dienste-Gesetz).",
          },
          {
            kind: "rows",
            rows: [
              { label: "Name", value: entityName },
              { label: "Legal form", value: legalValue("form") },
              { label: "Address", value: legalValue("street") },
              {
                label: "Postal code and city",
                value: `${legalValue("postalCode")} ${legalValue("city")}`,
              },
              { label: "Country", value: legalValue("country") },
            ],
          },
          // § 5 DDG asks for the means of contact in the same breath as the
          // identification, so they share a chapter rather than repeating the
          // general address two rows apart under a heading of its own.
          {
            kind: "rows",
            rows: [
              { label: "General enquiries", value: contact.info },
              { label: "Projects and proposals", value: contact.project },
              { label: "Telephone", value: legalValue("phone") },
            ],
          },
          {
            kind: "text",
            value:
              "Email is the fastest route and is answered within two working days.",
          },
        ],
      },
      {
        id: "responsible",
        heading: "Responsible for content",
        // § 18 MStV names a person. Without one the heading and its lead-in
        // sentence have nothing to introduce, so the chapter waits for it.
        requires: [legalValue("representative")],
        blocks: [
          {
            kind: "text",
            value:
              "Responsible for editorial content in accordance with § 18 (2) MStV:",
          },
          {
            kind: "rows",
            rows: [
              { label: "Name", value: legalValue("representative") },
              { label: "Address", value: legalValue("street") },
              {
                label: "Postal code and city",
                value: `${legalValue("postalCode")} ${legalValue("city")}`,
              },
            ],
          },
        ],
      },
      {
        id: "tax",
        heading: "Tax information",
        blocks: [
          {
            kind: "rows",
            rows: [
              { label: "VAT identification number", value: legalValue("vatId") },
              { label: "Tax number", value: legalValue("taxNumber") },
            ],
          },
        ],
      },
      {
        id: "register",
        heading: "Register entry",
        blocks: [
          {
            kind: "rows",
            rows: [
              { label: "Registering court", value: legalValue("registerCourt") },
              { label: "Registration number", value: legalValue("registerNumber") },
            ],
          },
        ],
      },
      {
        id: "supervisory",
        heading: "Regulated professions and supervision",
        blocks: [
          {
            kind: "text",
            value:
              "Marketing and design services are not a regulated profession in Germany, so no professional chamber, professional title or supervisory authority applies.",
          },
          {
            kind: "text",
            value: `Supervisory authority: ${legalValue("supervisoryAuthority")}.`,
          },
        ],
      },
      {
        id: "dispute",
        heading: "Online dispute resolution",
        blocks: [
          {
            kind: "text",
            value:
              "The European Commission's platform for online dispute resolution was discontinued on 20 July 2025 and is no longer available.",
          },
          {
            kind: "text",
            value:
              "We are neither obliged nor willing to take part in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG). Complaints are handled directly and quickly by email.",
          },
        ],
      },
      {
        id: "liability",
        heading: "Liability for content and links",
        blocks: [
          {
            kind: "text",
            value:
              "As a service provider we are responsible for our own content on these pages under general law (§ 7 (1) DDG). Under §§ 8 to 10 DDG we are not obliged to monitor transmitted or stored third-party information, or to investigate circumstances that indicate unlawful activity. Obligations to remove or block the use of information under general law remain unaffected; liability in this respect begins only from the point at which a specific infringement becomes known, and any such content will be removed immediately.",
          },
          {
            kind: "text",
            value:
              "This site links to external websites over whose content we have no influence. Responsibility for that content always lies with its respective provider or operator. Linked pages were checked for possible legal infringements at the time of linking and no unlawful content was apparent. Permanent monitoring of linked pages is not reasonable without concrete evidence of an infringement; on becoming aware of one, such links will be removed immediately.",
          },
        ],
      },
      {
        id: "copyright",
        heading: "Copyright",
        blocks: [
          {
            kind: "text",
            value:
              "The content and works on these pages are subject to German copyright law. Reproduction, adaptation, distribution and any kind of use beyond the limits of copyright require written consent. Downloads and copies of this site are permitted for private, non-commercial use only.",
          },
          {
            kind: "text",
            value:
              "The AMPLIQ name, wordmark and DISC mark are used as trade marks of the operator named above and may not be used without permission.",
          },
        ],
      },
    ],

    de: [
      {
        id: "provider",
        heading: "Diensteanbieter",
        blocks: [
          { kind: "text", value: "Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)." },
          {
            kind: "rows",
            rows: [
              { label: "Name", value: entityName },
              { label: "Rechtsform", value: legalValue("form") },
              { label: "Anschrift", value: legalValue("street") },
              {
                label: "PLZ und Ort",
                value: `${legalValue("postalCode")} ${legalValue("city")}`,
              },
              { label: "Land", value: legalValue("country") },
            ],
          },
          {
            kind: "rows",
            rows: [
              { label: "Allgemeine Anfragen", value: contact.info },
              { label: "Projekte und Angebote", value: contact.project },
              { label: "Telefon", value: legalValue("phone") },
            ],
          },
          {
            kind: "text",
            value:
              "E-Mail ist der schnellste Weg und wird innerhalb von zwei Werktagen beantwortet.",
          },
        ],
      },
      {
        id: "responsible",
        heading: "Inhaltlich verantwortlich",
        requires: [legalValue("representative")],
        blocks: [
          {
            kind: "text",
            value: "Verantwortlich für redaktionelle Inhalte gemäß § 18 Abs. 2 MStV:",
          },
          {
            kind: "rows",
            rows: [
              { label: "Name", value: legalValue("representative") },
              { label: "Anschrift", value: legalValue("street") },
              {
                label: "PLZ und Ort",
                value: `${legalValue("postalCode")} ${legalValue("city")}`,
              },
            ],
          },
        ],
      },
      {
        id: "tax",
        heading: "Steuerliche Angaben",
        blocks: [
          {
            kind: "rows",
            rows: [
              { label: "Umsatzsteuer-Identifikationsnummer", value: legalValue("vatId") },
              { label: "Steuernummer", value: legalValue("taxNumber") },
            ],
          },
        ],
      },
      {
        id: "register",
        heading: "Registereintrag",
        blocks: [
          {
            kind: "rows",
            rows: [
              { label: "Registergericht", value: legalValue("registerCourt") },
              { label: "Registernummer", value: legalValue("registerNumber") },
            ],
          },
        ],
      },
      {
        id: "supervisory",
        heading: "Reglementierte Berufe und Aufsicht",
        blocks: [
          {
            kind: "text",
            value:
              "Marketing- und Designleistungen sind in Deutschland kein reglementierter Beruf; es bestehen daher keine Kammerzugehörigkeit, keine Berufsbezeichnung und keine Aufsichtsbehörde.",
          },
          {
            kind: "text",
            value: `Zuständige Aufsichtsbehörde: ${legalValue("supervisoryAuthority")}.`,
          },
        ],
      },
      {
        id: "dispute",
        heading: "Online-Streitbeilegung",
        blocks: [
          {
            kind: "text",
            value:
              "Die Plattform der Europäischen Kommission zur Online-Streitbeilegung wurde zum 20. Juli 2025 eingestellt und steht nicht mehr zur Verfügung.",
          },
          {
            kind: "text",
            value:
              "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG). Beschwerden klären wir direkt und zügig per E-Mail.",
          },
        ],
      },
      {
        id: "liability",
        heading: "Haftung für Inhalte und Links",
        blocks: [
          {
            kind: "text",
            value:
              "Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich (§ 7 Abs. 1 DDG). Nach §§ 8 bis 10 DDG sind wir nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt; eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden entsprechender Rechtsverletzungen entfernen wir diese Inhalte umgehend.",
          },
          {
            kind: "text",
            value:
              "Diese Website verlinkt auf externe Websites, auf deren Inhalte wir keinen Einfluss haben. Für diese Inhalte ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.",
          },
        ],
      },
      {
        id: "copyright",
        heading: "Urheberrecht",
        blocks: [
          {
            kind: "text",
            value:
              "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.",
          },
          {
            kind: "text",
            value:
              "Der Name AMPLIQ, die Wortmarke und die DISC-Bildmarke werden als Kennzeichen des oben genannten Betreibers verwendet und dürfen ohne Genehmigung nicht genutzt werden.",
          },
        ],
      },
    ],
  };

  return chapters[locale];
}

/* ------------------------------------------------------------------ *
 * Privacy policy
 * ------------------------------------------------------------------ */

export function privacyChapters(locale: Locale): LegalChapter[] {
  const chapters: Chapters = {
    en: [
      {
        id: "controller",
        heading: "Controller",
        blocks: [
          {
            kind: "text",
            value:
              "The controller responsible for processing personal data on this website within the meaning of Art. 4 (7) GDPR is:",
          },
          {
            kind: "rows",
            rows: [
              { label: "Name", value: entityName },
              { label: "Address", value: legalValue("street") },
              {
                label: "Postal code and city",
                value: `${legalValue("postalCode")} ${legalValue("city")}`,
              },
              { label: "Email", value: legalValue("dataProtectionContact") },
            ],
          },
          {
            kind: "text",
            value:
              "No data protection officer has been appointed. Under § 38 BDSG one is only required above a threshold of regularly employed persons that is not met.",
          },
        ],
      },
      {
        id: "hosting",
        heading: "Hosting and server log files",
        blocks: [
          {
            kind: "text",
            value:
              "When you open a page, your browser automatically transmits data that the hosting infrastructure records in server log files.",
          },
          {
            kind: "list",
            items: [
              "IP address of the requesting device",
              "Date and time of the request",
              "The page or file requested",
              "Referrer URL, where transmitted",
              "Browser type and version, and operating system",
            ],
          },
          {
            kind: "text",
            value:
              "This data is technically necessary to deliver the site and to keep it secure and stable. The legal basis is Art. 6 (1) (f) GDPR: our legitimate interest in a reliable and secure website. Log data is not merged with other data sources and is deleted or anonymised after a short retention period.",
          },
          {
            kind: "text",
            value: `Hosting is provided by ${legalValue("hostingProvider")} as a processor under Art. 28 GDPR.`,
          },
        ],
      },
      {
        id: "contact-form",
        heading: "Enquiry form",
        blocks: [
          {
            kind: "text",
            value:
              "When you send an enquiry through the form, the details you enter are transmitted to us by email so that we can answer it.",
          },
          {
            kind: "list",
            items: [
              "First and last name, and your email address",
              "Company, telephone number and website, where you supply them",
              "Project type, budget range, timeline and services you select",
              "The message you write",
              "The language you used the site in",
            ],
          },
          {
            kind: "text",
            value:
              "The legal basis is Art. 6 (1) (b) GDPR where the enquiry concerns a contract or pre-contractual steps, and otherwise Art. 6 (1) (f) GDPR: our legitimate interest in answering enquiries addressed to us. We keep enquiries for as long as they are needed to deal with the matter and for as long as statutory retention obligations apply.",
          },
          {
            kind: "text",
            value: `Delivery of that email is handled by ${legalValue("emailProcessor")} as a processor under Art. 28 GDPR.`,
          },
        ],
      },
      {
        id: "booking",
        heading: "Booking a call",
        blocks: [
          {
            kind: "text",
            value:
              "The booking page lets you reserve a time for an introductory call. To do that we process the name, email address, company, telephone number, project type and description you enter, together with the time you select and the timezone your browser reports.",
          },
          {
            kind: "text",
            value:
              "The legal basis is Art. 6 (1) (b) GDPR — the booking is a pre-contractual step you requested. The data is used to hold the appointment, to confirm it by email and to prepare for the call.",
          },
          {
            kind: "text",
            value:
              "Availability is checked against our own calendar. Only free/busy times are read: the website never receives the subject, participants, location or any other content of our calendar entries. When a calendar is connected, your booking is written into it as an appointment containing the details you supplied.",
          },
          {
            kind: "text",
            value: `The calendar is operated by ${legalValue("calendarProcessor")} as a processor under Art. 28 GDPR.`,
          },
        ],
      },
      {
        id: "cookies",
        heading: "Cookies and local storage",
        blocks: [
          {
            kind: "text",
            value:
              "This website sets no advertising cookies, no analytics cookies and no tracking pixels. There is nothing to consent to, because nothing non-essential is loaded.",
          },
          {
            kind: "text",
            value:
              "One cookie is used, and only if you actively switch language:",
          },
          {
            kind: "rows",
            rows: [
              { label: "Name", value: "ampliq_locale" },
              { label: "Purpose", value: "Remembers the language you chose" },
              { label: "Duration", value: "12 months" },
              { label: "Type", value: "Strictly necessary (functional)" },
            ],
          },
          {
            kind: "text",
            value:
              "This is a functional cookie required to provide the service you asked for, so it does not require consent under § 25 (2) TDDDG. You can delete it at any time in your browser settings.",
          },
        ],
      },
      {
        id: "analytics",
        heading: "Analytics and marketing tools",
        blocks: [
          {
            kind: "text",
            value:
              "No web analytics, remarketing or advertising tools are active on this website. No Google Analytics, no Google Tag Manager, no Meta Pixel, no LinkedIn Insight Tag.",
          },
          {
            kind: "text",
            value:
              "The site is built so that such tools can be added later. If any of them is switched on, a consent banner will be introduced at the same time, this section will be updated to describe exactly what is loaded, and nothing will run before you have agreed to it.",
          },
        ],
      },
      {
        id: "fonts",
        heading: "Fonts",
        blocks: [
          {
            kind: "text",
            value:
              "The typefaces used here are served from this website's own domain. No connection is made to Google Fonts or any other font service when you open a page, and no data is transmitted to a font provider.",
          },
        ],
      },
      {
        id: "rights",
        heading: "Your rights",
        blocks: [
          { kind: "text", value: "Under the GDPR you have the right to:" },
          {
            kind: "list",
            items: [
              "Access — to know what data about you we process (Art. 15)",
              "Rectification — to have inaccurate data corrected (Art. 16)",
              "Erasure — to have your data deleted (Art. 17)",
              "Restriction — to limit how your data is processed (Art. 18)",
              "Data portability — to receive your data in a machine-readable form (Art. 20)",
              "Objection — to object to processing based on legitimate interests (Art. 21)",
              "Withdrawal — to withdraw consent at any time, with effect for the future (Art. 7 (3))",
            ],
          },
          {
            kind: "text",
            value: `To exercise any of these, write to ${legalValue("dataProtectionContact")}. We answer within one month.`,
          },
          {
            kind: "text",
            value:
              "You also have the right to lodge a complaint with a supervisory authority, in particular in the member state of your habitual residence, place of work or the place of the alleged infringement.",
          },
        ],
      },
      {
        id: "security",
        heading: "Security and changes",
        blocks: [
          {
            kind: "text",
            value: `This website is served over TLS. You can recognise an encrypted connection by the "https://" prefix in the address bar and the lock icon beside it.`,
          },
          {
            kind: "text",
            value:
              "This policy will be updated whenever the site changes in a way that affects data processing. The date shown alongside the contents is the date of the current version.",
          },
        ],
      },
    ],

    de: [
      {
        id: "controller",
        heading: "Verantwortlicher",
        blocks: [
          {
            kind: "text",
            value:
              "Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website im Sinne von Art. 4 Nr. 7 DSGVO ist:",
          },
          {
            kind: "rows",
            rows: [
              { label: "Name", value: entityName },
              { label: "Anschrift", value: legalValue("street") },
              {
                label: "PLZ und Ort",
                value: `${legalValue("postalCode")} ${legalValue("city")}`,
              },
              { label: "E-Mail", value: legalValue("dataProtectionContact") },
            ],
          },
          {
            kind: "text",
            value:
              "Ein Datenschutzbeauftragter wurde nicht bestellt. Nach § 38 BDSG besteht diese Pflicht erst ab einer Anzahl ständig beschäftigter Personen, die hier nicht erreicht wird.",
          },
        ],
      },
      {
        id: "hosting",
        heading: "Hosting und Server-Logfiles",
        blocks: [
          {
            kind: "text",
            value:
              "Beim Aufruf einer Seite übermittelt Ihr Browser automatisch Daten, die die Hosting-Infrastruktur in Server-Logfiles speichert.",
          },
          {
            kind: "list",
            items: [
              "IP-Adresse des anfragenden Geräts",
              "Datum und Uhrzeit der Anfrage",
              "Aufgerufene Seite oder Datei",
              "Referrer-URL, soweit übermittelt",
              "Browsertyp und -version sowie Betriebssystem",
            ],
          },
          {
            kind: "text",
            value:
              "Diese Daten sind technisch erforderlich, um die Website auszuliefern und sicher und stabil zu betreiben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes Interesse an einer zuverlässigen und sicheren Website. Die Logdaten werden nicht mit anderen Datenquellen zusammengeführt und nach kurzer Speicherdauer gelöscht oder anonymisiert.",
          },
          {
            kind: "text",
            value: `Das Hosting erfolgt durch ${legalValue("hostingProvider")} als Auftragsverarbeiter nach Art. 28 DSGVO.`,
          },
        ],
      },
      {
        id: "contact-form",
        heading: "Anfrageformular",
        blocks: [
          {
            kind: "text",
            value:
              "Wenn Sie uns über das Formular eine Anfrage senden, werden die eingegebenen Angaben per E-Mail an uns übermittelt, damit wir sie beantworten können.",
          },
          {
            kind: "list",
            items: [
              "Vor- und Nachname sowie Ihre E-Mail-Adresse",
              "Unternehmen, Telefonnummer und Website, soweit angegeben",
              "Projektart, Budgetrahmen, Zeitrahmen und ausgewählte Leistungen",
              "Ihre Nachricht",
              "Die Sprache, in der Sie die Website genutzt haben",
            ],
          },
          {
            kind: "text",
            value:
              "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Anfrage auf einen Vertrag oder vorvertragliche Maßnahmen gerichtet ist, im Übrigen Art. 6 Abs. 1 lit. f DSGVO — unser berechtigtes Interesse an der Beantwortung an uns gerichteter Anfragen. Wir bewahren Anfragen so lange auf, wie sie zur Bearbeitung erforderlich sind und gesetzliche Aufbewahrungspflichten bestehen.",
          },
          {
            kind: "text",
            value: `Der Versand dieser E-Mail erfolgt über ${legalValue("emailProcessor")} als Auftragsverarbeiter nach Art. 28 DSGVO.`,
          },
        ],
      },
      {
        id: "booking",
        heading: "Terminbuchung",
        blocks: [
          {
            kind: "text",
            value:
              "Über die Buchungsseite können Sie einen Termin für ein Erstgespräch reservieren. Dafür verarbeiten wir Name, E-Mail-Adresse, Unternehmen, Telefonnummer, Projektart und Projektbeschreibung, die Sie eingeben, sowie die gewählte Zeit und die von Ihrem Browser gemeldete Zeitzone.",
          },
          {
            kind: "text",
            value:
              "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO — die Buchung ist eine von Ihnen angefragte vorvertragliche Maßnahme. Die Daten dienen der Reservierung des Termins, der Bestätigung per E-Mail und der Vorbereitung des Gesprächs.",
          },
          {
            kind: "text",
            value:
              "Die Verfügbarkeit wird gegen unseren eigenen Kalender geprüft. Dabei werden ausschließlich Frei-/Belegt-Zeiten gelesen: Betreff, Teilnehmende, Ort oder sonstige Inhalte unserer Kalendereinträge erreichen die Website zu keinem Zeitpunkt. Bei verbundenem Kalender wird Ihre Buchung als Termin mit den von Ihnen angegebenen Daten dort eingetragen.",
          },
          {
            kind: "text",
            value: `Der Kalender wird von ${legalValue("calendarProcessor")} als Auftragsverarbeiter nach Art. 28 DSGVO betrieben.`,
          },
        ],
      },
      {
        id: "cookies",
        heading: "Cookies und lokale Speicherung",
        blocks: [
          {
            kind: "text",
            value:
              "Diese Website setzt keine Werbe-Cookies, keine Analyse-Cookies und keine Tracking-Pixel. Es gibt nichts einzuwilligen, weil nichts Nicht-Erforderliches geladen wird.",
          },
          {
            kind: "text",
            value:
              "Ein einziges Cookie wird verwendet, und zwar nur, wenn Sie die Sprache aktiv umschalten:",
          },
          {
            kind: "rows",
            rows: [
              { label: "Name", value: "ampliq_locale" },
              { label: "Zweck", value: "Merkt sich die gewählte Sprache" },
              { label: "Dauer", value: "12 Monate" },
              { label: "Art", value: "Technisch notwendig (funktional)" },
            ],
          },
          {
            kind: "text",
            value:
              "Es handelt sich um ein funktionales Cookie, das für den von Ihnen gewünschten Dienst erforderlich ist; eine Einwilligung nach § 25 Abs. 2 TDDDG ist dafür nicht nötig. Sie können es jederzeit in Ihren Browsereinstellungen löschen.",
          },
        ],
      },
      {
        id: "analytics",
        heading: "Analyse- und Marketing-Tools",
        blocks: [
          {
            kind: "text",
            value:
              "Auf dieser Website sind keine Webanalyse-, Remarketing- oder Werbetools aktiv. Kein Google Analytics, kein Google Tag Manager, kein Meta-Pixel, kein LinkedIn Insight Tag.",
          },
          {
            kind: "text",
            value:
              "Die Website ist so gebaut, dass solche Tools später ergänzt werden können. Wird eines davon aktiviert, wird gleichzeitig ein Consent-Banner eingeführt, dieser Abschnitt beschreibt dann genau, was geladen wird, und nichts läuft, bevor Sie zugestimmt haben.",
          },
        ],
      },
      {
        id: "fonts",
        heading: "Schriftarten",
        blocks: [
          {
            kind: "text",
            value:
              "Die hier verwendeten Schriften werden von der eigenen Domain dieser Website ausgeliefert. Beim Seitenaufruf wird keine Verbindung zu Google Fonts oder einem anderen Schriftdienst hergestellt und es werden keine Daten an einen Schriftanbieter übermittelt.",
          },
        ],
      },
      {
        id: "rights",
        heading: "Ihre Rechte",
        blocks: [
          { kind: "text", value: "Nach der DSGVO haben Sie das Recht auf:" },
          {
            kind: "list",
            items: [
              "Auskunft — welche Daten wir über Sie verarbeiten (Art. 15)",
              "Berichtigung — unrichtige Daten korrigieren zu lassen (Art. 16)",
              "Löschung — Ihre Daten löschen zu lassen (Art. 17)",
              "Einschränkung — die Verarbeitung einschränken zu lassen (Art. 18)",
              "Datenübertragbarkeit — Ihre Daten maschinenlesbar zu erhalten (Art. 20)",
              "Widerspruch — gegen Verarbeitungen auf Basis berechtigter Interessen (Art. 21)",
              "Widerruf — eine Einwilligung jederzeit mit Wirkung für die Zukunft zu widerrufen (Art. 7 Abs. 3)",
            ],
          },
          {
            kind: "text",
            value: `Zur Ausübung genügt eine Nachricht an ${legalValue("dataProtectionContact")}. Wir antworten innerhalb eines Monats.`,
          },
          {
            kind: "text",
            value:
              "Ihnen steht außerdem ein Beschwerderecht bei einer Aufsichtsbehörde zu, insbesondere im Mitgliedstaat Ihres Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.",
          },
        ],
      },
      {
        id: "security",
        heading: "Sicherheit und Änderungen",
        blocks: [
          {
            kind: "text",
            value:
              'Diese Website wird über TLS ausgeliefert. Eine verschlüsselte Verbindung erkennen Sie am "https://" in der Adresszeile und am Schloss-Symbol daneben.',
          },
          {
            kind: "text",
            value:
              "Diese Erklärung wird aktualisiert, sobald sich die Website in einer Weise ändert, die die Datenverarbeitung betrifft. Das neben dem Inhaltsverzeichnis genannte Datum ist das Datum der aktuellen Fassung.",
          },
        ],
      },
    ],
  };

  return chapters[locale];
}

/* ------------------------------------------------------------------ *
 * Terms and conditions / AGB
 * ------------------------------------------------------------------ */

export function termsChapters(locale: Locale): LegalChapter[] {
  const chapters: Chapters = {
    en: [
      {
        id: "scope",
        heading: "Scope",
        blocks: [
          {
            kind: "text",
            value: `These terms govern all contracts between ${contractingParty.en} and its clients concerning marketing, design, content and related services.`,
          },
          {
            kind: "text",
            value:
              "A client's own general terms and conditions do not apply, even where they are referred to in an order and not expressly contradicted.",
          },
        ],
      },
      {
        id: "formation",
        heading: "Quotes and formation of contract",
        blocks: [
          {
            kind: "text",
            value:
              "Prices published on this website are starting points for a defined scope, not binding offers. A contract comes into existence when AMPLIQ issues a written quote for a specific scope and the client accepts it in text form, or when AMPLIQ begins work at the client's request.",
          },
          {
            kind: "text",
            value:
              "The written quote defines the scope. Work beyond it is agreed and priced separately before it begins.",
          },
        ],
      },
      {
        id: "prices",
        heading: "Prices and payment",
        blocks: [
          {
            kind: "text",
            value:
              "All prices are net and exclude value added tax at the applicable statutory rate, unless the small business regulation under § 19 UStG applies, in which case no VAT is charged.",
          },
          {
            kind: "list",
            items: [
              "Single projects: 50% on commissioning, the remainder on delivery.",
              "Ongoing engagements: invoiced monthly in advance.",
              "Invoices are payable within 14 days of the invoice date without deduction.",
            ],
          },
          {
            kind: "text",
            value:
              "Third-party costs — stock licences, advertising budgets, hosting, print production — are passed on at cost and agreed in advance.",
          },
        ],
      },
      {
        id: "cooperation",
        heading: "The client's cooperation",
        blocks: [
          {
            kind: "text",
            value:
              "Delivery depends on the client supplying what the work needs: content, access, brand assets, approvals and a named contact who can make decisions.",
          },
          {
            kind: "text",
            value:
              "Where an agreed date passes without the material or feedback needed, timelines move accordingly. The client warrants that any material it supplies may lawfully be used for the agreed purpose.",
          },
        ],
      },
      {
        id: "delivery",
        heading: "Deadlines and delivery",
        blocks: [
          {
            kind: "text",
            value:
              "Dates are binding only where they have been agreed in writing as such. Delays caused by circumstances outside AMPLIQ's control extend the timeline by the duration of the disruption.",
          },
          {
            kind: "text",
            value:
              "Deliverables are handed over in the formats agreed in the quote. Two rounds of revision are included in each defined scope unless the quote says otherwise; further rounds are billed at the agreed rate.",
          },
        ],
      },
      {
        id: "rights",
        heading: "Rights of use",
        blocks: [
          {
            kind: "text",
            value:
              "On full payment, the client receives the rights of use to the delivered results agreed in the quote — as a rule a simple, spatially and temporally unlimited right for the agreed purpose.",
          },
          {
            kind: "text",
            value:
              "Drafts and concepts not selected remain with AMPLIQ. Third-party rights — fonts, stock imagery, software licences — are governed by their own terms and pass to the client only to the extent those licences allow.",
          },
          {
            kind: "text",
            value:
              "AMPLIQ may name the client as a reference and show the delivered work for its own presentation purposes, unless the client objects in text form.",
          },
        ],
      },
      {
        id: "confidentiality",
        heading: "Confidentiality",
        blocks: [
          {
            kind: "text",
            value:
              "Both parties keep confidential all business information that becomes known to them in the course of the engagement and is not publicly available. This obligation survives the end of the contract.",
          },
        ],
      },
      {
        id: "warranty",
        heading: "Warranty and liability",
        blocks: [
          {
            kind: "text",
            value:
              "Defects are to be reported in text form without undue delay. AMPLIQ will remedy them within a reasonable period; where remedy fails twice, the client may reduce the fee or withdraw from the affected part of the contract.",
          },
          {
            kind: "text",
            value:
              "AMPLIQ is liable without limitation for injury to life, body or health, for intent and gross negligence, and under the Product Liability Act. In cases of slight negligence, liability arises only from the breach of an essential contractual obligation and is limited to the foreseeable damage typical of this kind of contract.",
          },
          {
            kind: "text",
            value:
              "Marketing outcomes depend on markets, competitors and platforms outside AMPLIQ's control. No particular commercial result — ranking, reach, leads or revenue — is owed unless it has been expressly agreed in writing as a performance obligation.",
          },
        ],
      },
      {
        id: "term",
        heading: "Term and termination",
        blocks: [
          {
            kind: "text",
            value:
              "Single projects end on delivery and acceptance. Ongoing engagements run monthly and may be terminated by either party in text form with 30 days' notice to the end of a month, unless the quote agrees a different term.",
          },
          {
            kind: "text",
            value:
              "The right to terminate for good cause remains unaffected. Work already performed is invoiced up to the effective date of termination.",
          },
        ],
      },
      {
        id: "law",
        heading: "Governing law and jurisdiction",
        blocks: [
          {
            kind: "text",
            value:
              "German law applies, excluding the UN Convention on Contracts for the International Sale of Goods.",
          },
          {
            kind: "text",
            value: `Where the client is a merchant, a legal entity under public law or a special fund under public law, the place of jurisdiction is ${legalValue("city")}.`,
          },
          {
            kind: "text",
            value:
              "Should any provision be or become invalid, the validity of the remaining provisions is unaffected.",
          },
        ],
      },
    ],

    de: [
      {
        id: "scope",
        heading: "Geltungsbereich",
        blocks: [
          {
            kind: "text",
            value: `Diese Bedingungen gelten für alle Verträge zwischen ${contractingParty.de} und ihren Kundinnen und Kunden über Marketing-, Design-, Content- und damit verbundene Leistungen.`,
          },
          {
            kind: "text",
            value:
              "Abweichende Allgemeine Geschäftsbedingungen des Kunden gelten nicht, auch wenn in einer Bestellung auf sie verwiesen wird und ihnen nicht ausdrücklich widersprochen wurde.",
          },
        ],
      },
      {
        id: "formation",
        heading: "Angebote und Vertragsschluss",
        blocks: [
          {
            kind: "text",
            value:
              "Auf dieser Website veröffentlichte Preise sind Startpunkte für einen definierten Umfang, keine bindenden Angebote. Ein Vertrag kommt zustande, wenn AMPLIQ ein schriftliches Angebot über einen konkreten Umfang abgibt und der Kunde es in Textform annimmt, oder wenn AMPLIQ auf Wunsch des Kunden mit der Arbeit beginnt.",
          },
          {
            kind: "text",
            value:
              "Der Leistungsumfang ergibt sich aus dem schriftlichen Angebot. Darüber hinausgehende Leistungen werden vor Beginn gesondert vereinbart und kalkuliert.",
          },
        ],
      },
      {
        id: "prices",
        heading: "Preise und Zahlung",
        blocks: [
          {
            kind: "text",
            value:
              "Alle Preise verstehen sich netto zuzüglich der jeweils geltenden gesetzlichen Umsatzsteuer, sofern nicht die Kleinunternehmerregelung nach § 19 UStG angewendet wird; in diesem Fall wird keine Umsatzsteuer berechnet.",
          },
          {
            kind: "list",
            items: [
              "Einzelprojekte: 50 % bei Beauftragung, der Rest bei Lieferung.",
              "Laufende Zusammenarbeit: monatliche Abrechnung im Voraus.",
              "Rechnungen sind innerhalb von 14 Tagen ab Rechnungsdatum ohne Abzug zahlbar.",
            ],
          },
          {
            kind: "text",
            value:
              "Fremdkosten — Stock-Lizenzen, Werbebudgets, Hosting, Druckproduktion — werden zum Selbstkostenpreis weitergegeben und vorab abgestimmt.",
          },
        ],
      },
      {
        id: "cooperation",
        heading: "Mitwirkung des Kunden",
        blocks: [
          {
            kind: "text",
            value:
              "Die Leistungserbringung setzt voraus, dass der Kunde bereitstellt, was die Arbeit benötigt: Inhalte, Zugänge, Markenmaterialien, Freigaben und eine benannte entscheidungsbefugte Ansprechperson.",
          },
          {
            kind: "text",
            value:
              "Verstreicht ein vereinbarter Termin ohne die erforderlichen Materialien oder Rückmeldungen, verschieben sich die Zeitpläne entsprechend. Der Kunde sichert zu, dass von ihm überlassene Materialien für den vereinbarten Zweck rechtmäßig genutzt werden dürfen.",
          },
        ],
      },
      {
        id: "delivery",
        heading: "Termine und Lieferung",
        blocks: [
          {
            kind: "text",
            value:
              "Termine sind nur verbindlich, soweit sie ausdrücklich schriftlich als verbindlich vereinbart wurden. Verzögerungen aus Umständen außerhalb des Einflussbereichs von AMPLIQ verlängern die Fristen um die Dauer der Störung.",
          },
          {
            kind: "text",
            value:
              "Die Übergabe erfolgt in den im Angebot vereinbarten Formaten. In jedem definierten Umfang sind zwei Korrekturschleifen enthalten, sofern das Angebot nichts anderes vorsieht; weitere Schleifen werden zum vereinbarten Satz abgerechnet.",
          },
        ],
      },
      {
        id: "rights",
        heading: "Nutzungsrechte",
        blocks: [
          {
            kind: "text",
            value:
              "Mit vollständiger Bezahlung erhält der Kunde die im Angebot vereinbarten Nutzungsrechte an den gelieferten Ergebnissen — in der Regel ein einfaches, räumlich und zeitlich unbeschränktes Recht für den vereinbarten Zweck.",
          },
          {
            kind: "text",
            value:
              "Nicht ausgewählte Entwürfe und Konzepte verbleiben bei AMPLIQ. Rechte Dritter — Schriften, Stock-Material, Softwarelizenzen — richten sich nach deren eigenen Bedingungen und gehen nur in dem Umfang über, den diese Lizenzen zulassen.",
          },
          {
            kind: "text",
            value:
              "AMPLIQ darf den Kunden als Referenz nennen und die gelieferten Arbeiten zu eigenen Präsentationszwecken zeigen, sofern der Kunde dem nicht in Textform widerspricht.",
          },
        ],
      },
      {
        id: "confidentiality",
        heading: "Vertraulichkeit",
        blocks: [
          {
            kind: "text",
            value:
              "Beide Seiten behandeln alle geschäftlichen Informationen vertraulich, die ihnen im Rahmen der Zusammenarbeit bekannt werden und nicht öffentlich zugänglich sind. Diese Pflicht besteht über das Vertragsende hinaus fort.",
          },
        ],
      },
      {
        id: "warranty",
        heading: "Gewährleistung und Haftung",
        blocks: [
          {
            kind: "text",
            value:
              "Mängel sind unverzüglich in Textform anzuzeigen. AMPLIQ beseitigt sie innerhalb angemessener Frist; schlägt die Nacherfüllung zweimal fehl, kann der Kunde das Honorar mindern oder vom betroffenen Vertragsteil zurücktreten.",
          },
          {
            kind: "text",
            value:
              "AMPLIQ haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, bei Vorsatz und grober Fahrlässigkeit sowie nach dem Produkthaftungsgesetz. Bei leichter Fahrlässigkeit besteht eine Haftung nur bei Verletzung einer wesentlichen Vertragspflicht und ist auf den vertragstypischen, vorhersehbaren Schaden begrenzt.",
          },
          {
            kind: "text",
            value:
              "Marketingergebnisse hängen von Märkten, Wettbewerb und Plattformen ab, die AMPLIQ nicht steuern kann. Ein bestimmter wirtschaftlicher Erfolg — Ranking, Reichweite, Anfragen oder Umsatz — wird nicht geschuldet, sofern er nicht ausdrücklich schriftlich als Leistungspflicht vereinbart wurde.",
          },
        ],
      },
      {
        id: "term",
        heading: "Laufzeit und Kündigung",
        blocks: [
          {
            kind: "text",
            value:
              "Einzelprojekte enden mit Lieferung und Abnahme. Laufende Zusammenarbeit läuft monatlich und kann von beiden Seiten in Textform mit einer Frist von 30 Tagen zum Monatsende gekündigt werden, sofern das Angebot keine andere Laufzeit vorsieht.",
          },
          {
            kind: "text",
            value:
              "Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt. Bereits erbrachte Leistungen werden bis zum Wirksamwerden der Kündigung abgerechnet.",
          },
        ],
      },
      {
        id: "law",
        heading: "Anwendbares Recht und Gerichtsstand",
        blocks: [
          {
            kind: "text",
            value: "Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.",
          },
          {
            kind: "text",
            value: `Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen, ist Gerichtsstand ${legalValue("city")}.`,
          },
          {
            kind: "text",
            value:
              "Sollte eine Bestimmung unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.",
          },
        ],
      },
    ],
  };

  return chapters[locale];
}

/* ------------------------------------------------------------------ *
 * Cancellation notice / Widerrufsbelehrung
 * ------------------------------------------------------------------ */

export function cancellationChapters(locale: Locale): LegalChapter[] {
  // The full postal address once it is supplied, and the name and email
  // address until then — see `noticeAddress`. Either way the reader is given a
  // route that actually reaches us, which is what §§ 355/356 BGB are asking
  // this notice to do.
  const address = noticeAddress();

  const chapters: Chapters = {
    en: [
      {
        id: "who",
        heading: "Who this applies to",
        blocks: [
          {
            kind: "text",
            value:
              "This notice applies to consumers within the meaning of § 13 BGB — a natural person entering into a contract for purposes outside their trade, business or profession.",
          },
          {
            kind: "text",
            value:
              "It does not apply to contracts with businesses. Most AMPLIQ engagements are business-to-business, in which case there is no statutory right of withdrawal.",
          },
        ],
      },
      {
        id: "right",
        heading: "Right of withdrawal",
        blocks: [
          {
            kind: "text",
            value:
              "You have the right to withdraw from this contract within 14 days without giving any reason. The withdrawal period is 14 days from the day the contract was concluded.",
          },
          {
            kind: "text",
            value: `To exercise your right of withdrawal, you must inform us — ${address} — by means of a clear statement (for example a letter sent by post or an email) of your decision to withdraw from this contract. You may use the model withdrawal form below, but it is not obligatory.`,
          },
          {
            kind: "text",
            value:
              "To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.",
          },
        ],
      },
      {
        id: "effects",
        heading: "Effects of withdrawal",
        blocks: [
          {
            kind: "text",
            value:
              "If you withdraw from this contract, we shall reimburse to you all payments received from you without undue delay and in any event not later than 14 days from the day on which we are informed about your decision to withdraw. We will use the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in no event will you be charged any fees for such reimbursement.",
          },
          {
            kind: "text",
            value:
              "If you requested that the services begin during the withdrawal period, you shall pay us an amount which is in proportion to what has been provided until you communicated your withdrawal, in comparison with the full coverage of the contract.",
          },
        ],
      },
      {
        id: "expiry",
        heading: "Early expiry of the right of withdrawal",
        blocks: [
          {
            kind: "text",
            value:
              "The right of withdrawal expires early in the case of a contract for services where we have fully performed the service, and performance began only after you gave your express consent and simultaneously acknowledged that you would lose your right of withdrawal on complete performance (§ 356 (4) BGB).",
          },
          {
            kind: "text",
            value:
              "For digital content not supplied on a physical medium, the right of withdrawal expires where performance has begun after you gave your express consent and acknowledged that you thereby lose your right of withdrawal (§ 356 (5) BGB).",
          },
        ],
      },
      {
        id: "form",
        heading: "Model withdrawal form",
        blocks: [
          {
            kind: "text",
            value:
              "If you wish to withdraw from the contract, you may fill in and return this form. Completing it is not obligatory.",
          },
          {
            kind: "list",
            items: [
              `To: ${address}`,
              "I/We hereby give notice that I/we withdraw from my/our contract for the provision of the following service:",
              "Ordered on / received on:",
              "Name of consumer(s):",
              "Address of consumer(s):",
              "Signature of consumer(s) (only if this form is notified on paper):",
              "Date:",
            ],
          },
        ],
      },
    ],

    de: [
      {
        id: "who",
        heading: "Für wen diese Belehrung gilt",
        blocks: [
          {
            kind: "text",
            value:
              "Diese Belehrung gilt für Verbraucher im Sinne des § 13 BGB — natürliche Personen, die ein Rechtsgeschäft zu Zwecken abschließen, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können.",
          },
          {
            kind: "text",
            value:
              "Für Verträge mit Unternehmern gilt sie nicht. Die meisten Projekte von AMPLIQ sind Geschäfte zwischen Unternehmen; in diesem Fall besteht kein gesetzliches Widerrufsrecht.",
          },
        ],
      },
      {
        id: "right",
        heading: "Widerrufsrecht",
        blocks: [
          {
            kind: "text",
            value:
              "Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.",
          },
          {
            kind: "text",
            value: `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns — ${address} — mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das untenstehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
          },
          {
            kind: "text",
            value:
              "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
          },
        ],
      },
      {
        id: "effects",
        heading: "Folgen des Widerrufs",
        blocks: [
          {
            kind: "text",
            value:
              "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
          },
          {
            kind: "text",
            value:
              "Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.",
          },
        ],
      },
      {
        id: "expiry",
        heading: "Vorzeitiges Erlöschen des Widerrufsrechts",
        blocks: [
          {
            kind: "text",
            value:
              "Das Widerrufsrecht erlischt bei einem Vertrag über die Erbringung von Dienstleistungen vorzeitig, wenn wir die Dienstleistung vollständig erbracht haben und mit der Ausführung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung gegeben und gleichzeitig Ihre Kenntnis davon bestätigt haben, dass Sie Ihr Widerrufsrecht bei vollständiger Vertragserfüllung verlieren (§ 356 Abs. 4 BGB).",
          },
          {
            kind: "text",
            value:
              "Bei digitalen Inhalten, die nicht auf einem körperlichen Datenträger geliefert werden, erlischt das Widerrufsrecht, wenn mit der Ausführung begonnen wurde, nachdem Sie ausdrücklich zugestimmt und Ihre Kenntnis vom Verlust des Widerrufsrechts bestätigt haben (§ 356 Abs. 5 BGB).",
          },
        ],
      },
      {
        id: "form",
        heading: "Muster-Widerrufsformular",
        blocks: [
          {
            kind: "text",
            value:
              "Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular ausfüllen und zurücksenden. Die Verwendung ist nicht vorgeschrieben.",
          },
          {
            kind: "list",
            items: [
              `An: ${address}`,
              "Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:",
              "Bestellt am / erhalten am:",
              "Name des/der Verbraucher(s):",
              "Anschrift des/der Verbraucher(s):",
              "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):",
              "Datum:",
            ],
          },
        ],
      },
    ],
  };

  return chapters[locale];
}

/* ------------------------------------------------------------------ *
 * Cookie policy
 * ------------------------------------------------------------------ */

export function cookieChapters(locale: Locale): LegalChapter[] {
  const chapters: Chapters = {
    en: [
      {
        id: "summary",
        heading: "The short version",
        blocks: [
          {
            kind: "text",
            value: `${domain} sets no advertising cookies, no analytics cookies and no tracking pixels. There is no consent banner because there is nothing to consent to.`,
          },
          {
            kind: "text",
            value:
              "One functional cookie exists, and only if you actively switch language. Everything else this site does — the booking calendar included — works without storing anything on your device beyond that.",
          },
        ],
      },
      {
        id: "what-is-set",
        heading: "What is actually set",
        blocks: [
          {
            kind: "rows",
            rows: [
              { label: "Name", value: "ampliq_locale" },
              { label: "Set when", value: "You switch between English and German" },
              { label: "Purpose", value: "Opens the site in the language you chose" },
              { label: "Duration", value: "12 months" },
              { label: "Category", value: "Strictly necessary (functional)" },
              { label: "Shared with", value: "Nobody — it never leaves this site" },
            ],
          },
          {
            kind: "text",
            value:
              "Because it is required to provide a function you asked for, no consent is needed under § 25 (2) TDDDG.",
          },
        ],
      },
      {
        id: "not-set",
        heading: "What is not set",
        blocks: [
          {
            kind: "list",
            items: [
              "No Google Analytics, and no Google Tag Manager",
              "No Meta Pixel and no LinkedIn Insight Tag",
              "No advertising, remarketing or conversion cookies",
              "No third-party fonts — the typefaces are served from this domain",
              "No embedded videos or maps that would load a third party on arrival",
            ],
          },
        ],
      },
      {
        id: "control",
        heading: "Your control",
        blocks: [
          {
            kind: "text",
            value:
              "You can delete the language cookie at any time in your browser settings, or block cookies for this site entirely. The site continues to work; it will simply open in the language your browser asks for rather than the one you last chose.",
          },
          {
            kind: "text",
            value:
              "If analytics or advertising tools are ever added, a consent banner will be introduced at the same time, nothing will load before you agree, and this page will list exactly what changed.",
          },
        ],
      },
    ],

    de: [
      {
        id: "summary",
        heading: "Kurz gesagt",
        blocks: [
          {
            kind: "text",
            value: `${domain} setzt keine Werbe-Cookies, keine Analyse-Cookies und keine Tracking-Pixel. Es gibt kein Consent-Banner, weil es nichts einzuwilligen gibt.`,
          },
          {
            kind: "text",
            value:
              "Ein einziges funktionales Cookie existiert, und zwar nur, wenn Sie die Sprache aktiv umschalten. Alles andere auf dieser Website — auch der Buchungskalender — funktioniert, ohne darüber hinaus etwas auf Ihrem Gerät zu speichern.",
          },
        ],
      },
      {
        id: "what-is-set",
        heading: "Was tatsächlich gesetzt wird",
        blocks: [
          {
            kind: "rows",
            rows: [
              { label: "Name", value: "ampliq_locale" },
              { label: "Wird gesetzt", value: "Beim Wechsel zwischen Englisch und Deutsch" },
              { label: "Zweck", value: "Öffnet die Website in der gewählten Sprache" },
              { label: "Dauer", value: "12 Monate" },
              { label: "Kategorie", value: "Technisch notwendig (funktional)" },
              { label: "Weitergabe", value: "Keine — es verlässt diese Website nie" },
            ],
          },
          {
            kind: "text",
            value:
              "Da es für eine von Ihnen gewünschte Funktion erforderlich ist, ist nach § 25 Abs. 2 TDDDG keine Einwilligung nötig.",
          },
        ],
      },
      {
        id: "not-set",
        heading: "Was nicht gesetzt wird",
        blocks: [
          {
            kind: "list",
            items: [
              "Kein Google Analytics und kein Google Tag Manager",
              "Kein Meta-Pixel und kein LinkedIn Insight Tag",
              "Keine Werbe-, Remarketing- oder Conversion-Cookies",
              "Keine Drittanbieter-Schriften — die Schriften kommen von dieser Domain",
              "Keine eingebetteten Videos oder Karten, die beim Aufruf Dritte laden würden",
            ],
          },
        ],
      },
      {
        id: "control",
        heading: "Ihre Kontrolle",
        blocks: [
          {
            kind: "text",
            value:
              "Sie können das Sprach-Cookie jederzeit in Ihren Browsereinstellungen löschen oder Cookies für diese Website vollständig blockieren. Die Website funktioniert weiterhin; sie öffnet dann in der von Ihrem Browser angefragten Sprache statt in der zuletzt gewählten.",
          },
          {
            kind: "text",
            value:
              "Sollten künftig Analyse- oder Werbetools ergänzt werden, wird gleichzeitig ein Consent-Banner eingeführt, es lädt nichts vor Ihrer Zustimmung, und diese Seite listet genau auf, was sich geändert hat.",
          },
        ],
      },
    ],
  };

  return chapters[locale];
}
