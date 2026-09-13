/**
 * The two emails a project enquiry sends.
 *
 * One pair, used by both routes. `/api/contact` submits a brief with no
 * meeting; `/api/booking` submits one with a booked call attached. Before this
 * there were two template files saying nearly the same thing in two voices,
 * which is how a confirmation ends up looking different depending on which
 * button the visitor happened to press.
 *
 * **The client confirmation** is warm and short, and leads with the meeting
 * when there is one. **The internal notification** is a lead sheet: sections in
 * a fixed order, every field in the same place every time, so it can be read in
 * a few seconds on a phone.
 *
 * The meeting block renders only when a booking actually succeeded — the caller
 * passes `meeting` only for a confirmed, stored booking, so the client is never
 * told a time is held when it is not.
 *
 * Both are built from the shared shell in `./brand`, and both carry a plain
 * text part: a text/plain alternative is what keeps a message out of the spam
 * folder as reliably as anything else.
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
  INK,
  INTL_TAG,
  lead,
  paragraphs,
  PAPER,
  row,
  RULE,
  textFooter,
} from "@/lib/email/brand";
import {
  formatLongDate,
  formatTime,
  formatZoneAbbreviation,
} from "@/lib/booking/time";
import type { Locale } from "@/lib/i18n";
import type { EmailContent } from "@/lib/mail";
import { contact } from "@/lib/site";

/**
 * A booked call, as both emails need to state it.
 *
 * `start` and `end` are the instants written into the calendar event, so the
 * time in the email and the time in the calendar cannot disagree. `timeZone` is
 * the visitor's, `businessTimeZone` is the one the calendar event itself is
 * pinned to — see `createEvent` in the Google provider.
 */
export type BookedMeeting = {
  /** ISO instant. The same value the calendar event was created from. */
  start: string;
  end: string;
  /** IANA zone the visitor booked in. */
  timeZone: string;
  /** Whether a calendar provider is connected at all. */
  calendarConfigured: boolean;
  /** Whether the event actually reached it. Internal mail only. */
  calendarSynced: boolean;
  /** Link to the event, when the provider returned one. */
  calendarUrl?: string;
};

/** Everything either email needs. Assembled by the route, never by a template. */
export type ProjectLead = {
  name: string;
  firstName: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  /** Readable labels, already resolved from submitted values. */
  projectType?: string;
  budget?: string;
  timeline?: string;
  services: string[];
  message: string;
  locale: Locale;
  /**
   * The agency's own zone. Used for the "submitted" line, and — when there is
   * a meeting — as the zone the calendar event is pinned to, so the email and
   * the calendar entry cannot describe one instant two ways.
   */
  businessTimeZone: string;
  /** ISO instant the form was submitted. Never used as the meeting time. */
  submittedAt: string;
  /** Present only when a booking was confirmed and stored. */
  meeting?: BookedMeeting;
};

const copy = {
  en: {
    subject: "We received your project — AMPLIQ",
    greeting: (first: string) => `Hi ${first},`,
    thanks: "Thanks for reaching out to AMPLIQ.",
    body: "We've received your project inquiry and have everything we need to review it. We're looking forward to learning more about what you're building.",
    meetingLabel: "Your meeting",
    close: "We'll be in touch soon.",
    addToCalendar: "The time above is held for you.",
    reschedule: (email: string) =>
      `Need to move it? Reply to this email or write to ${email}.`,
  },
  de: {
    subject: "Wir haben Ihr Projekt erhalten — AMPLIQ",
    greeting: (first: string) => `Hallo ${first},`,
    thanks: "danke, dass Sie sich bei AMPLIQ gemeldet haben.",
    body: "Wir haben Ihre Projektanfrage erhalten und alles, was wir für eine erste Einschätzung brauchen. Wir freuen uns darauf, mehr über Ihr Vorhaben zu erfahren.",
    meetingLabel: "Ihr Termin",
    close: "Wir melden uns in Kürze.",
    addToCalendar: "Die Zeit oben ist für Sie reserviert.",
    reschedule: (email: string) =>
      `Termin verschieben? Antworten Sie auf diese E-Mail oder schreiben Sie an ${email}.`,
  },
} satisfies Record<Locale, Record<string, unknown>>;

/**
 * `CEST` where the zone has a name, `GMT+5:30` where it does not.
 *
 * `shortOffset` — what the booking UI uses — is unambiguous but unfamiliar;
 * an email saying "Europe/Berlin (CEST)" is read correctly by someone who has
 * never thought about offsets. Falls back to the offset when the runtime has no
 * short name, which is the case for a good many zones.
 */
function zoneName(at: Date, timeZone: string, tag: string): string {
  const parts = new Intl.DateTimeFormat(tag, {
    timeZone,
    timeZoneName: "short",
  }).formatToParts(at);
  const named = parts.find((part) => part.type === "timeZoneName")?.value;
  return named || formatZoneAbbreviation(at, timeZone, tag);
}

