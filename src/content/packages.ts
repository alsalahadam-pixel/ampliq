import type { PackageTier } from "@/content/types";

/**
 * Entry points, not fixed menus. Prices are explicitly a starting figure —
 * nothing here promises a complex project for the headline number.
 */
export const packages: PackageTier[] = [
  {
    slug: "start",
    index: 1,
    name: "Start",
    price: { en: "€500", de: "500 €" },
    priceKind: "from",
    positioning: {
      en: "A credible foundation.",
      de: "Ein glaubwürdiges Fundament.",
    },
    forWho: {
      en: "Businesses that need to look professional and be findable — quickly, and without committing to a long programme.",
      de: "Unternehmen, die professionell wirken und gefunden werden wollen — schnell und ohne langfristige Bindung.",
    },
    solves: {
      en: "You're losing enquiries before the first conversation because what people find online doesn't match the business they'd meet in person.",
      de: "Anfragen gehen verloren, bevor das erste Gespräch stattfindet — weil das, was online zu finden ist, nicht zu dem Unternehmen passt, das man persönlich erlebt.",
    },
    includes: {
      en: [
        "A focused website or landing page",
        "Brand essentials: logo usage, colour, type",
        "Core visual assets for web and social",
        "Technical SEO setup and search console",
        "Social profile optimisation",
        "Handover with a short editing guide",
      ],
      de: [
        "Eine fokussierte Website oder Landingpage",
        "Marken-Basics: Logoanwendung, Farbe, Typografie",
        "Kern-Assets für Web und Social",
        "Technisches SEO-Setup und Search Console",
        "Optimierung der Social-Profile",
        "Übergabe mit kurzer Redaktionsanleitung",
      ],
    },
    scope: {
      en: "Typically two to four weeks, one round of structured feedback per stage.",
      de: "In der Regel zwei bis vier Wochen, pro Phase eine strukturierte Feedbackrunde.",
    },
    engagement: {
      en: "A single project with a fixed quote agreed before we start.",
      de: "Ein einmaliges Projekt mit Festpreis, der vor Beginn vereinbart wird.",
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
      en: "Consistent marketing, not campaigns in isolation.",
      de: "Durchgängiges Marketing statt einzelner Kampagnen.",
    },
    forWho: {
      en: "Companies that already have customers and now need visibility, consistency and a steady flow of material.",
      de: "Unternehmen mit bestehendem Geschäft, die jetzt Sichtbarkeit, Konsistenz und einen verlässlichen Materialfluss brauchen.",
    },
    solves: {
      en: "Marketing happens in bursts. Something goes out when someone finds time, nothing connects, and the results are impossible to read.",
      de: "Marketing passiert schubweise. Es geht etwas raus, wenn jemand Zeit findet, nichts greift ineinander, und die Ergebnisse sind nicht lesbar.",
    },
    includes: {
      en: [
        "Website or redesign as the foundation",
        "Ongoing SEO and content",
        "Social media management and production",
        "Graphic design for the formats you produce",
        "Photography and short-form video",
        "Meta Ads where they earn their budget",
      ],
      de: [
        "Website oder Redesign als Fundament",
        "Laufendes SEO und Content",
        "Social-Media-Betreuung und Produktion",
        "Grafikdesign für Ihre wiederkehrenden Formate",
        "Fotografie und Short-Form-Video",
        "Meta Ads, wo sie ihr Budget verdienen",
      ],
    },
    scope: {
      en: "A monthly engagement with an agreed scope, reviewed every quarter.",
      de: "Monatliche Zusammenarbeit mit vereinbartem Umfang, vierteljährlich überprüft.",
    },
    engagement: {
      en: "Rolling, cancellable, with a clear list of what's included each month.",
      de: "Laufend, kündbar, mit klarer monatlicher Leistungsübersicht.",
    },
  },
  {
    slug: "scale",
    index: 3,
    name: "Scale",
    price: { en: "Custom", de: "Individuell" },
    priceKind: "custom",
    positioning: {
      en: "AMPLIQ as your marketing department.",
      de: "AMPLIQ als Ihre Marketingabteilung.",
    },
    forWho: {
      en: "Established companies that want a long-term partner rather than a series of separate projects.",
      de: "Etablierte Unternehmen, die einen langfristigen Partner wollen statt einer Reihe einzelner Projekte.",
    },
    solves: {
      en: "The business is growing faster than the marketing behind it, and coordinating five freelancers has become its own job.",
      de: "Das Unternehmen wächst schneller als das Marketing dahinter — und die Koordination von fünf Freelancern ist selbst zur Aufgabe geworden.",
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
