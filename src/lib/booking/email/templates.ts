/**
 * Booking emails.
 *
 * Both are built from the shared AMPLIQ shell in `@/lib/email/brand`, so they
 * cannot drift away from the enquiry mails. The visitor's confirmation is
 * written in the language they booked in; the internal notification is always
 * English, because it is read by the same person either way.
 */

import {
  detailsTable,
  emailShell,
  escapeHtml,
  eyebrow,
  heading,
  INTL_TAG,
  lead,
  paragraphs,
  row,
  textFooter,
  ACCENT,
  FONT,
  GRAPHITE,
  INK,
} from "@/lib/email/brand";
import {
  formatLongDate,
  formatTime,
  formatZoneAbbreviation,
} from "@/lib/booking/time";
import type { StoredBooking } from "@/lib/booking/types";
import { type Locale, isLocale } from "@/lib/i18n";
import type { EmailContent } from "@/lib/mail";
import { contact } from "@/lib/site";

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
    meeting: "How we'll meet",
    meetingUnset:
      "Phone or video — we'll confirm which, and send any link you need, in reply to this email.",
    name: "Name",
    email: "Email",
    company: "Company",
    phone: "Phone",
    projectType: "Project type",
    project: "About the project",
    timeZone: "Timezone",
    language: "Language",
    change: "Need to move it?",
    changeBody: (email: string) =>
      `Reply to this email or write to ${email} and we will find another time.`,
    calendarNote:
      "Add it to your calendar so it does not get lost.",
    prepTitle: "Before the call",
    prepBody:
      "Nothing to prepare. If you already have a brief, a site or figures you want looked at, send them over and we will read them beforehand.",
    replyTo: (name: string) => `Reply to ${name}`,
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
    meeting: "Wie wir sprechen",
    meetingUnset:
      "Telefon oder Video — wir bestätigen es und schicken einen eventuellen Link als Antwort auf diese E-Mail.",
    name: "Name",
    email: "E-Mail",
    company: "Unternehmen",
    phone: "Telefon",
    projectType: "Projektart",
    project: "Zum Projekt",
    timeZone: "Zeitzone",
    language: "Sprache",
    change: "Termin verschieben?",
    changeBody: (email: string) =>
      `Antworten Sie einfach auf diese E-Mail oder schreiben Sie an ${email} — wir finden einen neuen Termin.`,
    calendarNote:
      "Tragen Sie den Termin am besten direkt in Ihren Kalender ein.",
    prepTitle: "Vor dem Gespräch",
    prepBody:
      "Sie müssen nichts vorbereiten. Wenn Sie ein Briefing, eine Website oder Zahlen haben, die wir uns ansehen sollen, schicken Sie sie gern vorab.",
    replyTo: (name: string) => `${name} antworten`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

function localeOf(booking: StoredBooking): Locale {
  return isLocale(booking.locale) ? booking.locale : "en";
}

/**
 * How the call actually happens.
 *
 * A standing meeting link can be published through `BOOKING_MEETING_LINK`.
 * Without one the mail says the details follow by reply — it never invents a
 * link or claims a platform the agency may not use.
 */