type MeetingLines = {
  date: string;
  time: string;
  zone: string;
  /** Set only when the visitor booked from a different zone than ours. */
  ourLine: string | null;
};

/**
 * Formats one instant for a reader, in their zone and in ours.
 *
 * `Europe/Berlin (CEST)` rather than a bare offset: the abbreviation is what
 * someone recognises, and the IANA name is what removes the ambiguity when they
 * do not. The same instant is rendered in both zones, so the two lines can
 * never describe different times.
 */
function meetingLines(
  meeting: BookedMeeting,
  businessTimeZone: string,
  locale: Locale,
): MeetingLines {
  const tag = INTL_TAG[locale];
  const start = new Date(meeting.start);
  const end = new Date(meeting.end);

  const zoneLabel = (zone: string) => {
    const abbreviation = zoneName(start, zone, tag);
    return abbreviation ? `${zone} (${abbreviation})` : zone;
  };

  const sameZone = meeting.timeZone === businessTimeZone;

  return {
    date: formatLongDate(start, meeting.timeZone, tag),
    time: `${formatTime(start, meeting.timeZone, tag)} – ${formatTime(end, meeting.timeZone, tag)}`,
    zone: zoneLabel(meeting.timeZone),
    ourLine: sameZone
      ? null
      : `${formatTime(start, businessTimeZone, tag)} – ${formatTime(
          end,
          businessTimeZone,
          tag,
        )} · ${zoneLabel(businessTimeZone)}`,
  };
}

/** The panel that carries the booked time in the client's confirmation. */
function meetingPanel(lines: MeetingLines, label: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 26px;background-color:${PAPER};border:1px solid ${RULE};border-left:3px solid ${ACCENT};">
<tr><td style="padding:20px 22px;">
  <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GRAPHITE};">${escapeHtml(label)}</p>
  <p style="margin:0 0 4px;font-family:${FONT};font-size:18px;line-height:1.35;font-weight:700;color:${INK};">${escapeHtml(lines.date)}</p>
  <p style="margin:0 0 4px;font-family:${FONT};font-size:18px;line-height:1.35;font-weight:700;color:${INK};">${escapeHtml(lines.time)}</p>
  <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.5;color:${GRAPHITE};">${escapeHtml(lines.zone)}</p>
  ${
    lines.ourLine
      ? `<p style="margin:10px 0 0;font-family:${FONT};font-size:13px;line-height:1.5;color:${GRAPHITE};">${escapeHtml(lines.ourLine)}</p>`
      : ""
  }
