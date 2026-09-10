/**
 * Legal entity data.
 *
 * AMPLIQ trades under its own name. The registered particulars — legal form,
 * business address, responsible person, tax and register numbers — are supplied
 * through the environment and are never invented here. Each one is a field in
 * the registry below, so `npm run launch-check` can list what is still
 * outstanding and the operator fills it in with one variable per value.
 *
 * The public pages never discuss that state. A value that has not been supplied
 * resolves to a bracketed token, and the document renderer drops every row,
 * sentence, list item and chapter that still contains one — see
 * `withoutUnresolved` in `@/components/legal/legal-document`. The reader gets an
 * ordinary legal document containing only what is actually known: shorter while
 * values are outstanding, longer the moment they are supplied, and at no point
 * announcing a gap.
 */

import { contact, site } from "@/lib/site";

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
 * The entity fields, in the order §5 DDG expects the first of them.
 *
 * `required: false` marks the ones that only apply to some legal forms — a sole
 * trader has no Handelsregister number, and a small business under §19 UStG has
 * no VAT ID — and the processors, which depend on how the site is deployed.
 * Nothing here has a made-up default: an unsupplied field stays null and the
 * sentence that needs it does not render.
 */
export const legalFields = {
  name: field("LEGAL NAME", env.NEXT_PUBLIC_LEGAL_COMPANY),
  form: field("LEGAL FORM", env.NEXT_PUBLIC_LEGAL_FORM),
  representative: field("RESPONSIBLE PERSON", env.NEXT_PUBLIC_LEGAL_REPRESENTATIVE),
  street: field("BUSINESS ADDRESS", env.NEXT_PUBLIC_LEGAL_STREET),
  postalCode: field("POSTAL CODE", env.NEXT_PUBLIC_LEGAL_POSTAL_CODE),
  city: field("CITY", env.NEXT_PUBLIC_LEGAL_CITY),
  country: field("COUNTRY", env.NEXT_PUBLIC_LEGAL_COUNTRY ?? "Deutschland"),
  email: field("EMAIL", env.NEXT_PUBLIC_LEGAL_EMAIL ?? contact.info),
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
    env.NEXT_PUBLIC_LEGAL_DPO ?? env.NEXT_PUBLIC_LEGAL_EMAIL ?? contact.info,
  ),
  /* The three processors the privacy policy names once they are known. Each
     sentence describing one renders only when its variable is set, so the
     policy never names a provider the deployment does not actually use. */
  hostingProvider: field("HOSTING PROVIDER", env.NEXT_PUBLIC_LEGAL_HOST, false),
  emailProcessor: field("EMAIL PROCESSOR", env.NEXT_PUBLIC_LEGAL_EMAIL_PROCESSOR, false),
  calendarProcessor: field(
    "CALENDAR PROCESSOR",
    env.NEXT_PUBLIC_LEGAL_CALENDAR_PROCESSOR,
    false,
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

/**
 * The name to call the business by in running text.
 *
 * The registered designation once it is supplied, and the trading name until
 * then. `AMPLIQ` is not a stand-in: it is what the business is called, so a
 * sentence built on it states a fact rather than filling a gap.
 */
export const entityName: string = legalFields.name.value ?? site.name;

/** The postal address on one line, or null until all three parts are supplied. */
export function postalAddress(): string | null {
  const { street, postalCode, city, country } = legalFields;
  if (!street.value || !postalCode.value || !city.value) return null;
  return [
    entityName,
    street.value,
    `${postalCode.value} ${city.value}`,
    country.value,
  ]
    .filter(Boolean)
    .join(", ");
}

/**
 * Where to send a legal declaration — a withdrawal, a data subject request.
 *
 * The full postal address once it exists, and the name and email address until
 * then. Both forms are a real, working route to a real recipient, which is what
 * these notices have to give the reader; neither states anything untrue.
 */
export function noticeAddress(): string {
  const postal = postalAddress();
  const email = legalValue("email");
  return postal ? `${postal} — ${email}` : `${entityName}, ${email}`;
}

/** Every field still waiting on real information. */
export const outstandingLegalFields: LegalField[] = Object.values(legalFields).filter(
  (entry) => entry.value === null,
);

/**
 * Whether the entity is described well enough for the documents to be legally
 * sufficient, as opposed to merely presentable.
 *
 * Only the required fields count: a sole trader with no VAT ID is complete, a
 * site with no address is not. Nothing on a page reads this — it drives
 * `npm run launch-check`, which is where the gaps are tracked.
 */
export const legalEntityIsComplete = !outstandingLegalFields.some(
  (entry) => entry.required,
);

/**
 * Whether the legal section is published. It is, unless told otherwise.
 *
 * The five documents are public and linked from the footer whatever state the
 * entity data is in — a visitor can always read what AMPLIQ does with their
 * data, what the terms are, and how to withdraw. `NEXT_PUBLIC_LEGAL_PUBLISHED`
 * set to `"false"` takes the whole section down should it ever be needed;
 * nothing else does.
 */
export const legalIsPublished =
  env.NEXT_PUBLIC_LEGAL_PUBLISHED?.trim().toLowerCase() !== "false";
