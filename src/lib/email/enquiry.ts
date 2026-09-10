/**
 * Enquiry emails: the notification AMPLIQ receives, and the acknowledgement the
 * sender gets back.
 *
 * Both use the shared AMPLIQ shell, so an enquiry and a booking look like they
 * came from the same company — because they did.
 */

import {
  ACCENT,
  detailsTable,
  emailShell,
  escapeHtml,
  eyebrow,
  FONT,
  GRAPHITE,
  heading,
  lead,
  paragraphs,
  row,
  textFooter,
} from "@/lib/email/brand";
import type { Locale } from "@/lib/i18n";
import type { EmailContent } from "@/lib/mail";
import { contact } from "@/lib/site";

export type Enquiry = {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  /** Readable label, already resolved from the submitted value. */
  projectType?: string;
  budget?: string;
  timeline?: string;
  services: string[];
  message: string;
  locale: Locale;
};

const copy = {
  en: {
    ackSubject: "We've got your enquiry — AMPLIQ",
    ackTitle: "Thanks — that's arrived.",
    ackIntro: (name: string) =>
      `${name}, your enquiry is in front of a person, not a queue. We read every one ourselves and reply within two working days, usually sooner.`,
    ackNextTitle: "What happens next",
    ackNextBody:
      "We read what you sent, and come back either with questions worth asking or with a first view of scope and budget. If we are not the right people for it, we will say so.",
    ackCopyTitle: "What you sent us",
    ackFaster: "Rather talk it through?",
    ackFasterBody: (email: string) =>
      `Reply to this email or write to ${email} and we will find a time.`,
    ownerSubject: (name: string) => `New enquiry — ${name}`,
    ownerTitle: "A new enquiry came in.",
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    website: "Website",
    projectType: "Project type",
    budget: "Budget",
    timeline: "Timeline",
    services: "Services",
    message: "Project description",
    language: "Language",
    replyTo: (name: string) => `Reply to ${name}`,
  },
  de: {
    ackSubject: "Ihre Anfrage ist angekommen — AMPLIQ",
    ackTitle: "Danke — das ist angekommen.",
    ackIntro: (name: string) =>
      `${name}, Ihre Anfrage liegt bei einem Menschen, nicht in einer Warteschlange. Wir lesen jede selbst und antworten innerhalb von zwei Werktagen, meist früher.`,
    ackNextTitle: "Wie es weitergeht",
    ackNextBody:
      "Wir lesen Ihre Angaben und melden uns entweder mit den Fragen, die sich lohnen, oder mit einer ersten Einschätzung zu Umfang und Budget. Wenn wir nicht die Richtigen dafür sind, sagen wir das.",
    ackCopyTitle: "Ihre Angaben",
    ackFaster: "Lieber direkt sprechen?",
    ackFasterBody: (email: string) =>
      `Antworten Sie auf diese E-Mail oder schreiben Sie an ${email} — wir finden einen Termin.`,
    ownerSubject: (name: string) => `Neue Anfrage — ${name}`,
    ownerTitle: "Eine neue Anfrage ist eingegangen.",
    name: "Name",
    email: "E-Mail",
    company: "Unternehmen",
    phone: "Telefon",
    website: "Website",
    projectType: "Projektart",
    budget: "Budget",
    timeline: "Zeitrahmen",
    services: "Leistungen",
    message: "Projektbeschreibung",
    language: "Sprache",
    replyTo: (name: string) => `${name} antworten`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

function fullName(enquiry: Enquiry): string {
  return `${enquiry.firstName} ${enquiry.lastName}`.trim();
}

/** Everything AMPLIQ needs to answer without opening the site. */
export function enquiryNotification(enquiry: Enquiry): EmailContent {
  // Always English: the same person reads it whichever language was used.
  const t = copy.en;
  const name = fullName(enquiry);

  const rows = [
    row(t.name, name),
    row(t.email, enquiry.email),
    enquiry.company ? row(t.company, enquiry.company) : "",
    enquiry.phone ? row(t.phone, enquiry.phone) : "",
    enquiry.website ? row(t.website, enquiry.website) : "",
    enquiry.projectType ? row(t.projectType, enquiry.projectType) : "",
    enquiry.budget ? row(t.budget, enquiry.budget) : "",
    enquiry.timeline ? row(t.timeline, enquiry.timeline) : "",
    enquiry.services.length > 0
      ? row(t.services, enquiry.services.join(", "))
      : "",
    row(t.language, enquiry.locale.toUpperCase()),
  ].join("");

  const html = emailShell(
    [
      heading(t.ownerTitle),
      detailsTable(rows),
      eyebrow(t.message),
      paragraphs(enquiry.message),
      `<p style="margin:26px 0 0;font-family:${FONT};font-size:15px;">
    <a href="mailto:${escapeHtml(enquiry.email)}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${escapeHtml(
      t.replyTo(name),
    )}</a>
  </p>`,
    ].join("\n"),
    "en",
  );

  const text = [
    t.ownerTitle,
    "",
    `${t.name}: ${name}`,
    `${t.email}: ${enquiry.email}`,
    enquiry.company ? `${t.company}: ${enquiry.company}` : null,
    enquiry.phone ? `${t.phone}: ${enquiry.phone}` : null,
    enquiry.website ? `${t.website}: ${enquiry.website}` : null,
    enquiry.projectType ? `${t.projectType}: ${enquiry.projectType}` : null,
    enquiry.budget ? `${t.budget}: ${enquiry.budget}` : null,
    enquiry.timeline ? `${t.timeline}: ${enquiry.timeline}` : null,
    enquiry.services.length > 0
      ? `${t.services}: ${enquiry.services.join(", ")}`
      : null,
    `${t.language}: ${enquiry.locale.toUpperCase()}`,
    "",
    `${t.message}:`,
    enquiry.message,
    ...textFooter("en"),
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject: t.ownerSubject(name), html, text };
}

/** The acknowledgement the sender receives, in their own language. */
export function enquiryAcknowledgement(enquiry: Enquiry): EmailContent {
  const t = copy[enquiry.locale];
  const firstName = enquiry.firstName || fullName(enquiry);

  const rows = [
    enquiry.projectType ? row(t.projectType, enquiry.projectType) : "",
    enquiry.budget ? row(t.budget, enquiry.budget) : "",
    enquiry.timeline ? row(t.timeline, enquiry.timeline) : "",
    enquiry.services.length > 0
      ? row(t.services, enquiry.services.join(", "))
      : "",
  ]
    .filter(Boolean)
    .join("");

  const html = emailShell(
    [
      heading(t.ackTitle),
      lead(t.ackIntro(firstName)),
      eyebrow(t.ackNextTitle),
      `<p style="margin:0 0 26px;font-family:${FONT};font-size:15px;line-height:1.6;color:${GRAPHITE};">${escapeHtml(
        t.ackNextBody,
      )}</p>`,
      rows ? eyebrow(t.ackCopyTitle) + detailsTable(rows) : "",
      eyebrow(t.message),
      paragraphs(enquiry.message),
      eyebrow(t.ackFaster),
      `<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:${GRAPHITE};">${escapeHtml(
        t.ackFasterBody(contact.project),
      )}</p>`,
    ]
      .filter(Boolean)
      .join("\n"),
    enquiry.locale,
  );

  const text = [
    t.ackTitle,
    "",
    t.ackIntro(firstName),
    "",
    `${t.ackNextTitle}: ${t.ackNextBody}`,
    "",
    `${t.message}:`,
    enquiry.message,
    "",
    `${t.ackFaster} ${t.ackFasterBody(contact.project)}`,
    ...textFooter(enquiry.locale),
  ].join("\n");

  return { subject: t.ackSubject, html, text };
}
