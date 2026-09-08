import type { Locale } from "@/lib/i18n";

/**
 * Route slugs are shared across locales and prefixed with the locale segment.
 * Keeping one slug per route (rather than translating URLs) means a single
 * page tree, stable deep links, and clean hreflang pairs.
 */
export const routes = {
  home: "",
  work: "/work",
  services: "/services",
  packages: "/packages",
  about: "/about",
  insights: "/insights",
  contact: "/contact",
  imprint: "/legal/imprint",
  privacy: "/legal/privacy",
  cookies: "/legal/privacy#cookies",
} as const;

export type RouteKey = keyof typeof routes;

/** Builds a locale-prefixed href, e.g. `href("de", "/work")` → `/de/work`. */
export function href(locale: Locale, path = ""): string {
  const normalized = path === "/" ? "" : path;
  return `/${locale}${normalized}`;
}

export function route(locale: Locale, key: RouteKey): string {
  return href(locale, routes[key]);
}

export function workHref(locale: Locale, slug: string): string {
  return href(locale, `${routes.work}/${slug}`);
}

export function serviceHref(locale: Locale, slug: string): string {
  return href(locale, `${routes.services}/${slug}`);
}

export function insightHref(locale: Locale, slug: string): string {
  return href(locale, `${routes.insights}/${slug}`);
}

/**
 * Swaps the locale segment of the current pathname, preserving the rest of the
 * route so the language switcher keeps the visitor on the same page.
 */
export function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${next}`;
  segments[0] = next;
  return `/${segments.join("/")}`;
}