function meetingLine(locale: Locale): string {
  return process.env.BOOKING_MEETING_LINK || copy[locale].meetingUnset;
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

  return {
    visitorDate: formatLongDate(start, booking.timeZone, tag),
    visitorTime: `${formatTime(start, booking.timeZone, tag)}–${formatTime(
      end,
      booking.timeZone,
      tag,
    )}`,
    visitorZone: formatZoneAbbreviation(start, booking.timeZone, tag),
    businessDate: formatLongDate(start, businessTimeZone, tag),
    businessTime: `${formatTime(start, businessTimeZone, tag)}–${formatTime(
      end,
      businessTimeZone,
      tag,
    )}`,
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
  const meeting = meetingLine(locale);

  const subject =
    locale === "de"
      ? `Termin bestätigt — ${f.visitorDate}, ${f.visitorTime}`
      : `Call confirmed — ${f.visitorDate}, ${f.visitorTime}`;

  const rows = [
    row(t.when, `${f.visitorDate}, ${f.visitorTime} (${f.visitorZone})`),
    row(t.timeZone, booking.timeZone),
    f.sameZone ? "" : row(t.ourTime, `${f.businessTime} (${f.businessZone})`),
    row(t.duration, t.minutes(slotMinutes)),
    row(t.meeting, meeting),
    row(t.name, booking.name),
    booking.company ? row(t.company, booking.company) : "",
  ].join("");

  const html = emailShell(
    [
      heading(t.confirmedTitle),
      lead(t.confirmedIntro(firstName)),
      detailsTable(rows),
      `<p style="margin:22px 0 0;font-family:${FONT};font-size:14px;line-height:1.6;color:${GRAPHITE};">${escapeHtml(
        t.calendarNote,
      )}</p>`,
      eyebrow(t.project),
      paragraphs(booking.message),
      eyebrow(t.prepTitle),
      `<p style="margin:0 0 26px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">${escapeHtml(
        t.prepBody,
      )}</p>`,
      eyebrow(t.change),
      `<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">${escapeHtml(
        t.changeBody(contact.info),
      )}</p>`,
    ].join("\n"),
    locale,
  );

  const text = [
    t.confirmedTitle,
    "",
    t.confirmedIntro(firstName),
    "",
    `${t.when}: ${f.visitorDate}, ${f.visitorTime} (${f.visitorZone})`,
    `${t.timeZone}: ${booking.timeZone}`,
    f.sameZone ? null : `${t.ourTime}: ${f.businessTime} (${f.businessZone})`,
    `${t.duration}: ${t.minutes(slotMinutes)}`,
    `${t.meeting}: ${meeting}`,
    `${t.name}: ${booking.name}`,
    booking.company ? `${t.company}: ${booking.company}` : null,
    "",
    `${t.project}:`,
    booking.message,
    "",
    t.calendarNote,
    "",
    `${t.prepTitle}: ${t.prepBody}`,
    "",
    `${t.change} ${t.changeBody(contact.info)}`,
    ...textFooter(locale),
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject, html, text };
}

/** The notification AMPLIQ receives. */
export function ownerNotification(
  booking: StoredBooking,
  businessTimeZone: string,
  slotMinutes: number,
): EmailContent {
  // Always English: the same person reads it whichever language was booked in.
  const locale: Locale = "en";
  const t = copy[locale];
  const f = formatBooking(booking, businessTimeZone, locale);

  const rows = [
    row(t.when, `${f.businessDate}, ${f.businessTime} (${f.businessZone})`),
    f.sameZone
      ? ""
      : row(t.yourTime, `${f.visitorTime} (${f.visitorZone})`),
    row(t.timeZone, booking.timeZone),
    row(t.duration, t.minutes(slotMinutes)),
    row(t.name, booking.name),
    row(t.email, booking.email),
    booking.company ? row(t.company, booking.company) : "",
    booking.phone ? row(t.phone, booking.phone) : "",
    booking.projectType ? row(t.projectType, booking.projectType) : "",
    row(t.language, booking.locale.toUpperCase()),
  ].join("");

  const html = emailShell(
    [
      heading(t.ownerTitle),
      detailsTable(rows),
      eyebrow(t.project),
      paragraphs(booking.message),
      `<p style="margin:26px 0 0;font-family:${FONT};font-size:15px;">
    <a href="mailto:${escapeHtml(booking.email)}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${escapeHtml(
      t.replyTo(booking.name),
    )}</a>
  </p>`,
    ].join("\n"),
    locale,
  );

  const text = [
    t.ownerTitle,
    "",
    `${t.when}: ${f.businessDate}, ${f.businessTime} (${f.businessZone})`,
    f.sameZone ? null : `${t.yourTime}: ${f.visitorTime} (${f.visitorZone})`,
    `${t.timeZone}: ${booking.timeZone}`,
    `${t.duration}: ${t.minutes(slotMinutes)}`,
    `${t.name}: ${booking.name}`,
    `${t.email}: ${booking.email}`,
    booking.company ? `${t.company}: ${booking.company}` : null,
    booking.phone ? `${t.phone}: ${booking.phone}` : null,
    booking.projectType ? `${t.projectType}: ${booking.projectType}` : null,
    `${t.language}: ${booking.locale.toUpperCase()}`,
    "",
    `${t.project}:`,
    booking.message,
    ...textFooter(locale),
  ]
    .filter((line) => line !== null)
    .join("\n");

  return { subject: t.ownerSubject(booking.name), html, text };
}
