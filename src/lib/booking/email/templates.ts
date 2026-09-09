/**
 * Booking emails, in the AMPLIQ brand.
 *
 * Written as tables with inline styles because that is what mail clients
 * actually render — Outlook has no flexbox and Gmail strips `<style>` blocks.
 * The mark is drawn as a letterspaced wordmark rather than an image: SVG does
 * not render in Gmail, and a remote PNG is blocked until the reader chooses to
 * load images, which would leave the header empty for most people.
 *
 * Both mails are sent in the language the visitor booked in.
 */

import { formatLongDate, formatTime, formatZoneAbbreviation } from "@/lib/booking/time";
import type { StoredBooking } from "@/lib/booking/types";
import { type Locale, isLocale } from "@/lib/i18n";
import { site, siteUrl } from "@/lib/site";

const INK = "#0f0f0e";
const PAPER = "#f7f5f2";
const GRAPHITE = "#6b6862";
const ACCENT = "#1b4dff";
const RULE = "#e3ded6";

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

const copy = {
  en: {
    confirmedTitle: "Your call is confirmed.",
    confirmedIntro: (name: string) =>
      `Thanks ${name} — the time below is held for you. We read what you sent before we call, so the conversation can start where it matters.`,
    ownerSubject: (name: string) => `New booking — ${name}`,
    ownerTitle: "A call has been booked.",
    when: "When",
    duration: "Duration",
    minutes: (count: number) => `${count} minutes`,
    yourTime: "Your time",
    ourTime: "Our time",
    details: "What you told us",
    who: "Who",
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    project: "Project",
    timeZone: "Timezone",
    change: "Need to move it?",
    changeBody: (email: string) =>
      `Reply to this email or write to ${email} and we will find another time.`,
    calendarNote:
      "Add it to your calendar so it does not get lost — we will call you at the number or address above.",
    prepTitle: "Before the call",
    prepBody:
      "Nothing to prepare. If you already have a brief, a site or figures you want looked at, send them over and we will read them beforehand.",
    footerTagline: "Marketing, amplified.",
  },
  de: {
    confirmedTitle: "Ihr Termin steht.",
    confirmedIntro: (name: string) =>
      `Danke ${name} — die Zeit unten ist für Sie reserviert. Wir lesen Ihre Angaben vor dem Gespräch, damit wir direkt beim Wesentlichen anfangen können.`,
    ownerSubject: (name: string) => `Neue Buchung — ${name}`,
    ownerTitle: "Ein Termin wurde gebucht.",
    when: "Wann",
    duration: "Dauer",
    minutes: (count: number) => `${count} Minuten`,
    yourTime: "Ihre Zeit",
    ourTime: "Unsere Zeit",
    details: "Was Sie uns geschrieben haben",
    who: "Wer",
    name: "Name",
    email: "E-Mail",
    company: "Unternehmen",
    phone: "Telefon",
    project: "Projekt",
    timeZone: "Zeitzone",
    change: "Termin verschieben?",
    changeBody: (email: string) =>
      `Antworten Sie einfach auf diese E-Mail oder schreiben Sie an ${email} — wir finden einen neuen Termin.`,
    calendarNote:
      "Tragen Sie den Termin am besten direkt in Ihren Kalender ein — wir melden uns unter den oben genannten Kontaktdaten.",
    prepTitle: "Vor dem Gespräch",
    prepBody:
      "Sie müssen nichts vorbereiten. Wenn Sie ein Briefing, eine Website oder Zahlen haben, die wir uns ansehen sollen, schicken Sie sie gern vorab.",
    footerTagline: "Marketing, verstärkt.",
  },
} satisfies Record<Locale, Record<string, unknown>>;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Preserves the paragraph breaks the visitor typed. */
function paragraphs(value: string): string {
  return escapeHtml(value)
    .split(/\n{2,}/)
    .map(
      (block) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${INK}">${block.replace(
          /\n/g,
          "<br>",
        )}</p>`,
    )
    .join("");
}

function localeOf(booking: StoredBooking): Locale {
  return isLocale(booking.locale) ? booking.locale : "en";
}

/** BCP-47 tag for the formatters. */
const INTL_TAG: Record<Locale, string> = { en: "en-GB", de: "de-DE" };

function shell(bodyHtml: string, locale: Locale): string {
  const t = copy[locale];

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>AMPLIQ</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border:1px solid ${RULE};">

<tr><td style="padding:28px 32px 24px;border-bottom:1px solid ${RULE};">
  <span style="font-family:${FONT};font-size:17px;font-weight:700;letter-spacing:0.22em;color:${INK};">AMPLIQ</span>
</td></tr>

${bodyHtml}

<tr><td style="padding:24px 32px 28px;border-top:1px solid ${RULE};background-color:${PAPER};">
  <p style="margin:0 0 6px;font-family:${FONT};font-size:13px;line-height:1.5;color:${GRAPHITE};">
    AMPLIQ — ${t.footerTagline}
  </p>
  <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.5;color:${GRAPHITE};">
    <a href="${siteUrl}" style="color:${ACCENT};text-decoration:none;">${siteUrl.replace(/^https?:\/\//, "")}</a>
    &nbsp;·&nbsp;
    <a href="mailto:${site.email}" style="color:${ACCENT};text-decoration:none;">${site.email}</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${RULE};font-family:${FONT};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${GRAPHITE};width:38%;vertical-align:top;">${escapeHtml(label)}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${RULE};font-family:${FONT};font-size:15px;line-height:1.5;color:${INK};vertical-align:top;">${escapeHtml(value)}</td>
</tr>`;
}

