/**
 * Booking configuration.
 *
 * This is the agency's side of the calendar: when calls can happen, how long
 * they run, how much gap is left around them and how far ahead the calendar
 * opens. Everything is expressed in `timeZone` — the visitor's clock is applied
 * later, at display time.
 *
 * Every value can be overridden with an environment variable so the schedule
 * can change without a code deploy. The defaults below are the published
 * schedule; nothing here is derived from a real calendar.
 */

import { parseClock } from "@/lib/booking/time";

/** A working window inside one day, as `HH:MM` in the business timezone. */
export type WorkingWindow = { start: string; end: string };

/** Keyed by weekday, 0 = Sunday. A missing day is a day with no calls. */
export type WorkingHours = Partial<Record<number, WorkingWindow[]>>;

export type BookingConfig = {
  timeZone: string;
  /** Length of the call itself, in minutes. */
  slotMinutes: number;
  /** Protected gap kept after every call, in minutes. Not shown to visitors. */
  bufferMinutes: number;
  /** How far ahead a booking must be made, in hours. */
  minimumNoticeHours: number;
  /** How far into the future the calendar opens, in days. */
  horizonDays: number;
  /** Grid spacing. Slots begin every `stepMinutes` inside a working window. */
  stepMinutes: number;
  workingHours: WorkingHours;
  /**
   * Dates with no calls regardless of working hours, as `YYYY-MM-DD` in the
   * business timezone: public holidays, closures, holidays.
   *
   * Empty by default. Nothing is assumed about which days the agency takes off
   * — the owner fills this in, or connects a calendar and blocks the days
   * there, where it also drives the freebusy lookup.
   */
  blackoutDates: string[];
};

function readInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function readList(name: string): string[] {
  const raw = process.env[name];
  if (!raw) return [];

  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

/**
 * Parses `BOOKING_WORKING_HOURS`, e.g.
 *   `mon-thu 09:30-12:30,13:30-17:30; fri 09:30-13:00`
 *
 * Returns null when the variable is unset or unparseable, so the caller falls
 * back to the published defaults rather than silently opening no days at all.
 */
const WEEKDAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function parseWorkingHours(raw: string | undefined): WorkingHours | null {
  if (!raw) return null;

  const hours: WorkingHours = {};

  for (const group of raw.split(";")) {
    const trimmed = group.trim();
    if (!trimmed) continue;

    const [daysPart, ...rest] = trimmed.split(/\s+/);
    const windowsPart = rest.join("");
    if (!daysPart || !windowsPart) return null;

    const days: number[] = [];
    for (const token of daysPart.toLowerCase().split(",")) {
      const range = token.split("-");
      const from = WEEKDAY_NAMES.indexOf(range[0]);
      const to = range.length > 1 ? WEEKDAY_NAMES.indexOf(range[1]) : from;
      if (from < 0 || to < 0) return null;

      for (let day = from; ; day = (day + 1) % 7) {
        days.push(day);
        if (day === to) break;
      }
    }

    const windows: WorkingWindow[] = [];
    for (const token of windowsPart.split(",")) {
      const [start, end] = token.split("-");
      if (
        parseClock(start ?? "") === null ||
        parseClock(end ?? "") === null ||
        parseClock(start)! >= parseClock(end)!
      ) {
        return null;
      }
      windows.push({ start, end });
    }

    for (const day of days) {
      hours[day] = [...(hours[day] ?? []), ...windows];
    }
  }

  return Object.keys(hours).length > 0 ? hours : null;
}

/**
 * The published schedule: weekday mornings and afternoons, Friday mornings,
 * with a lunch break that is simply the gap between two windows.
 */
const DEFAULT_WORKING_HOURS: WorkingHours = {
  1: [
    { start: "09:30", end: "12:30" },
    { start: "13:30", end: "17:30" },
  ],
  2: [
    { start: "09:30", end: "12:30" },
    { start: "13:30", end: "17:30" },
  ],
  3: [
    { start: "09:30", end: "12:30" },
    { start: "13:30", end: "17:30" },
  ],
  4: [
    { start: "09:30", end: "12:30" },
    { start: "13:30", end: "17:30" },
  ],
  5: [{ start: "09:30", end: "13:00" }],
};

export const bookingConfig: BookingConfig = {
  timeZone: process.env.BOOKING_TIMEZONE || "Europe/Berlin",
  slotMinutes: readInt("BOOKING_SLOT_MINUTES", 30),
  bufferMinutes: readInt("BOOKING_BUFFER_MINUTES", 15),
  minimumNoticeHours: readInt("BOOKING_MINIMUM_NOTICE_HOURS", 24),
  horizonDays: readInt("BOOKING_HORIZON_DAYS", 60),
  stepMinutes: readInt("BOOKING_STEP_MINUTES", 30),
  workingHours:
    parseWorkingHours(process.env.BOOKING_WORKING_HOURS) ??
    DEFAULT_WORKING_HOURS,
  blackoutDates: readList("BOOKING_BLACKOUT_DATES"),
};

/**
 * The public half of the configuration.
 *
 * Sent to the browser so the calendar can be drawn before — and, in a static
 * export, without — an availability call. It carries no credentials and nothing
 * about the owner's actual calendar.
 */
export type PublicBookingConfig = {
  timeZone: string;
  slotMinutes: number;
  minimumNoticeHours: number;
  horizonDays: number;
  stepMinutes: number;
  workingHours: WorkingHours;
  blackoutDates: string[];
};

export function publicBookingConfig(
  config: BookingConfig = bookingConfig,
): PublicBookingConfig {
  const {
    timeZone,
    slotMinutes,
    minimumNoticeHours,
    horizonDays,
    stepMinutes,
    workingHours,
    blackoutDates,
  } = config;

  return {
    timeZone,
    slotMinutes,
    minimumNoticeHours,
    horizonDays,
    stepMinutes,
    workingHours,
    blackoutDates,
  };
}
