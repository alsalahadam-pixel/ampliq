/**
 * Locale primitives.
 *
 * English is the primary language and the default locale; German is the
 * secondary market language. Both are served under an explicit path prefix
 * (`/en/...`, `/de/...`) so every route is statically renderable per locale
 * and hreflang stays unambiguous.
 */

export const locales = ["en", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Maps our locale codes to the BCP-47 tags used in markup and hreflang. */
export const localeTags: Record<Locale, string> = {
  en: "en",
  de: "de-DE",
};

/**
 * Open Graph wants the `xx_XX` form, which is not the same as the hreflang
 * tag: `en` is a valid hreflang but not a valid og:locale.
 */
export const openGraphLocales: Record<Locale, string> = {
  en: "en_GB",
  de: "de_DE",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
};

export const LOCALE_COOKIE = "ampliq_locale";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * A value that exists in every supported language. Content files use this so
 * a translation can never silently go missing — TypeScript requires both.
 */
export type Localized<T> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
