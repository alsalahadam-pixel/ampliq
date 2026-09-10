/**
 * `POST /api/contact`
 *
 * Takes an enquiry from the form on `/contact`, validates it server-side, and
 * sends two mails: the notification to AMPLIQ (reply-to the sender, so hitting
 * reply answers them directly) and an acknowledgement back to the sender.
 *
 * The response says what actually happened. When no mail transport is
 * configured the route answers `503` with `delivered: false`, and the form
 * tells the visitor plainly that nothing was sent rather than showing a
 * success screen for a message nobody received.
 */

import { budgetRanges, labelFor, projectTypes, timelines } from "@/content/enquiry";
import {
  enquiryAcknowledgement,
  enquiryNotification,
  type Enquiry,
} from "@/lib/email/enquiry";
import { isLocale, type Locale } from "@/lib/i18n";
import { mailIsConfigured, notificationAddress, sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

const LIMITS = {
  firstName: 80,
  lastName: 80,
  email: 200,
  company: 160,
  phone: 60,
  website: 300,
  message: 4000,
  service: 60,
} as const;

/** Permissive on purpose: enough shape to be plausible, no false negatives. */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** One enquiry per address per minute is plenty; the rest is a script. */
const RECENT = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const hits = (RECENT.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  hits.push(now);
  RECENT.set(key, hits);

  if (RECENT.size > 500) {
    for (const [entry, times] of RECENT) {
      if (times.every((at) => now - at >= WINDOW_MS)) RECENT.delete(entry);
    }
  }

  return hits.length > MAX_PER_WINDOW;
}

/**
 * Collapses a single-line field to exactly that.
 *
 * Nothing here reaches a raw SMTP header — the transports take JSON — but a
 * name carrying a newline still produces a broken subject line and a mangled
 * row in the notification. Control characters have no business in a name, an
 * address or a company, so they are stripped rather than trusted downstream.
 */
function singleLine(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim()
    : "";
}

/** The message keeps its line breaks; every other field does not. */
function asString(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, "").trim()
    : "";
}

type Parsed =
  | { ok: true; value: Enquiry }
  | { ok: false; errors: Record<string, string> };

function parse(payload: unknown): Parsed {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, errors: { form: "invalid" } };
  }

  const body = payload as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const firstName = singleLine(body.firstName);
  if (!firstName) errors.firstName = "required";
  else if (firstName.length > LIMITS.firstName) errors.firstName = "tooLong";

  const lastName = singleLine(body.lastName);
  if (!lastName) errors.lastName = "required";
  else if (lastName.length > LIMITS.lastName) errors.lastName = "tooLong";

  const email = singleLine(body.email);
  if (!email) errors.email = "required";
  else if (email.length > LIMITS.email) errors.email = "tooLong";
  else if (!EMAIL.test(email)) errors.email = "invalid";

  const message = asString(body.message);
  if (message.length < 10) errors.message = "required";
  else if (message.length > LIMITS.message) errors.message = "tooLong";

  const company = singleLine(body.company);
  if (company.length > LIMITS.company) errors.company = "tooLong";

  const phone = singleLine(body.phone);
  if (phone.length > LIMITS.phone) errors.phone = "tooLong";

  const website = singleLine(body.website);
  if (website.length > LIMITS.website) errors.website = "tooLong";

  const need = singleLine(body.need);
  if (!need) errors.need = "required";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const rawLocale = singleLine(body.locale);
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";

  const services = Array.isArray(body.services)
    ? body.services
        .map(singleLine)
        .filter((value) => value && value.length <= LIMITS.service)
        .slice(0, 20)
    : [];

  return {
    ok: true,
    value: {
      firstName,
      lastName,
      email,
      company: company || undefined,
      phone: phone || undefined,
      website: website || undefined,
      // Readable labels reach the inbox, not slugs.
      projectType: labelFor(projectTypes, need),
      budget: labelFor(budgetRanges, singleLine(body.budget) || undefined),
      timeline: labelFor(timelines, singleLine(body.timeline) || undefined),
      services,
      message,
      locale,
    },
  };
}

export async function POST(request: Request): Promise<Response> {
  const forwarded = request.headers.get("x-forwarded-for");
  const client = forwarded?.split(",")[0]?.trim() || "unknown";

  if (rateLimited(client)) {
    return Response.json({ delivered: false, error: "rate-limited" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ delivered: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: real people leave this empty. Accept and drop it silently, so a
  // bot gets no signal about what gave it away.
  const honeypot = asString((payload as Record<string, unknown>)?.company_website);
  if (honeypot) {
    return Response.json({ delivered: true }, { status: 202 });
  }

  const parsed = parse(payload);
  if (!parsed.ok) {
    return Response.json(
      { delivered: false, error: "invalid", fields: parsed.errors },
      { status: 400 },
    );
  }

  if (!mailIsConfigured()) {
    // Not an error the visitor caused, and not something to paper over.
    console.warn("[contact] enquiry received but no mail transport is configured");
    return Response.json(
      { delivered: false, error: "not-configured" },
      { status: 503 },
    );
  }

  const notification = await sendEmail(
    notificationAddress(),
    enquiryNotification(parsed.value),
    parsed.value.email,
  );

  if (!notification.sent) {
    return Response.json({ delivered: false, error: "failed" }, { status: 502 });
  }

  // The acknowledgement is a courtesy: the enquiry is already safely delivered,
  // so a failure here must not turn a successful send into an error.
  const acknowledgement = await sendEmail(
    parsed.value.email,
    enquiryAcknowledgement(parsed.value),
  );

  return Response.json(
    { delivered: true, acknowledged: acknowledgement.sent },
    { status: 201 },
  );
}
