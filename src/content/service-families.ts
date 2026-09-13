import type { Localized } from "@/lib/i18n";

/**
 * The six things AMPLIQ does, as a client would name them.
 *
 * The catalogue in `./services.ts` is organised the way the work is organised —
 * ten disciplines across three layers, each with its own page. That is the
 * right structure for someone comparing scopes, and the wrong one for someone
 * arriving cold, who is not shopping for "visual identity" but wondering
 * whether one team can handle their content, their channels and their site.
 *
 * So this is a second view over the same catalogue rather than a second
 * catalogue: six families, each naming the disciplines underneath it and
 * linking to the pages that already exist. Nothing here duplicates a service
 * page; `links` is what keeps the two in step.
 *
 * The order is deliberate and matches the problem section above it — film and
 * social first, strategy last. It reads as the order the work happens in, and
 * it puts AMPLIQ's strongest disciplines where a visitor looks first.
 */
export type ServiceFamily = {
  /** Stable key: the cover drawing, the panel id and the React key. */
  id: "film" | "social" | "design" | "web" | "performance" | "strategy";
  title: Localized<string>;
  /** One sentence, on the card. What the discipline covers. */
  summary: Localized<string>;
  /** One sentence, revealed. How it runs, not what it is. */
  detail: Localized<string>;
  /** Four short chips, revealed. Concrete, no adjectives. */
  includes: Localized<string[]>;
  /** Service pages this family covers. Empty where none exists yet. */
  links: string[];
};

export const serviceFamilies: ServiceFamily[] = [
  {
    id: "film",
    title: { en: "Film & Photography", de: "Film & Fotografie" },
    summary: {
      en: "Cinematic films, advertising, product videos, short-form content, brand photography and professional editing.",
      de: "Cinematic Films, Werbung, Produktvideos, Short-Form-Content, Markenfotografie und professioneller Schnitt.",
    },
    detail: {
      en: "One crew from the concept to the final grade, so the footage you shoot on Tuesday is cut for every channel by Friday.",
      de: "Ein Team vom Konzept bis zur finalen Farbkorrektur — was am Dienstag gedreht wird, ist am Freitag für jeden Kanal geschnitten.",
    },
    includes: {
      en: ["Concept and shot list", "Direction and crew", "Studio and on location", "Edit, grade, sound"],
      de: ["Konzept und Shotlist", "Regie und Crew", "Studio und vor Ort", "Schnitt, Grading, Ton"],
    },
    links: ["video", "photography"],
  },
  {
    id: "social",
    title: { en: "Social Media", de: "Social Media" },
    summary: {
      en: "Content creation, filming, editing, posting, social strategy and full social media management.",
      de: "Contentproduktion, Dreh, Schnitt, Posting, Social-Strategie und vollständiges Social-Media-Management.",
    },
    detail: {
      en: "Run as a channel, not a calendar: we shoot, cut, publish and read what actually landed, then shoot the next round against that.",
      de: "Als Kanal geführt, nicht als Kalender: Wir drehen, schneiden, veröffentlichen und lesen aus, was wirklich ankam — und drehen die nächste Runde danach.",
    },
    includes: {
      en: ["Channel strategy", "Monthly content production", "Editing and captions", "Publishing and reporting"],
      de: ["Kanalstrategie", "Monatliche Content-Produktion", "Schnitt und Untertitel", "Publishing und Reporting"],
    },
    links: ["social-media"],
  },
  {
    id: "design",
    title: { en: "Graphic Design", de: "Grafikdesign" },
    summary: {
      en: "Branding, logos, social creatives, campaigns, packaging and marketing materials.",
      de: "Branding, Logos, Social Creatives, Kampagnen, Verpackung und Marketingmaterialien.",
    },
    detail: {
      en: "Built as a system with rules you can hand to anyone, so the tenth asset still looks like the first.",
      de: "Als System mit Regeln gebaut, die Sie weitergeben können — damit das zehnte Asset noch aussieht wie das erste.",
    },
    includes: {
      en: ["Logo and wordmark", "Type, colour, layout rules", "Campaign and social sets", "Print and packaging"],
      de: ["Logo und Wortmarke", "Regeln für Schrift, Farbe, Layout", "Kampagnen- und Social-Sets", "Print und Verpackung"],
    },
    links: ["branding", "visual-identity", "graphic-design"],
  },
  {
    id: "web",
    title: { en: "Web & Digital", de: "Web & Digital" },
    summary: {
      en: "Modern websites, redesigns, landing pages, UX/UI and conversion-focused digital experiences.",
      de: "Moderne Websites, Redesigns, Landingpages, UX/UI und conversion-orientierte digitale Erlebnisse.",
    },
    detail: {
      en: "Designed around the decision a visitor is trying to make, then built fast enough that they stay long enough to make it.",
      de: "Gebaut um die Entscheidung, die Ihr Besucher treffen will — und schnell genug, dass er lange genug bleibt, um sie zu treffen.",
    },
    includes: {
      en: ["Structure and UX", "Design system", "Build and performance", "Handover you can edit"],
      de: ["Struktur und UX", "Designsystem", "Umsetzung und Performance", "Übergabe zum Selbstpflegen"],
    },
    links: ["web-design", "website-redesign"],
  },
  {
    id: "performance",
    title: { en: "SEO & Paid Advertising", de: "SEO & Paid Advertising" },
    summary: {
      en: "SEO, Google Ads, Meta Ads, TikTok Ads, campaign creation, targeting and optimization.",
      de: "SEO, Google Ads, Meta Ads, TikTok Ads, Kampagnenaufbau, Targeting und Optimierung.",
    },
    detail: {
      en: "The creative and the media buying sit with the same team, which is why the ad that wins gets made again rather than merely reported.",
      de: "Kreation und Mediaeinkauf liegen im selben Team — deshalb wird die Anzeige, die gewinnt, neu produziert statt nur berichtet.",
    },
    includes: {
      en: ["Search and technical SEO", "Campaign build and targeting", "Ad creative that ships", "Reporting on enquiries"],
      de: ["Suche und technisches SEO", "Kampagnenaufbau und Targeting", "Werbemittel, die live gehen", "Reporting auf Anfragen"],
    },
    links: ["seo", "meta-ads"],
  },
  {
    id: "strategy",
    title: { en: "Strategy", de: "Strategie" },
    summary: {
      en: "Marketing strategy, positioning, creative direction, content strategy and campaigns built around the business and its audience.",
      de: "Marketingstrategie, Positionierung, kreative Leitung, Content-Strategie und Kampagnen, gebaut um das Unternehmen und seine Zielgruppe.",
    },
    detail: {
      en: "The layer that decides what the other five are for — and the reason they point the same way.",
      de: "Die Ebene, die entscheidet, wofür die anderen fünf da sind — und der Grund, warum sie in dieselbe Richtung zeigen.",
    },
    includes: {
      en: ["Positioning and audience", "Creative direction", "Content and channel plan", "What to do first"],
      de: ["Positionierung und Zielgruppe", "Kreative Leitung", "Content- und Kanalplan", "Was zuerst zu tun ist"],
    },
    links: [],
  },
];
