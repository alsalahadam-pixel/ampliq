import type { Pillar, PillarKey } from "@/content/types";

/**
 * The three layers of the AMPLIQ system. Everything else on the site —
 * services, packages, navigation — hangs off these keys.
 */
export const pillars: Pillar[] = [
  {
    key: "build",
    index: 1,
    label: "Build",
    title: {
      en: "The foundation",
      de: "Das Fundament",
    },
    body: {
      en: "Websites and digital experiences that hold up: a clear structure, pages that load fast, and a path to contact that a real buyer will actually take.",
      de: "Websites und digitale Auftritte, die tragen: klare Struktur, schnelle Seiten und ein Weg zur Anfrage, den echte Interessenten auch gehen.",
    },
    disciplines: {
      en: [
        "Web design",
        "Website redesign",
        "Landing pages",
        "UX/UI",
        "Conversion optimisation",
      ],
      de: [
        "Webdesign",
        "Website-Redesign",
        "Landingpages",
        "UX/UI",
        "Conversion-Optimierung",
      ],
    },
  },
  {
    key: "create",
    index: 2,
    label: "Create",
    title: {
      en: "The substance",
      de: "Die Substanz",
    },
    body: {
      en: "Identity, design and content that make you look like the company you already are — consistent everywhere, produced to a standard you can keep using for years.",
      de: "Identität, Design und Content, die zeigen, welches Unternehmen Sie längst sind — überall konsistent und in einer Qualität, die Jahre hält.",
    },
    disciplines: {
      en: [
        "Branding",
        "Visual identity",
        "Graphic design",
        "Photography",
        "Video",
        "Social content",
      ],
      de: [
        "Branding",
        "Visual Identity",
        "Grafikdesign",
        "Fotografie",
        "Video",
        "Social Content",
      ],
    },
  },
  {
    key: "grow",
    index: 3,
    label: "Grow",
    title: {
      en: "The reach",
      de: "Die Reichweite",
    },
    body: {
      en: "Visibility that compounds: search, paid social and campaigns built on top of the brand and the site — not bolted onto them afterwards.",
      de: "Sichtbarkeit, die sich aufbaut: Suche, Paid Social und Kampagnen, die auf Marke und Website aufsetzen — statt nachträglich drangeschraubt zu werden.",
    },
    disciplines: {
      en: [
        "SEO",
        "Meta Ads",
        "Social media marketing",
        "Lead generation",
        "Campaign strategy",
      ],
      de: [
        "SEO",
        "Meta Ads",
        "Social-Media-Marketing",
        "Leadgenerierung",
        "Kampagnenstrategie",
      ],
    },
  },
];

export const pillarByKey = Object.fromEntries(
  pillars.map((pillar) => [pillar.key, pillar]),
) as Record<PillarKey, Pillar>;
