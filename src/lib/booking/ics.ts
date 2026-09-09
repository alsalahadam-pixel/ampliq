/**
 * iCalendar file for the "add to calendar" button.
 *
 * Built in the browser from what the visitor already knows about their own
 * booking, so it needs no round trip and reveals nothing about anyone else's
 * calendar.
 */

import { site, siteUrl } from "@/lib/site";

/** `20260409T073000Z` — the basic UTC form every calendar app accepts. */
function stamp(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

/** RFC 5545 escaping for text values. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Folds long lines to 75 octets, as the spec requires. */
function fold(line: string): string {
  if (line.length <= 75) return line;

  const parts: string[] = [line.slice(0, 75)];
  let rest = line.slice(75);
  while (rest.length > 74) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  if (rest) parts.push(` ${rest}`);

  return parts.join("\r\n");
}

export function buildIcs({
  start,
  end,
  summary,
  description,
  organiserEmail = site.email,
}: {
  start: string;
  end: string;
  summary: string;
  description: string;
  organiserEmail?: string;
}): string {
  const now = new Date();
  const uid = `${stamp(new Date(start))}-${Math.random().toString(36).slice(2, 10)}@ampliq`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AMPLIQ//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(new Date(start))}`,
    `DTEND:${stamp(new Date(end))}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `URL:${siteUrl}`,
    `ORGANIZER;CN=${escapeText(site.name)}:mailto:${organiserEmail}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(summary)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(fold).join("\r\n");
}
