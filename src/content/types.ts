import type { Localized } from "@/lib/i18n";

export type PillarKey = "build" | "create" | "grow";

export type Pillar = {
  key: PillarKey;
  index: number;
  /** Pillar names stay in English across locales — they are brand vocabulary. */
  label: string;
  title: Localized<string>;
  body: Localized<string>;
  /**
   * The disciplines this layer covers.
   *
   * `slug` points at the service page where one exists. Disciplines without a
   * page render as plain text rather than as a link to nothing — the list
   * describes what the layer covers, not what happens to be published.
   */
  disciplines: { label: Localized<string>; slug: string | null }[];
};

export type Faq = {
  question: Localized<string>;
  answer: Localized<string>;
};

export type Step = {
  title: Localized<string>;
  body: Localized<string>;
};

export type Service = {
  slug: string;
  pillar: PillarKey;
  title: Localized<string>;
  /** One line used in the services index and nav. */
  tagline: Localized<string>;
  summary: Localized<string>;
  problem: Localized<string>;
  solution: Localized<string>;
  deliverables: Localized<string[]>;
  process: Step[];
  useCases: Localized<string[]>;
  faqs: Faq[];
  related: string[];
  seo: {
    title: Localized<string>;
    description: Localized<string>;
  };
};

export type PackageTier = {
  slug: string;
  index: number;
  /** Tier names are brand vocabulary and stay in English. */
  name: string;
  price: Localized<string>;
  priceKind: "from" | "custom";
  positioning: Localized<string>;
  forWho: Localized<string>;
  solves: Localized<string>;
  /** Overrides the generic "typically includes" label — START lists alternatives, not a bundle. */
  includesLabel?: Localized<string>;
  includes: Localized<string[]>;
  scope: Localized<string>;
  engagement: Localized<string>;
  emphasis?: boolean;
};

export type InsightSection = {
  heading: Localized<string>;
  paragraphs: Localized<string[]>;
  bullets?: Localized<string[]>;
};

export type Insight = {
  slug: string;
  category: Localized<string>;
  title: Localized<string>;
  excerpt: Localized<string>;
  publishedAt: string;
  readingMinutes: number;
  intro: Localized<string[]>;
  sections: InsightSection[];
  closing: Localized<string>;
  seo: {
    title: Localized<string>;
    description: Localized<string>;
  };
};
