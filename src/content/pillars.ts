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
    disciplines: [
      { label: { en: "Web design", de: "Webdesign" }, slug: "web-design" },
      {
        label: { en: "Website redesign", de: "Website-Redesign" },
        slug: "website-redesign",
      },
      { label: { en: "Landing pages", de: "Landingpages" }, slug: null },
      { label: { en: "UX/UI", de: "UX/UI" }, slug: null },
      {
        label: {
          en: "Conversion optimisation",
          de: "Conversion-Optimierung",
        },
        slug: null,
      },
    ],
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
    disciplines: [
      { label: { en: "Branding", de: "Branding" }, slug: "branding" },
      {
        label: { en: "Visual identity", de: "Visual Identity" },
        slug: "visual-identity",
      },
      {
        label: { en: "Graphic design", de: "Grafikdesign" },
        slug: "graphic-design",
      },
      { label: { en: "Photography", de: "Fotografie" }, slug: "photography" },
      { label: { en: "Video", de: "Video" }, slug: "video" },
      { label: { en: "Social content", de: "Social Content" }, slug: null },
    ],
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
    disciplines: [
      { label: { en: "SEO", de: "SEO" }, slug: "seo" },
      { label: { en: "Meta Ads", de: "Meta Ads" }, slug: "meta-ads" },
      {
        label: { en: "Social media", de: "Social Media" },
        slug: "social-media",
      },
      {
        label: { en: "Lead generation", de: "Leadgenerierung" },
        slug: null,
      },
      {
        label: { en: "Campaign strategy", de: "Kampagnenstrategie" },
        slug: null,
      },
    ],
  },
];

export const pillarByKey = Object.fromEntries(
  pillars.map((pillar) => [pillar.key, pillar]),
) as Record<PillarKey, Pillar>;