</td></tr>
</table>`;
}

/**
 * What the client receives.
 *
 * Short by design: a confirmation is read in ten seconds, and the only thing on
 * it that needs to survive that reading is the time. Everything the visitor
 * typed is already in their sent folder; repeating it back adds length without
 * adding information.
 */
export function clientConfirmation(lead_: ProjectLead): EmailContent {
  const t = copy[lead_.locale];
  const lines = lead_.meeting
    ? meetingLines(lead_.meeting, lead_.businessTimeZone, lead_.locale)
    : null;

  const html = emailShell(
    [
      heading(t.greeting(lead_.firstName)),
      lead(`${t.thanks} ${t.body}`),
      lines ? meetingPanel(lines, t.meetingLabel) : "",
      lines
        ? `<p style="margin:0 0 26px;font-family:${FONT};font-size:14px;line-height:1.6;color:${GRAPHITE};">${escapeHtml(
            `${t.addToCalendar} ${t.reschedule(contact.project)}`,
          )}</p>`
        : "",
      `<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">${escapeHtml(
        t.close,
      )}</p>`,
    ]
      .filter(Boolean)
      .join("\n"),
    lead_.locale,
    contact.project,
  );

  const text = [
    t.greeting(lead_.firstName),
    "",
    t.thanks,
    "",
    t.body,
    ...(lines
      ? [
          "",
          t.meetingLabel.toUpperCase(),
          lines.date,
          lines.time,
          lines.zone,
          ...(lines.ourLine ? [lines.ourLine] : []),
          "",
          `${t.addToCalendar} ${t.reschedule(contact.project)}`,
        ]
      : []),
    "",
    t.close,
    // The shell's footer already signs off with the wordmark and the tagline,
    // so the body does not repeat them two lines above it.
    ...textFooter(lead_.locale, contact.project),
  ].join("\n");

  return { subject: t.subject, html, text };
}

/**
 * What AMPLIQ receives.
 *
 * Always English — the same person reads it whichever language the visitor used
 * — and always the same five sections in the same order, so a lead can be
 * judged by scanning rather than by reading. The subject carries the company
 * name because that is what an inbox list shows.
 */
export function internalNotification(lead_: ProjectLead): EmailContent {
  const tag = INTL_TAG.en;
  const lines = lead_.meeting
    ? meetingLines(lead_.meeting, lead_.businessTimeZone, "en")
    : null;
  const submitted = new Date(lead_.submittedAt);

  const contactRows = [
    row("Name", lead_.name),
    lead_.company ? row("Company", lead_.company) : "",
    row("Email", lead_.email),
    lead_.phone ? row("Phone", lead_.phone) : "",
    lead_.website ? row("Website", lead_.website) : "",
    row("Language", lead_.locale.toUpperCase()),
  ].join("");

  const projectRows = [
    lead_.projectType ? row("Project type", lead_.projectType) : "",
    lead_.services.length > 0 ? row("Services", lead_.services.join(", ")) : "",
    lead_.budget ? row("Budget", lead_.budget) : "",
    lead_.timeline ? row("Timeline", lead_.timeline) : "",
  ].join("");

  const meetingRows = lines
    ? [
        row("Date", lines.date),
        row("Time", lines.time),
        row("Timezone", lines.zone),
        lines.ourLine ? row("Their time", lines.ourLine) : "",
        // Only when a calendar is connected and the write failed. With no
        // provider configured there is nothing to have failed, and the line
        // would appear on every booking saying nothing.
        lead_.meeting?.calendarConfigured && !lead_.meeting.calendarSynced
          ? row("Calendar", "NOT written — add this event manually")
          : "",
      ].join("")
    : "";

  const zone = lead_.businessTimeZone;
  const submittedLine = `${formatLongDate(submitted, zone, tag)}, ${formatTime(
    submitted,
    zone,
    tag,
  )} ${zoneName(submitted, zone, tag)}`;

  const html = emailShell(
    [
      heading("New project inquiry"),
      lines
        ? `<p style="margin:0 0 22px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};"><strong>${escapeHtml(
            `${lines.date} · ${lines.time}`,
          )}</strong></p>`
        : "",
      eyebrow("Contact"),
      detailsTable(contactRows),
      projectRows ? eyebrow("Project") : "",
      projectRows ? detailsTable(projectRows) : "",
      eyebrow("Project details"),
      paragraphs(lead_.message),
      meetingRows ? eyebrow("Meeting") : "",
      meetingRows ? detailsTable(meetingRows) : "",
      lead_.meeting?.calendarUrl
        ? `<p style="margin:16px 0 0;font-family:${FONT};font-size:15px;"><a href="${escapeHtml(
            lead_.meeting.calendarUrl,
          )}" style="color:${ACCENT};text-decoration:none;font-weight:600;">Open the calendar event</a></p>`
        : "",
      eyebrow("Submitted"),
      `<p style="margin:0 0 22px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK};">${escapeHtml(
        submittedLine,
      )}</p>`,
      `<p style="margin:0;font-family:${FONT};font-size:15px;"><a href="mailto:${escapeHtml(
        lead_.email,
      )}" style="color:${ACCENT};text-decoration:none;font-weight:600;">Reply to ${escapeHtml(
        lead_.name,
      )}</a></p>`,
    ]
      .filter(Boolean)
      .join("\n"),
    "en",
    contact.project,
  );

  const text = [
    "NEW PROJECT INQUIRY",
    "",
    "CONTACT",
    `Name: ${lead_.name}`,
    lead_.company ? `Company: ${lead_.company}` : null,
    `Email: ${lead_.email}`,
    lead_.phone ? `Phone: ${lead_.phone}` : null,
    lead_.website ? `Website: ${lead_.website}` : null,
    `Language: ${lead_.locale.toUpperCase()}`,
    "",
    "PROJECT",
    lead_.projectType ? `Project type: ${lead_.projectType}` : null,
    lead_.services.length > 0 ? `Services: ${lead_.services.join(", ")}` : null,
    lead_.budget ? `Budget: ${lead_.budget}` : null,
    lead_.timeline ? `Timeline: ${lead_.timeline}` : null,
    "",
    "Project details:",
    lead_.message,
    ...(lines
      ? [
          "",
          "MEETING",
          `Date: ${lines.date}`,
          `Time: ${lines.time}`,
          `Timezone: ${lines.zone}`,
          lines.ourLine ? `Their time: ${lines.ourLine}` : null,
          lead_.meeting?.calendarConfigured && !lead_.meeting.calendarSynced
            ? "Calendar: NOT written — add this event manually"
            : null,
          lead_.meeting?.calendarUrl
            ? `Calendar event: ${lead_.meeting.calendarUrl}`
            : null,
        ]
      : []),
    "",
    "SUBMITTED",
    submittedLine,
    ...textFooter("en", contact.project),
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    subject: `New project inquiry — ${lead_.company || lead_.name}`,
    html,
    text,
  };
}
