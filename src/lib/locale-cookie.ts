import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";

/**
 * Stores an explicit language choice for a year so that unprefixed entry
 * points (`/`, a bookmark, a shared link) open in the language the visitor
 * picked last. Browser-only; call it from an event handler.
 */
export function rememberLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
}
