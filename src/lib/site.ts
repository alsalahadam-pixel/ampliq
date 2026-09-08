import type { Localized } from "@/lib/i18n";

/**
 * Single source of truth for anything that is *not* design or copy: URLs,
 * contact details, legal entity data, analytics IDs.
 *
 * Everything a real business must supply is env-driven with an obvious
 * fallback. Nothing here invents credentials, addresses or tax numbers —
 * unset values render as a visible placeholder or are omitted entirely.
 * See PLACEHOLDERS.md.
 */

const env = process.env;

export const siteUrl = (
  env.NEXT_PUBLIC_SITE_URL ?? "https://ampliq.de"
).replace(/\/$/, "");

export const site = {
  name: "AMPLIQ",
  tagline: {
    en: "Marketing, amplified.",
    de: "Marketing, verstärkt.",
  } satisfies Localized<string>,
  url: siteUrl,
  email: env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ampliq.de",
  phone: env.NEXT_PUBLIC_CONTACT_PHONE ?? null,
  /** Market served, used for copy and Organization schema. */
  market: "Germany",
} as const;

/**
 * Social profiles render only when a URL is configured — an agency site that
 * links to profiles that do not exist yet reads worse than one that does not
 * link at all.
 */
export const socials: { label: string; href: string | null }[] = [
  { label: "Instagram", href: env.NEXT_PUBLIC_INSTAGRAM_URL ?? null },
  { label: "LinkedIn", href: env.NEXT_PUBLIC_LINKEDIN_URL ?? null },
];

export const activeSocials = socials.filter(
  (item): item is { label: string; href: string } => Boolean(item.href),
);

/**
 * Legal entity data for the Impressum (§5 DDG / §18 MStV).
 * `null` means "not supplied yet" and the page renders a labelled placeholder
 * instead of inventing a value. Fill these in before going live.
 */
export const legalEntity = {
  companyName: env.NEXT_PUBLIC_LEGAL_COMPANY ?? null,
  legalForm: env.NEXT_PUBLIC_LEGAL_FORM ?? null,
  representative: env.NEXT_PUBLIC_LEGAL_REPRESENTATIVE ?? null,
  street: env.NEXT_PUBLIC_LEGAL_STREET ?? null,
  postalCode: env.NEXT_PUBLIC_LEGAL_POSTAL_CODE ?? null,
  city: env.NEXT_PUBLIC_LEGAL_CITY ?? null,
  country: env.NEXT_PUBLIC_LEGAL_COUNTRY ?? "Deutschland",
  email: env.NEXT_PUBLIC_LEGAL_EMAIL ?? env.NEXT_PUBLIC_CONTACT_EMAIL ?? null,
  phone: env.NEXT_PUBLIC_LEGAL_PHONE ?? null,
  vatId: env.NEXT_PUBLIC_LEGAL_VAT_ID ?? null,
  registerCourt: env.NEXT_PUBLIC_LEGAL_REGISTER_COURT ?? null,
  registerNumber: env.NEXT_PUBLIC_LEGAL_REGISTER_NUMBER ?? null,
  dataProtectionContact: env.NEXT_PUBLIC_LEGAL_DPO ?? null,
} as const;

export const legalEntityIsConfigured = Boolean(
  legalEntity.companyName && legalEntity.street && legalEntity.city,
);

/**
 * Tracking is off until an ID is provided. No scripts load, no cookies are
 * set, and nothing is sent anywhere by default.
 */
export const analytics = {
  gtmId: env.NEXT_PUBLIC_GTM_ID ?? null,
  ga4Id: env.NEXT_PUBLIC_GA4_ID ?? null,
  metaPixelId: env.NEXT_PUBLIC_META_PIXEL_ID ?? null,
  linkedInPartnerId: env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ?? null,
} as const;

export const analyticsEnabled = Object.values(analytics).some(Boolean);

/**
 * Where the contact form posts. Unset means the form runs in preview mode:
 * it validates and shows its success state without pretending a message was
 * delivered.
 */
export const contactEndpoint = env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? null;
