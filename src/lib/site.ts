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

/**
 * The domain, in one place.
 *
 * The final domain has not been bought yet, so every address and URL on the
 * site is derived from this single constant rather than typed out. Changing
 * `NEXT_PUBLIC_SITE_DOMAIN` moves the whole site — canonical URLs, hreflang,
 * Open Graph, every published address and every email sender — in one edit.
 *
 * `ampliq.net` is a working default, not a decision. It is here so the build
 * has something valid to render; replace it the moment the real domain exists.
 */
export const siteDomain = (
  env.NEXT_PUBLIC_SITE_DOMAIN ?? "ampliq.net"
)
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

/** Whether a real domain has been chosen, or we are still on the default. */
export const domainIsConfigured = Boolean(env.NEXT_PUBLIC_SITE_DOMAIN);

export const siteUrl = (
  env.NEXT_PUBLIC_SITE_URL ?? `https://${siteDomain}`
).replace(/\/$/, "");

/** Builds an address on the site's domain: `mailbox("info")` → info@… */
function mailbox(name: string): string {
  return `${name}@${siteDomain}`;
}

/**
 * Three addresses, three jobs — all on the one domain above.
 *
 * `info` is the general public-facing address: the one in the footer, the
 * imprint and the reply-to on every automated email. `project` and `help`
 * exist so a proposal thread and a support question do not land in the same
 * place, and each can be pointed at a different mailbox later without
 * touching a page.
 *
 * Each can be overridden individually — useful if enquiries should go to a
 * helpdesk on another domain — but none of them has to be.
 */
export const contact = {
  info: env.NEXT_PUBLIC_CONTACT_INFO_EMAIL ?? mailbox("info"),
  project: env.NEXT_PUBLIC_CONTACT_PROJECT_EMAIL ?? mailbox("project"),
  help: env.NEXT_PUBLIC_CONTACT_HELP_EMAIL ?? mailbox("help"),
} as const;

export const site = {
  name: "AMPLIQ",
  tagline: {
    en: "Marketing, amplified.",
    de: "Marketing, verstärkt.",
  } satisfies Localized<string>,
  url: siteUrl,
  /** The general public address. See `contact` for the specialised ones. */
  email: contact.info,
  /** No phone number is published: none has been supplied, and inventing one
   *  would be worse than omitting it. Set the variable to publish one. */
  phone: env.NEXT_PUBLIC_CONTACT_PHONE ?? null,
  /** Primary market, used for copy and Organization schema. */
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
  email: env.NEXT_PUBLIC_LEGAL_EMAIL ?? contact.info,
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

