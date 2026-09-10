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
 * The origin used when nothing valid has been supplied.
 *
 * A real value, never a fragment: everything below is built by parsing a
 * candidate and falling back to this whole origin, so no code path can
 * assemble a scheme and an empty host into `https://`.
 */
const FALLBACK_ORIGIN = "https://ampliq.net";

/**
 * Reads an origin from an environment variable, or nothing.
 *
 * Accepts either form — `ampliq.net` or `https://ampliq.net/` — and returns a
 * normalised origin with no trailing slash. Returns null for anything that is
 * not usable, which is the case that matters: a variable that exists but is
 * empty. `??` does not fall back on an empty string, and a hosting dashboard
 * hands you exactly that for a variable defined with no value. That produced
 * `https://` here, and `new URL("https://")` throws — which is what broke the
 * production build.
 *
 * A bare word is rejected too: `ampliq` parses as a URL but is a typo, not a
 * site. `localhost` is the one exception, for local and preview builds.
 */
function readOrigin(value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname;
    if (!host) return null;
    if (host !== "localhost" && !host.includes(".")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * The canonical origin, in one place.
 *
 * Everything on the site derives from it: canonical URLs, hreflang, the
 * sitemap, Open Graph, and all three published addresses. Set
 * `NEXT_PUBLIC_SITE_DOMAIN` to the real domain and the whole site follows;
 * `NEXT_PUBLIC_SITE_URL` overrides the origin outright when a deployment sits
 * on a different host.
 *
 * Guaranteed to be a valid absolute origin. Every candidate is parsed before
 * it is accepted, so `new URL(siteUrl)` downstream cannot throw.
 */
export const siteUrl =
  readOrigin(env.NEXT_PUBLIC_SITE_URL) ??
  readOrigin(env.NEXT_PUBLIC_SITE_DOMAIN) ??
  FALLBACK_ORIGIN;

/** Already parsed, so nothing else has to call `new URL` on a string. */
export const siteOrigin = new URL(siteUrl);

/** The hostname of `siteUrl`, which is what every mailbox is built on. */
export const siteDomain = siteOrigin.hostname;

/** Whether a usable domain was supplied, or we are still on the default. */
export const domainIsConfigured =
  readOrigin(env.NEXT_PUBLIC_SITE_URL) !== null ||
  readOrigin(env.NEXT_PUBLIC_SITE_DOMAIN) !== null;

/** Exported for the check that exercises it against bad input. */
export { readOrigin };

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

