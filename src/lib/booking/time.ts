/**
 * Timezone arithmetic, without a date library.
 *
 * The booking system has to hold three clocks at once: the working hours are
 * defined in the agency's timezone, the visitor sees their own, and everything
 * in between is stored as a UTC instant. `Intl.DateTimeFormat` already knows
 * every IANA zone and its DST history, so the conversions below use it rather
 * than shipping a copy of the tz database to the browser.
 *
 * Everything here is pure and isomorphic — the same functions run on the server
 * when checking a booking and in the browser when drawing the calendar.
 */

/** A wall-clock reading, with no timezone attached. */
export type WallTime = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number;
  minute: number;
};

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

const partsFormatterCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = partsFormatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
    partsFormatterCache.set(timeZone, formatter);
  }
  return formatter;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export type ZonedParts = WallTime & {
  second: number;
  /** 0 = Sunday, matching `Date.prototype.getDay`. */
  weekday: number;
};

/** Reads an instant as wall-clock time in the given zone. */
export function toZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = partsFormatter(timeZone).formatToParts(date);
  const lookup: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") lookup[part.type] = part.value;
  }

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    // Some engines render midnight as hour 24 under hour12: false.
    hour: Number(lookup.hour) % 24,
    minute: Number(lookup.minute),
    second: Number(lookup.second),
    weekday: WEEKDAY_INDEX[lookup.weekday] ?? 0,
  };
}

/**
 * The zone's offset from UTC at a given instant, in minutes east of UTC
 * (Berlin in winter → +60).
 */
export function zoneOffsetMinutes(date: Date, timeZone: string): number {
  const parts = toZonedParts(date, timeZone);
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  // `date` may carry milliseconds the formatter dropped; ignore them.
  return (asUtc - Math.floor(date.getTime() / 1000) * 1000) / MINUTE;
}

/**
 * Turns a wall-clock reading in `timeZone` into the UTC instant it names.
 *
 * The offset depends on the answer, so this guesses with UTC, corrects with the
 * offset in force at that guess, then re-checks — the standard two-pass fix for
 * the hour either side of a DST transition.
 */
export function fromZonedTime(wall: WallTime, timeZone: string): Date {
  const guess = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
  );

  const firstOffset = zoneOffsetMinutes(new Date(guess), timeZone);
  let instant = guess - firstOffset * MINUTE;

  const secondOffset = zoneOffsetMinutes(new Date(instant), timeZone);
  if (secondOffset !== firstOffset) {
    instant = guess - secondOffset * MINUTE;
  }

  return new Date(instant);
}

/**
 * Whether a wall-clock reading actually happens in a zone.
 *
 * On the spring-forward morning a zone skips an hour outright: 02:30 does not
 * exist in Berlin on the last Sunday in March. Round-tripping such a reading
 * lands on a different time, which is how we detect it — those slots are marked
 * unavailable rather than silently sliding an hour.
 */
export function wallTimeExists(wall: WallTime, timeZone: string): boolean {
  const instant = fromZonedTime(wall, timeZone);
  const roundTrip = toZonedParts(instant, timeZone);
  return (
    roundTrip.year === wall.year &&
    roundTrip.month === wall.month &&
    roundTrip.day === wall.day &&
    roundTrip.hour === wall.hour &&
    roundTrip.minute === wall.minute
  );
}

/** `YYYY-MM-DD` for a wall-clock date. */
export function toDateKey(wall: Pick<WallTime, "year" | "month" | "day">): string {
  const month = String(wall.month).padStart(2, "0");
  const day = String(wall.day).padStart(2, "0");
  return `${wall.year}-${month}-${day}`;
}

/** The calendar date an instant falls on, in the given zone. */
export function dateKeyInZone(date: Date, timeZone: string): string {
  return toDateKey(toZonedParts(date, timeZone));
}

/** Parses `YYYY-MM-DD`. Returns null for anything else, including `2026-02-31`. */
export function parseDateKey(
  value: string,
): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  // Reject dates that rolled over, e.g. 31 February.
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

/** Parses `YYYY-MM`. */
export function parseMonthKey(
  value: string,
): { year: number; month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;

  return { year, month };
}

/** `YYYY-MM` for a wall-clock date. */
export function toMonthKey(wall: Pick<WallTime, "year" | "month">): string {
  return `${wall.year}-${String(wall.month).padStart(2, "0")}`;
}

/** Adds days to a `YYYY-MM-DD` key, staying on the calendar rather than a clock. */
export function addDaysToDateKey(dateKey: string, days: number): string {
  const parsed = parseDateKey(dateKey);
  if (!parsed) return dateKey;

  const shifted = new Date(
    Date.UTC(parsed.year, parsed.month - 1, parsed.day + days),
  );
  return toDateKey({
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
  });
}

/** Days in a month, 1-indexed month. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Weekday (0 = Sunday) the given calendar date falls on. */
export function weekdayOf(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Minutes since midnight for `HH:MM`. Returns null if malformed. */
export function parseClock(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;

  return hour * 60 + minute;
}

/**
 * The visitor's IANA zone, or the fallback when the browser will not say.
 *
 * Only ever called from the client after mount — reading it during render
 * would produce different HTML on the server and rehydrate into a mismatch.
 */
export function detectTimeZone(fallback: string): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || fallback;
  } catch {
    return fallback;
  }
}

const timeFormatterCache = new Map<string, Intl.DateTimeFormat>();

/** `14:30` in the given zone and locale. */
export function formatTime(
  date: Date,
  timeZone: string,
  locale: string,
): string {
  const key = `t:${timeZone}:${locale}`;
  let formatter = timeFormatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
    });
    timeFormatterCache.set(key, formatter);
  }
  return formatter.format(date);
}

/** `Thursday, 12 March 2026` in the given zone and locale. */
export function formatLongDate(
  date: Date,
  timeZone: string,
  locale: string,
): string {
  const key = `d:${timeZone}:${locale}`;
  let formatter = timeFormatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    timeFormatterCache.set(key, formatter);
  }
  return formatter.format(date);
}

/** `March 2026`, for the calendar header. */
export function formatMonthLabel(
  year: number,
  month: number,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

/**
 * `GMT+1` — the short zone name for the visitor's offset.
 *
 * Shown next to every time so a visitor in another country can see at a glance
 * which clock the slot is quoted in.
 */
export function formatZoneAbbreviation(
  date: Date,
  timeZone: string,
  locale: string,
): string {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(date);

  return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
}
