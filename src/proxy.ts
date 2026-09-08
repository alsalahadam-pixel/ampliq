import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { LOCALE_COOKIE, defaultLocale, isLocale, locales } from "@/lib/i18n";

/**
 * Locale routing (Next 16 renamed Middleware to Proxy).
 *
 * Every page lives under an explicit `/en` or `/de` prefix. Unprefixed requests
 * are redirected to the visitor's language: an explicit choice stored in a
 * cookie wins, then Accept-Language, then English as the default.
 */

/** Picks the first supported locale from an Accept-Language header. */
function fromAcceptLanguage(header: string | null) {
  if (!header) return null;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));
      return {
        // `de-DE` and `de-AT` both resolve to `de`.
        base: tag.trim().toLowerCase().split("-")[0],
        quality: quality ? Number.parseFloat(quality.slice(2)) : 1,
      };
    })
    .filter((entry) => Number.isFinite(entry.quality))
    .sort((a, b) => b.quality - a.quality);

  return ranked.find((entry) => isLocale(entry.base))?.base ?? null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const stored = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    (stored && isLocale(stored) ? stored : null) ??
    fromAcceptLanguage(request.headers.get("accept-language")) ??
    defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Skip Next internals, metadata routes and anything with a file extension —
   * those must not be locale-prefixed.
   */
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
