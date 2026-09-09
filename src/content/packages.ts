import type { PackageTier } from "@/content/types";

/**
 * Entry points, not fixed menus.
 *
 * The headline figures are starting prices for a *scope*, never a promise of
 * everything below it. START in particular lists alternatives — one focused
 * engagement — rather than a bundle, so the entry price stays commercially
 * honest and the tier still reads as premium.
 */
export const packages: PackageTier[] = [
  {
    slug: "start",
    index: 1,
    name: "Start",
    price: { en: "€500", de: "500 €" },
    priceKind: "from",
    positioning: {
      en: "One thing, done properly.",
      de: "Eine Sache, richtig gemacht.",
    },
    forWho: {
      en: "Businesses that need one essential digital or creative upgrade — without committing to a longer programme.",
      de: "Unternehmen, die einen konkreten digitalen oder kreativen Baustein brauchen — ohne sich langfristig zu binden.",
    },
    solves: {
      en: "Something specific is holding the business back and you want it fixed to a professional standard, not patched.",
      de: "Ein konkreter Punkt bremst das Unternehmen aus — und der soll professionell gelöst werden, nicht geflickt.",
    },
    includesLabel: {
      en: "A START project is one of these",
      de: "Ein START-Projekt ist eines davon",
    },
    includes: {
      en: [
        "A landing page, designed and launched",
        "A focused improvement to an existing website",
        "Brand starter: logo usage, colour and type",
        "A campaign creative set for one channel",
        "A defined design package — deck, print or social templates",
      ],
      de: [
        "Eine Landingpage, gestaltet und live gebracht",
        "Eine gezielte Verbesserung an der bestehenden Website",
        "Marken-Basis: Logoanwendung, Farbe und Typografie",
        "Ein Creative-Set für einen Kanal",
        "Ein definiertes Designpaket — Präsentation, Print oder Social-Vorlagen",
      ],
    },
    scope: {
      en: "One clearly defined deliverable, agreed in writing. Typically two to four weeks.",
      de: "Ein klar definiertes Ergebnis, schriftlich vereinbart. In der Regel zwei bis vier Wochen.",
    },
    engagement: {
      en: "A single project, quoted individually before anything starts.",
      de: "Ein einzelnes Projekt, individuell kalkuliert, bevor die Arbeit beginnt.",
    },
  },
  {
    slug: "grow",
    index: 2,
    name: "Grow",
    price: { en: "€1,000", de: "1.000 €" },
    priceKind: "from",
    emphasis: true,
    positioning: {
      en: "Several areas, moving together.",
      de: "Mehrere Bereiche, die zusammenwirken.",
    },
    forWho: {
      en: "Companies ready to improve several connected areas at once, rather than one channel at a time.",
      de: "Unternehmen, die mehrere zusammenhängende Bereiche gleichzeitig verbessern wollen statt einen Kanal nach dem anderen.",
    },
    solves: {
      en: "Marketing happens in bursts. Something goes out when someone finds time, nothing connects, and the results are impossible to read.",
      de: "Marketing passiert schubweise. Es geht etwas raus, wenn jemand Zeit findet, nichts greift ineinander, und die Ergebnisse sind nicht lesbar.",
    },
    includesLabel: {
      en: "A GROW engagement combines several of",
      de: "Ein GROW-Projekt kombiniert mehrere davon",
    },
    includes: {
      en: [
        "Website or redesign as the foundation",
        "Creative and design across channels",
        "SEO foundations and content",
        "Social media production and management",
        "Photography and short-form video",
        "Selected advertising support",
      ],
      de: [
        "Website oder Redesign als Fundament",
        "Kreation und Design über alle Kanäle",
        "SEO-Grundlagen und Content",
        "Social-Media-Produktion und -Betreuung",
        "Fotografie und Short-Form-Video",
        "Ausgewählte Werbeunterstützung",
      ],
    },
    scope: {
      en: "Which areas, and how much of each, is set per engagement and reviewed every quarter.",
      de: "Welche Bereiche und in welchem Umfang, legen wir je Projekt fest und prüfen es vierteljährlich.",
    },
    engagement: {
      en: "Rolling monthly, cancellable, with a written scope for each month.",
      de: "Monatlich laufend, kündbar, mit schriftlichem Umfang für jeden Monat.",
    },
  },
  {
    slug: "scale",
    index: 3,
    name: "Scale",
    price: { en: "Custom", de: "Individuell" },
    priceKind: "custom",
    positioning: {
      en: "A marketing partner, not a series of projects.",
      de: "Ein Marketingpartner statt einzelner Projekte.",
    },
    forWho: {
      en: "Established companies that want marketing run as one continuous programme with a partner accountable for it.",
      de: "Etablierte Unternehmen, die Marketing als durchgängiges Programm führen wollen — mit einem Partner, der dafür geradesteht.",
    },
    solves: {
      en: "The business is growing faster than the marketing behind it, and coordinating five freelancers has become its own job.",
      de: "Das Unternehmen wächst schneller als das Marketing dahinter — und die Koordination von fünf Freelancern ist selbst zur Aufgabe geworden.",
    },
    includesLabel: {
      en: "Can include",
      de: "Kann umfassen",
    },
    includes: {
      en: [
        "Full brand and identity system",
        "Website and ongoing development",
        "SEO strategy and execution",
        "Social media and content production",
        "Photography and video on a planned cycle",
        "Meta Ads, lead generation and campaign strategy",
        "Quarterly planning and continuous optimisation",
      ],
      de: [
        "Vollständiges Marken- und Identitätssystem",
        "Website und laufende Weiterentwicklung",
        "SEO-Strategie und Umsetzung",
        "Social Media und Content-Produktion",
        "Fotografie und Video im geplanten Rhythmus",
        "Meta Ads, Leadgenerierung und Kampagnenstrategie",
        "Quartalsplanung und laufende Optimierung",
      ],
    },
    scope: {
      en: "Defined together and priced against the plan, not against a package.",
      de: "Gemeinsam definiert und auf Basis des Plans kalkuliert, nicht auf Basis eines Pakets.",
    },
    engagement: {
      en: "A long-term retainer with quarterly planning and named priorities.",
      de: "Langfristige Zusammenarbeit mit Quartalsplanung und benannten Prioritäten.",
    },
  },
];

export const packageBySlug = Object.fromEntries(
  packages.map((tier) => [tier.slug, tier]),
);
