import type { Metadata } from "next";

import { type Locale, localeTags, locales } from "@/lib/i18n";
import { activeSocials, site, siteUrl } from "@/lib/site";

/**
 * Every page builds its metadata here, so canonical URLs, hreflang pairs and
 * Open Graph tags stay consistent and no route can quietly ship without them.
 *
 * `path` is the route *without* the locale prefix, e.g. `/work/ihms-global`.
 */
export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  type = "website",
  publishedTime,
  noIndex = false,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = `${siteUrl}/${locale}${path}`;

  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[localeTags[code]] = `${siteUrl}/${code}${path}`;
  }
  languages["x-default"] = `${siteUrl}/en${path}`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url: canonical,
      title,
      description,
      siteName: site.name,
      locale: localeTags[locale].replace("-", "_"),
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** Escapes `<` so a JSON-LD payload can never break out of its script tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: `${siteUrl}/${locale}`,
    slogan: site.tagline[locale],
    description:
      locale === "de"
        ? "AMPLIQ ist ein unabhängiges Studio für Marketing und Kreation: Marke, Website und Kampagnen als ein System."
        : "AMPLIQ is an independent marketing and creative studio: brand, website and campaigns built as one system.",
    logo: `${siteUrl}/brand/ampliq-logo.svg`,
    image: `${siteUrl}/opengraph-image`,
    email: site.email,
    areaServed: site.market,
    ...(activeSocials.length > 0
      ? { sameAs: activeSocials.map((item) => item.href) }
      : {}),
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/${locale}`,
    name: site.name,
    inLanguage: localeTags[locale],
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function serviceSchema({
  locale,
  name,
  description,
  path,
}: {
  locale: Locale;
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: `${siteUrl}/${locale}${path}`,
    areaServed: { "@type": "Country", name: site.market },
    provider: { "@id": `${siteUrl}/#organization` },
  };
}

export function articleSchema({
  locale,
  title,
  description,
  path,
  publishedAt,
}: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  publishedAt: string;
}) {
  const url = `${siteUrl}/${locale}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    inLanguage: localeTags[locale],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}/${locale}${crumb.path}`,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
