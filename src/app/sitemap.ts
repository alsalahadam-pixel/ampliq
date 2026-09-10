import type { MetadataRoute } from "next";

import { insights } from "@/content/insights";
import { services } from "@/content/services";
import { type Locale, localeTags, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

/** Nothing here reads the request, so it is generated once at build time. */
export const dynamic = "force-static";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

/**
 * Every public route, in both languages, with hreflang alternates.
 * Legal pages are excluded — they carry `noindex`.
 */
const entries: Entry[] = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/packages", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/insights", changeFrequency: "weekly", priority: 0.7 },
  { path: "/start", changeFrequency: "yearly", priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.8 },
  ...services.map((service) => ({
    path: `/services/${service.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  ...insights.map((insight) => ({
    path: `/insights/${insight.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  })),
];

function alternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeTags[locale]] = `${siteUrl}/${locale}${path}`;
  }
  languages["x-default"] = `${siteUrl}/en${path}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale: Locale) =>
    entries.map((entry) => ({
      url: `${siteUrl}/${locale}${entry.path}`,
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: alternates(entry.path),
    })),
  );
}