type Formatted = {
  visitorDate: string;
  visitorTime: string;
  visitorZone: string;
  businessDate: string;
  businessTime: string;
  businessZone: string;
  sameZone: boolean;
};

function formatBooking(
  booking: StoredBooking,
  businessTimeZone: string,
  locale: Locale,
): Formatted {
  const start = new Date(booking.start);
  const end = new Date(booking.end);
  const tag = INTL_TAG[locale];

  const visitorTime = `${formatTime(start, booking.timeZone, tag)}–${formatTime(
    end,
    booking.timeZone,
    tag,
  )}`;
  const businessTime = `${formatTime(
    start,
    businessTimeZone,
    tag,
  )}–${formatTime(end, businessTimeZone, tag)}`;

  return {
    visitorDate: formatLongDate(start, booking.timeZone, tag),
    visitorTime,
    visitorZone: formatZoneAbbreviation(start, booking.timeZone, tag),
    businessDate: formatLongDate(start, businessTimeZone, tag),
    businessTime,
    businessZone: formatZoneAbbreviation(start, businessTimeZone, tag),
    sameZone: booking.timeZone === businessTimeZone,
  };
}

/** The confirmation the visitor receives. */
export function clientConfirmation(
  booking: StoredBooking,
  businessTimeZone: string,
  slotMinutes: number,
): EmailContent {
  const locale = localeOf(booking);
  const t = copy[locale];
  const f = formatBooking(booking, businessTimeZone, locale);
  const firstName = booking.name.split(/\s+/)[0] || booking.name;

  const subject =
    locale === "de"
      ? `Termin bestätigt — ${f.visitorDate}, ${f.visitorTime}`
      : `Call confirmed — ${f.visitorDate}, ${f.visitorTime}`;

  const rows = [
    row(t.when, `${f.visitorDate}, ${f.visitorTime} (${f.visitorZone})`),
    f.sameZone
      ? ""
      : row(t.ourTime, `${f.businessTime} (${f.businessZone})`),
    row(t.duration, t.minutes(slotMinutes)),
  ].join("");

  const html = shell(
    `<tr><td style="padding:32px;">
  <h1 style="margin:0 0 14px;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${INK};">${escapeHtml(
    t.confirmedTitle,
  )}</h1>
  <p style="margin:0 0 26px;font-family:${FONT};font-size:15px;line-height:1.6;color:${GRAPHITE};">${escapeHtml(
    t.confirmedIntro(firstName),
  )}</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};">
    ${rows}
  </table>

  <p style="margin:22px 0 0;font-family:${FONT};font-size:14px;line-height:1.6;color:${GRAPHITE};">${escapeHtml(
    t.calendarNote,
  )}</p>

  <h2 style="margin:30px 0 8px;font-family:${FONT};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GRAPHITE};">${escapeHtml(
    t.prepTitle,
  )}</h2>
  <p style="margin:0 0 26px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">${escapeHtml(
    t.prepBody,
  )}</p>

  <h2 style="margin:0 0 8px;font-family:${FONT};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GRAPHITE};">${escapeHtml(
    t.change,
  )}</h2>
  <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">${escapeHtml(
    t.changeBody(site.email),
  )}</p>
</td></tr>`,
    locale,
  );

  const text = [
    t.confirmedTitle,
    "",
    t.confirmedIntro(firstName),
    "",
    `${t.when}: ${f.visitorDate}, ${f.visitorTime} (${f.visitorZone})`,
    f.sameZone ? null : `${t.ourTime}: ${f.businessTime} (${f.businessZone})`,
    `${t.duration}: ${t.minutes(slotMinutes)}`,
    "",
    t.calendarNote,
    "",
    `${t.prepTitle}: ${t.prepBody}`,
    "",
    `${t.change} ${t.changeBody(site.email)}`,
    "",
    `AMPLIQ — ${t.footerTagline}`,
    siteUrl,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}

/** The notification the owner receives. */
export function ownerNotification(
  booking: StoredBooking,
  businessTimeZone: string,
  slotMinutes: number,
): EmailContent {
  // The owner reads their own mail in the site's primary language, whichever
  // language the visitor booked in.
  const locale: Locale = "en";
  const t = copy[locale];
  const f = formatBooking(booking, businessTimeZone, locale);

  const rows = [
    row(t.when, `${f.businessDate}, ${f.businessTime} (${f.businessZone})`),
    f.sameZone
      ? ""
      : row(
          t.yourTime,
          `${f.visitorTime} (${f.visitorZone}) — ${booking.timeZone}`,
        ),
    row(t.duration, t.minutes(slotMinutes)),
    row(t.name, booking.name),
    row(t.email, booking.email),
    booking.company ? row(t.company, booking.company) : "",
    booking.phone ? row(t.phone, booking.phone) : "",
    row(t.timeZone, booking.timeZone),
    row("Language", booking.locale.toUpperCase()),
  ].join("");

  const html = shell(
    `<tr><td style="padding:32px;">
  <h1 style="margin:0 0 22px;font-family:${FONT};font-size:24px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${INK};">${escapeHtml(
    t.ownerTitle,
  )}</h1>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};">
    ${rows}
  </table>

  <h2 style="margin:28px 0 10px;font-family:${FONT};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GRAPHITE};">${escapeHtml(
    t.project,
  )}</h2>
  ${paragraphs(booking.message)}

  <p style="margin:26px 0 0;font-family:${FONT};font-size:15px;">
    <a href="mailto:${escapeHtml(booking.email)}" style="color:${ACCENT};text-decoration:none;font-weight:600;">Reply to ${escapeHtml(
      booking.name,
    )}</a>
  </p>
</td></tr>`,
    locale,
  );

  const text = [
    t.ownerTitle,
    "",
    `${t.when}: ${f.businessDate}, ${f.businessTime} (${f.businessZone})`,
    f.sameZone
      ? null
      : `${t.yourTime}: ${f.visitorTime} (${f.visitorZone}) — ${booking.timeZone}`,
    `${t.duration}: ${t.minutes(slotMinutes)}`,
    `${t.name}: ${booking.name}`,
    `${t.email}: ${booking.email}`,
    booking.company ? `${t.company}: ${booking.company}` : null,
    booking.phone ? `${t.phone}: ${booking.phone}` : null,
    `${t.timeZone}: ${booking.timeZone}`,
    `Language: ${booking.locale.toUpperCase()}`,
    "",
    `${t.project}:`,
    booking.message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    subject: t.ownerSubject(booking.name),
    html,
    text,
  };
}
