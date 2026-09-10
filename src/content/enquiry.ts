import type { Localized } from "@/lib/i18n";

/**
 * The kinds of project people come to AMPLIQ for.
 *
 * Shared by the enquiry form and the booking flow so both send the same
 * vocabulary through to the inbox, and the two can be read side by side
 * without translating between them.
 */
export type EnquiryOption = {
  value: string;
  label: Localized<string>;
};

export const projectTypes: EnquiryOption[] = [
  {
    value: "website",
    label: { en: "A new website", de: "Eine neue Website" },
  },
  {
    value: "redesign",
    label: { en: "A website redesign", de: "Ein Website-Redesign" },
  },
  {
    value: "branding",
    label: {
      en: "Branding or visual identity",
      de: "Branding oder Visual Identity",
    },
  },
  {
    value: "content",
    label: {
      en: "Photography, video or content",
      de: "Fotografie, Video oder Content",
    },
  },
  {
    value: "growth",
    label: { en: "SEO, ads or social", de: "SEO, Ads oder Social" },
  },
  {
    value: "full",
    label: {
      en: "A full marketing partner",
      de: "Ein vollständiger Marketingpartner",
    },
  },
  {
    value: "other",
    label: { en: "Something else", de: "Etwas anderes" },
  },
];

export const budgetRanges: EnquiryOption[] = [
  { value: "599-1199", label: { en: "€599 – €1,199", de: "599 € – 1.199 €" } },
  {
    value: "1199-2500",
    label: { en: "€1,199 – €2,500", de: "1.199 € – 2.500 €" },
  },
  {
    value: "2500-5000",
    label: { en: "€2,500 – €5,000", de: "2.500 € – 5.000 €" },
  },
  { value: "5000+", label: { en: "€5,000+", de: "5.000 €+" } },
  { value: "unsure", label: { en: "Not sure yet", de: "Noch unklar" } },
];

export const timelines: EnquiryOption[] = [
  {
    value: "asap",
    label: { en: "As soon as possible", de: "So schnell wie möglich" },
  },
  { value: "1-3", label: { en: "1–3 months", de: "1–3 Monate" } },
  { value: "3-6", label: { en: "3–6 months", de: "3–6 Monate" } },
  { value: "flexible", label: { en: "Flexible", de: "Flexibel" } },
];

/** Turns a submitted value back into a readable label for the inbox. */
export function labelFor(
  options: EnquiryOption[],
  value: string | undefined,
  locale: "en" | "de" = "en",
): string | undefined {
  if (!value) return undefined;
  return options.find((option) => option.value === value)?.label[locale] ?? value;
}
