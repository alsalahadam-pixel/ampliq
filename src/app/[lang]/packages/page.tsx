import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { PackagesSection } from "@/components/sections/packages-section";
import { ProcessRail } from "@/components/sections/process-rail";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqList } from "@/components/ui/faq";
import { Section } from "@/components/ui/section";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata, faqSchema } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/packages">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = {
    en: {
      title: "Packages",
      description:
        "Three starting points: START from €599 for one focused project, GROW from €1,199 for several connected areas, SCALE on a custom quote.",
    },
    de: {
      title: "Pakete",
      description:
        "Drei Einstiege: START ab 599 € für ein fokussiertes Projekt, GROW ab 1.199 € für mehrere Bereiche, SCALE als individuelles Angebot.",
    },
  }[lang];

  return buildMetadata({ locale: lang, path: "/packages", ...copy });
}

/** Pricing questions people ask before they enquire, answered plainly. */
const packageFaqs = {
  en: [
    {
      question: "Why 'from' prices instead of fixed ones?",
      answer:
        "Because a fixed price for unseen work is either padded to cover the worst case or too low to deliver properly. The figures here are honest starting points; after the first conversation you get a fixed quote for a defined scope, and that figure does not move unless you change the scope.",
    },
    {
      question: "What does a €599 project actually get me?",
      answer:
        "One focused project with one defined outcome — a landing page, a focused improvement to an existing site, a brand starter, or a campaign creative set. One of those, not all of them, and built to the same standard as everything else we produce. A full website, a complete brand system, photography and ongoing marketing are separate scopes; quoting all of them at that figure would mean cutting corners somewhere, and we would rather tell you what the work actually costs.",
    },
    {
      question: "Can we start small and grow later?",
      answer:
        "That is the normal path. Most clients start with the layer that is holding them back — usually the website — and add content or reach once that foundation is earning its keep.",
    },
    {
      question: "Are these prices net or gross?",
      answer:
        "Net. All figures exclude VAT, which is added where applicable.",
    },
    {
      question: "How is a monthly engagement billed?",
      answer:
        "Monthly in advance, against an agreed scope for that month. There is no long lock-in: you can end a rolling engagement with notice, and everything produced up to that point is yours.",
    },
  ],
  de: [
    {
      question: "Warum „ab“-Preise statt Festpreisen?",
      answer:
        "Weil ein Festpreis für ungesehene Arbeit entweder den schlimmsten Fall einkalkuliert oder zu niedrig ist, um sauber zu liefern. Die Zahlen hier sind ehrliche Startpunkte. Nach dem ersten Gespräch erhalten Sie einen Festpreis für einen definierten Umfang — und der ändert sich nur, wenn Sie den Umfang ändern.",
    },
    {
      question: "Was bekomme ich für 599 € tatsächlich?",
      answer:
        "Ein fokussiertes Projekt mit einem definierten Ergebnis — eine Landingpage, eine gezielte Verbesserung an der bestehenden Seite, eine Marken-Basis oder ein Creative-Set für einen Kanal. Eines davon, nicht alle, und in derselben Qualität wie alles andere. Eine vollständige Website, ein komplettes Markensystem, Fotografie und laufendes Marketing sind eigene Umfänge; alles zu diesem Preis anzubieten hieße, an irgendeiner Stelle zu sparen. Wir sagen Ihnen lieber, was die Arbeit wirklich kostet.",
    },
    {
      question: "Können wir klein starten und später ausbauen?",
      answer:
        "Das ist der Normalfall. Die meisten beginnen bei der Ebene, die sie ausbremst — meist die Website — und ergänzen Content oder Reichweite, sobald das Fundament trägt.",
    },
    {
      question: "Sind die Preise netto oder brutto?",
      answer:
        "Netto. Alle Beträge verstehen sich zzgl. der gesetzlichen Umsatzsteuer.",
    },
    {
      question: "Wie wird eine monatliche Zusammenarbeit abgerechnet?",
      answer:
        "Monatlich im Voraus, auf Basis des vereinbarten Umfangs für diesen Monat. Es gibt keine lange Bindung: Eine laufende Zusammenarbeit können Sie fristgerecht beenden, und alles bis dahin Erstellte gehört Ihnen.",
    },
  ],
};

export default async function PackagesPage({
  params,
}: PageProps<"/[lang]/packages">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const faqs = packageFaqs[lang];

  return (
    <>
      <PageHero
        eyebrow={dict.nav.packages}
        title={dict.packages.title}
        lead={dict.packages.lead}
      />

      <PackagesSection locale={lang} dict={dict} detailed withHeader={false} />

      <ProcessRail locale={lang} dict={dict} />

      <Section tone="paper" labelledBy="package-faq-heading">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2
              id="package-faq-heading"
              data-reveal
              className="text-display-md lg:col-span-4"
            >
              {dict.services.faqTitle}
            </h2>
            <div data-reveal className="lg:col-span-8">
              <FaqList items={faqs} />
            </div>
          </div>
        </div>
      </Section>

      <FinalCta locale={lang} dict={dict} />

      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumbSchema(lang, [
            { name: "AMPLIQ", path: "" },
            { name: dict.packages.title, path: "/packages" },
          ]),
        ]}
      />
    </>
  );
}
