import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Disc } from "@/components/brand/logo";
import { Principles } from "@/components/home/principles";
import { PageHero } from "@/components/layout/page-hero";
import { FinalCta } from "@/components/sections/final-cta";
import { ProcessRail } from "@/components/sections/process-rail";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, locales } from "@/lib/i18n";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { pad } from "@/lib/utils";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = {
    en: {
      title: "About",
      description:
        "AMPLIQ is a marketing and creative agency combining strategy, design, content and digital growth for companies in Germany and across Europe.",
    },
    de: {
      title: "Über uns",
      description:
        "AMPLIQ ist eine Marketing- und Kreativagentur für Unternehmen in Deutschland und Europa: Strategie, Design, Content und digitales Wachstum aus einer Hand.",
    },
  }[lang];

  return buildMetadata({ locale: lang, path: "/about", ...copy });
}

/**
 * Page copy lives here rather than in the shared dictionary: it is long-form,
 * used once, and easier to edit next to the page it belongs to.
 *
 * Nothing here claims a team size, a founding year, an office, an award or a
 * client count. The page earns its credibility from how the work is described,
 * not from numbers that cannot be backed up.
 */
const about = {
  en: {
    statement: "One team for the brand, the website and the growth.",
    paragraphs: [
      "AMPLIQ is a marketing and creative agency working with companies in Germany and across Europe. Strategy, design, content and digital growth sit in one place — because the brand, the website and the campaigns answer the same question, and they stop working when they are bought separately.",
      "Every engagement opens with the commercial question rather than the creative one: what does this business need to happen next? The answer sets the priorities, the scope and the order the work runs in, before anything is designed.",
      "You work directly with the people doing the work. Scope and price are agreed in writing before we start, and everything produced is handed over in editable formats and belongs to you.",
    ],
    notTitle: "What AMPLIQ is not",
    notLead:
      "Useful to say plainly, because each of these describes a real kind of agency you could hire instead — and sometimes should.",
    not: [
      {
        label: "Not the cheapest option",
        body: "There is always someone cheaper. If price is the deciding factor, a template and a freelancer will serve you better than we will.",
      },
      {
        label: "Not a single-channel shop",
        body: "We are not an SEO agency or a social agency. Channels are treated as parts of one system, which is also why we will tell you when a channel is not worth running.",
      },
      {
        label: "Not a web studio in disguise",
        body: "Websites are where a lot of projects start, but the site is a means to an end. If the brand underneath it is the actual problem, that is what we fix first.",
      },
      {
        label: "Not a consultancy",
        body: "We produce the work. Strategy that ends in a document and an invoice is not what we are for.",
      },
      {
        label: "Not a '360°' agency",
        body: "Nobody is excellent at everything. We do brand, web, content and paid social properly, and bring in specialists where a project genuinely needs them.",
      },
    ],
    workingTitle: "How working together actually goes",
    working: [
      {
        title: "Scope and price in writing",
        body: "Before anything starts you get a defined scope and a fixed figure. If the scope changes, we quote the change rather than quietly absorbing it into the invoice.",
      },
      {
        title: "You own everything",
        body: "Source files, accounts, domains, ad accounts, photography — all of it is yours, handed over in editable formats. Nothing is held as leverage.",
      },
      {
        title: "One point of contact",
        body: "You talk to the person doing the work. Questions get answered the same week, and status is something you can ask about at any time.",
      },
      {
        title: "Honest reporting",
        body: "We report against enquiries and revenue where we can measure them, not against impressions. When something is not working, you hear it from us first.",
      },
    ],
  },
  de: {
    statement: "Ein Team für Marke, Website und Wachstum.",
    paragraphs: [
      "AMPLIQ ist eine Marketing- und Kreativagentur für Unternehmen in Deutschland und Europa. Strategie, Design, Content und digitales Wachstum kommen aus einer Hand — weil Marke, Website und Kampagnen dieselbe Frage beantworten und getrennt eingekauft aufhören zu wirken.",
      "Am Anfang steht die geschäftliche Frage, nicht die kreative: Was muss als Nächstes passieren? Die Antwort bestimmt Prioritäten, Umfang und Reihenfolge der Arbeit — bevor gestaltet wird.",
      "Sie arbeiten direkt mit den Menschen, die die Arbeit machen. Umfang und Preis stehen vor Projektbeginn schriftlich fest, und alles, was entsteht, wird in bearbeitbaren Formaten übergeben und gehört Ihnen.",
    ],
    notTitle: "Was AMPLIQ nicht ist",
    notLead:
      "Das gehört klar gesagt, denn jeder dieser Punkte beschreibt eine reale Alternative, die Sie beauftragen könnten — und manchmal sollten.",
    not: [
      {
        label: "Nicht die günstigste Option",
        body: "Es gibt immer jemanden, der günstiger ist. Wenn der Preis entscheidet, bringen Sie ein Template und ein Freelancer weiter als wir.",
      },
      {
        label: "Keine Ein-Kanal-Agentur",
        body: "Wir sind weder eine SEO- noch eine Social-Agentur. Kanäle sind Teile eines Systems — deshalb sagen wir auch, wenn sich ein Kanal nicht lohnt.",
      },
      {
        label: "Kein getarntes Webstudio",
        body: "Viele Projekte starten bei der Website, aber die Seite ist Mittel zum Zweck. Wenn die Marke darunter das eigentliche Problem ist, lösen wir zuerst das.",
      },
      {
        label: "Keine Beratung",
        body: "Wir produzieren die Arbeit. Strategie, die in einem Dokument und einer Rechnung endet, ist nicht unsere Aufgabe.",
      },
      {
        label: "Keine „360°“-Agentur",
        body: "Niemand ist in allem exzellent. Wir machen Marke, Web, Content und Paid Social richtig — und holen Spezialisten dazu, wenn ein Projekt sie wirklich braucht.",
      },
    ],
    workingTitle: "Wie die Zusammenarbeit tatsächlich läuft",
    working: [
      {
        title: "Umfang und Preis schriftlich",
        body: "Vor dem Start stehen ein definierter Umfang und eine feste Zahl. Ändert sich der Umfang, bekommen Sie ein Angebot für die Änderung — sie verschwindet nicht still in der Rechnung.",
      },
      {
        title: "Alles gehört Ihnen",
        body: "Quelldateien, Zugänge, Domains, Werbekonten, Fotos — alles gehört Ihnen und wird in bearbeitbaren Formaten übergeben. Nichts wird als Druckmittel zurückgehalten.",
      },
      {
        title: "Eine Ansprechperson",
        body: "Sie sprechen mit der Person, die arbeitet. Fragen werden in derselben Woche beantwortet, und nach dem Stand können Sie jederzeit fragen.",
      },
      {
        title: "Ehrliches Reporting",
        body: "Wir berichten an Anfragen und Umsatz, wo sie messbar sind — nicht an Impressionen. Wenn etwas nicht funktioniert, hören Sie es zuerst von uns.",
      },
    ],
  },
};

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const copy = about[lang];

  return (
    <>
      <PageHero eyebrow={dict.nav.about} title={dict.about.title} lead={dict.about.lead} />

      <Section tone="paper">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 data-reveal className="text-display-md max-w-[16ch]">
                {copy.statement}
              </h2>
              <Disc className="mt-10 hidden h-14 w-14 text-rule-strong lg:block" />
            </div>
            <div className="flex flex-col gap-6 lg:col-span-7">
              {copy.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
                  className="text-lead max-w-[58ch] text-graphite"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="ink" labelledBy="not-heading">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 id="not-heading" data-reveal className="text-display-md max-w-[14ch]">
                {copy.notTitle}
              </h2>
              <p data-reveal className="mt-6 max-w-[44ch] text-[0.9375rem] leading-relaxed text-fog">
                {copy.notLead}
              </p>
            </div>
            <ul className="lg:col-span-7">
              {copy.not.map((item, index) => (
                <li
                  key={item.label}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 70}ms` } as React.CSSProperties}
                  className="flex gap-5 border-t border-white/15 py-6 last:border-b sm:gap-8"
                >
                  <span className="font-mono text-[0.6875rem] leading-[1.9] tracking-[0.16em] text-fog">
                    {pad(index + 1)}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.1875rem] font-bold tracking-[-0.025em]">
                      {item.label}
                    </h3>
                    <p className="mt-2 max-w-[56ch] text-[0.9375rem] leading-relaxed text-fog">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="paper-soft" labelledBy="working-heading">
        <div className="shell">
          <h2 id="working-heading" data-reveal className="text-display-md max-w-[18ch]">
            {copy.workingTitle}
          </h2>
          <div className="mt-12 grid gap-x-16 gap-y-0 border-t border-rule-strong lg:grid-cols-2">
            {copy.working.map((item, index) => (
              <div
                key={item.title}
                data-reveal
                style={{ "--reveal-delay": `${(index % 2) * 80}ms` } as React.CSSProperties}
                className="border-b border-rule py-8"
              >
                <h3 className="font-display text-[1.25rem] font-bold tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-graphite">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Principles dict={dict} tone="paper" />

      <ProcessRail locale={lang} dict={dict} />

      <FinalCta locale={lang} dict={dict} />

      <JsonLd
        data={breadcrumbSchema(lang, [
          { name: "AMPLIQ", path: "" },
          { name: dict.about.title, path: "/about" },
        ])}
      />
    </>
  );
}
