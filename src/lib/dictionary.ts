import { de } from "@/dictionaries/de";
import { type Dictionary, en } from "@/dictionaries/en";
import type { Locale } from "@/lib/i18n";
import { legalIsPublished } from "@/lib/legal";

const dictionaries: Record<Locale, Dictionary> = { en, de };

/**
 * The legal section of the dictionary, blanked.
 *
 * Client components take the whole dictionary as one prop, so every string in
 * it is serialised into the HTML of every page whether or not anything renders
 * it. While the legal routes are unpublished nothing reads these — the pages
 * that would answer 404 first, and the footer omits the column — so shipping
 * the document names and their one-line descriptions to every visitor achieves
 * nothing and discloses what the site has planned but not finished.
 *
 * The shape is kept so the type is unchanged and the pages need no guards of
 * their own; only the values go.
 */
function withoutLegalCopy(dictionary: Dictionary): Dictionary {
  const blank = Object.fromEntries(
    Object.keys(dictionary.legal).map((key) => [key, ""]),
  ) as Dictionary["legal"];

  return { ...dictionary, legal: blank };
}

/**
 * Dictionaries are plain modules rather than dynamic imports: the whole site is
 * statically rendered per locale, so the copy is inlined into the HTML at build
 * time and never reaches the client bundle as a separate payload.
 */
export function getDictionary(locale: Locale): Dictionary {
  const dictionary = dictionaries[locale];
  return legalIsPublished ? dictionary : withoutLegalCopy(dictionary);
}

export type { Dictionary };
