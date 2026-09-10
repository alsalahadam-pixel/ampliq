/**
 * Legal entity data, and the placeholders standing in for what is missing.
 *
 * AMPLIQ is not currently a registered company — no GmbH, no UG, no
 * Handelsregister entry, no VAT ID. None of that is invented here. Every field
 * the law requires either carries a real value supplied through the
 * environment, or renders as a visible `[PLACEHOLDER]` that cannot be mistaken
 * for content.
 *
 * The rule this file exists to enforce: an empty legal field is shown as
 * missing, never filled in with something plausible.
 */

import { contact } from "@/lib/site";

const env = process.env;

/** A required value that has not been supplied yet. */
export type LegalField = {
  /** The placeholder token, e.g. `LEGAL NAME`. */
  token: string;
  /** The supplied value, or null while it is still outstanding. */
  value: string | null;
  /** Whether the site cannot legally launch without it. */
  required: boolean;
};

function field(token: string, value: string | undefined, required = true): LegalField {
  const trimmed = value?.trim();
  return { token, value: trimmed ? trimmed : null, required };
}

/**
 * The Impressum fields, in the order §5 DDG expects them.
 *
 * `required: false` marks the ones that only apply to some legal forms — a
 * sole trader has no Handelsregister number, and a small business under §19
 * UStG has no VAT ID. Those render as "if applicable" rather than as a gap.
 */
export const legalFields = {
  name: field("LEGAL NAME", env.NEXT_PUBLIC_LEGAL_COMPANY),
  form: field("LEGAL FORM", env.NEXT_PUBLIC_LEGAL_FORM),
  representative: field("RESPONSIBLE PERSON", env.NEXT_PUBLIC_LEGAL_REPRESENTATIVE),
  street: field("BUSINESS ADDRESS", env.NEXT_PUBLIC_LEGAL_STREET),
  postalCode: field("POSTAL CODE", env.NEXT_PUBLIC_LEGAL_POSTAL_CODE),
  city: field("CITY", env.NEXT_PUBLIC_LEGAL_CITY),
  country: field("COUNTRY", env.NEXT_PUBLIC_LEGAL_COUNTRY ?? "Deutschland"),
  email: field("EMAIL", env.NEXT_PUBLIC_LEGAL_EMAIL ?? contact.help),
  phone: field("PHONE IF APPLICABLE", env.NEXT_PUBLIC_LEGAL_PHONE, false),
  vatId: field("VAT ID IF APPLICABLE", env.NEXT_PUBLIC_LEGAL_VAT_ID, false),
  taxNumber: field("TAX NUMBER IF APPLICABLE", env.NEXT_PUBLIC_LEGAL_TAX_NUMBER, false),
  registerCourt: field(
    "REGISTRATION INFORMATION IF APPLICABLE",
    env.NEXT_PUBLIC_LEGAL_REGISTER_COURT,
    false,
  ),
  registerNumber: field(
    "REGISTRATION NUMBER IF APPLICABLE",
    env.NEXT_PUBLIC_LEGAL_REGISTER_NUMBER,
    false,
  ),
  supervisoryAuthority: field(
    "SUPERVISORY AUTHORITY IF APPLICABLE",
    env.NEXT_PUBLIC_LEGAL_AUTHORITY,
    false,
  ),
  dataProtectionContact: field(
    "DATA PROTECTION CONTACT",
    env.NEXT_PUBLIC_LEGAL_DPO ?? env.NEXT_PUBLIC_LEGAL_EMAIL ?? contact.help,
  ),
} as const;

export type LegalFieldKey = keyof typeof legalFields;

/** How a placeholder is written wherever it appears. */
export function placeholderText(token: string): string {
  return `[${token}]`;
}

/** The value, or the bracketed token when it is still outstanding. */
export function legalValue(key: LegalFieldKey): string {
  const entry = legalFields[key];
  return entry.value ?? placeholderText(entry.token);
}

/** Every field still waiting on real information. */
export const outstandingLegalFields: LegalField[] = Object.values(legalFields).filter(
  (entry) => entry.value === null,
);

/**
 * Whether the entity is described well enough to launch.
 *
 * Only the required fields count: a sole trader with no VAT ID is complete,
 * a site with no address is not.
 */
export const legalEntityIsComplete = !outstandingLegalFields.some(
  (entry) => entry.required,
);

/** One-line postal address, or the placeholders that make up its gaps. */
export function legalAddressLines(): string[] {
  return [
    legalValue("name"),
    legalValue("street"),
    `${legalValue("postalCode")} ${legalValue("city")}`,
    legalValue("country"),
  ];
}
