"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { type Locale, localeNames, locales } from "@/lib/i18n";
import { rememberLocale } from "@/lib/locale-cookie";
import { swapLocale } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * DE | EN. Switching keeps the visitor on the same page and stores the choice
 * for a year, so unprefixed entry points (`/`, a shared link, a bookmark) land
 * in the language they picked last.
 */
export function LanguageSwitcher({
  locale,
  label,
  className,
  size = "sm",
}: {
  locale: Locale;
  label: string;
  className?: string;
  size?: "sm" | "lg";
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn("flex items-center", size === "lg" ? "gap-3" : "gap-2", className)}
      role="group"
      aria-label={label}
    >
      {locales.map((code, index) => {
        const isActive = code === locale;
        return (
          <span key={code} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="mr-2 text-current opacity-30">
                /
              </span>
            ) : null}
            <Link
              href={swapLocale(pathname, code)}
              hrefLang={code}
              // Switching language is a deliberate, infrequent action, and the
              // payload is a whole translated page. Prefetching both entries
              // downloads the current page a second time for nothing.
              prefetch={false}
              onClick={() => rememberLocale(code)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "font-mono uppercase transition-opacity duration-200",
                size === "lg" ? "text-sm tracking-[0.14em]" : "text-[0.6875rem] tracking-[0.16em]",
                isActive ? "opacity-100" : "opacity-45 hover:opacity-100",
              )}
            >
              <span className="sr-only">{localeNames[code]}</span>
              <span aria-hidden="true">{code}</span>
            </Link>
          </span>
        );
      })}
    </div>
  );
}
