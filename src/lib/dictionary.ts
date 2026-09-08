import { de } from "@/dictionaries/de";
import { type Dictionary, en } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";

const dictionaries: Record<Locale, Dictionary> = { en, de };

/**
 * Dictionaries are plain modules rather than dynamic imports: the whole site is
 * statically rendered per locale, so the copy is inlined into the HTML at build
 * time and never reaches the client bundle as a separate payload.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
