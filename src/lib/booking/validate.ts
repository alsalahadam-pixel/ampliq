/**
 * Request validation for the booking API.
 *
 * Hand-written rather than schema-library-driven: the site has no runtime
 * dependencies beyond Next and React, and the shape is small enough that a
 * dependency would cost more than it saves.
 *
 * The browser validates the same fields for immediate feedback; this is the
 * copy that decides. Anything arriving here is untrusted.
 */

import type { BookingRequest } from "@/lib/booking/types";
import { labelFor, projectTypes } from "@/content/enquiry";
import { isLocale } from "@/lib/i18n";

export const LIMITS = {
  name: 120,
  email: 200,
  company: 160,
  phone: 60,
  message: 4000,
  projectType: 60,
  timeZone: 80,
} as const;

/**
 * Deliberately permissive: enough structure to be a plausible address, without
 * the false negatives a stricter pattern produces on valid, unusual addresses.
 */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export type ValidationResult =
  | { ok: true; value: BookingRequest }
  | { ok: false; errors: Record<string, string> };

/**
 * A single-line field is exactly that.
 *
 * The mail transports take JSON, so nothing here reaches a raw SMTP header —
 * but a name carrying a newline still produces a broken subject line and a
 * mangled row in the notification, and a control character has no business in
 * a name, an address or a company.
 */
function singleLine(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim()
    : "";
}

/** The message keeps the paragraph breaks the visitor typed. */
function asString(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, "").trim()
    : "";
}

/** Whether the runtime recognises the zone the browser reported. */
function isKnownTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

export function validateBooking(
  payload: unknown,
  fallbackTimeZone: string,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (typeof payload !== "object" || payload === null) {
    return { ok: false, errors: { form: "invalid" } };
  }

  const body = payload as Record<string, unknown>;

  const start = singleLine(body.start);
  if (!start || !Number.isFinite(Date.parse(start))) {
    errors.start = "invalid";
  }

  const name = singleLine(body.name);
  if (name.length < 2) errors.name = "required";
  else if (name.length > LIMITS.name) errors.name = "tooLong";

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

  const projectType = singleLine(body.projectType);
  if (projectType.length > LIMITS.projectType) errors.projectType = "tooLong";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const reportedZone = singleLine(body.timeZone);
  const timeZone =
    reportedZone &&
    reportedZone.length <= LIMITS.timeZone &&
    isKnownTimeZone(reportedZone)
      ? reportedZone
      : fallbackTimeZone;

  const locale = singleLine(body.locale);

  return {
    ok: true,
    value: {
      start: new Date(Date.parse(start)).toISOString(),
      name,
      email,
      company,
      message,
      phone: phone || undefined,
      // Stored as the readable label: the inbox is its only reader, and a
      // raw slug there would just have to be decoded by hand.
      projectType: labelFor(projectTypes, projectType || undefined),
      timeZone,
      locale: isLocale(locale) ? locale : "en",
    },
  };
}
