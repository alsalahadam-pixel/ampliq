/**
 * The availability engine.
 *
 * Pure, isomorphic and provider-free: it takes the published working hours, a
 * list of busy intervals and the current time, and returns the grid of slots.
 * It has no idea where the busy intervals came from — a connected calendar,
 * bookings made on this site, or nothing at all — which is what keeps the
 * calendar UI and the provider integration separable.
 */

import {
  type PublicBookingConfig,
  type WorkingWindow,
} from "@/lib/booking/config";
import type { BusyInterval, DaySummary, Slot } from "@/lib/booking/types";
import {
  DAY,
  HOUR,
  MINUTE,
  addDaysToDateKey,
  dateKeyInZone,
  daysInMonth,
  fromZonedTime,
  parseClock,
  parseDateKey,
  toDateKey,
  wallTimeExists,
  weekdayOf,
} from "@/lib/booking/time";

export type AvailabilityInput = {
  config: PublicBookingConfig;
  /** Busy blocks, already widened by the buffer if one applies. */
  busy: BusyInterval[];
  /** "Now" — passed in rather than read, so the function stays pure. */
  now: Date;
};

type Interval = { start: number; end: number };

function toIntervals(busy: BusyInterval[]): Interval[] {
  const intervals: Interval[] = [];

  for (const entry of busy) {
    const start = Date.parse(entry.start);
    const end = Date.parse(entry.end);
    if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
      intervals.push({ start, end });
    }
  }

  return intervals.sort((a, b) => a.start - b.start);
}

/**
 * Widens each busy block by the buffer on both sides, so a call is never
 * booked hard against another commitment.
 */
export function applyBuffer(
  busy: BusyInterval[],
  bufferMinutes: number,
): BusyInterval[] {
  if (bufferMinutes <= 0) return busy;

  const padding = bufferMinutes * MINUTE;
  return busy.map((entry) => ({
    start: new Date(Date.parse(entry.start) - padding).toISOString(),
    end: new Date(Date.parse(entry.end) + padding).toISOString(),
  }));
}

function overlaps(slot: Interval, intervals: Interval[]): boolean {
  for (const interval of intervals) {
    // Sorted by start, so once an interval begins after the slot ends the
    // rest cannot overlap either.
    if (interval.start >= slot.end) return false;
    if (interval.end > slot.start) return true;
  }
  return false;
}

/** The first instant that may be booked, given the notice requirement. */
function earliestBookable(input: AvailabilityInput): number {
  return input.now.getTime() + input.config.minimumNoticeHours * HOUR;
}

/** The last instant that may be booked, given the horizon. */
function latestBookable(input: AvailabilityInput): number {
  return input.now.getTime() + input.config.horizonDays * DAY;
}

/**
 * Every slot the working hours define for one calendar date, marked available
 * or not. Days outside the working hours return an empty list.
 */
export function slotsForDate(
  dateKey: string,
  input: AvailabilityInput,
): Slot[] {
  const { config } = input;
  const parsed = parseDateKey(dateKey);
  if (!parsed) return [];

  if (config.blackoutDates.includes(dateKey)) return [];

  const weekday = weekdayOf(parsed.year, parsed.month, parsed.day);
  const windows: WorkingWindow[] = config.workingHours[weekday] ?? [];
  if (windows.length === 0) return [];

  const intervals = toIntervals(input.busy);
  const notBefore = earliestBookable(input);
  const notAfter = latestBookable(input);
  const nowMs = input.now.getTime();

  const slots: Slot[] = [];

  for (const window of windows) {
    const windowStart = parseClock(window.start);
    const windowEnd = parseClock(window.end);
    if (windowStart === null || windowEnd === null) continue;

    for (
      let minutes = windowStart;
      minutes + config.slotMinutes <= windowEnd;
      minutes += config.stepMinutes
    ) {
      const wall = {
        year: parsed.year,
        month: parsed.month,
        day: parsed.day,
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
      };

      const start = fromZonedTime(wall, config.timeZone);
      const startMs = start.getTime();
      const endMs = startMs + config.slotMinutes * MINUTE;

      const slot: Slot = {
        start: start.toISOString(),
        end: new Date(endMs).toISOString(),
        available: true,
      };

      if (!wallTimeExists(wall, config.timeZone)) {
        // The clock skipped this reading entirely (DST spring forward).
        slot.available = false;
        slot.reason = "invalid";
      } else if (startMs < nowMs) {
        slot.available = false;
        slot.reason = "past";
      } else if (startMs < notBefore || startMs > notAfter) {
        slot.available = false;
        slot.reason = "notice";
      } else if (overlaps({ start: startMs, end: endMs }, intervals)) {
        slot.available = false;
        slot.reason = "busy";
      }

      slots.push(slot);
    }
  }

  return slots.sort((a, b) => a.start.localeCompare(b.start));
}

/**
 * Why a day with working hours has nothing bookable left.
 *
 * "Busy" only when something genuinely occupies the diary — a day that is
 * merely too soon, or already over, reports that instead, so the calendar never
 * shows an empty diary as a full one.
 */
function blockedBy(slots: Slot[]): DaySummary["blockedBy"] {
  if (slots.every((slot) => slot.reason === "past")) return "past";
  if (slots.some((slot) => slot.reason === "busy")) return "busy";
  return "notice";
}

/** Slot counts per day, for drawing the month grid. */
export function summariseDays(
  dateKeys: string[],
  input: AvailabilityInput,
): DaySummary[] {
  return dateKeys.map((date) => {
    const slots = slotsForDate(date, input);
    const availableCount = slots.filter((slot) => slot.available).length;

    return {
      date,
      availableCount,
      totalCount: slots.length,
      blockedBy:
        slots.length > 0 && availableCount === 0 ? blockedBy(slots) : undefined,
    };
  });
}

/** Every `YYYY-MM-DD` in a month, in order. */
export function datesInMonth(year: number, month: number): string[] {
  const total = daysInMonth(year, month);
  const dates: string[] = [];

  for (let day = 1; day <= total; day += 1) {
    dates.push(toDateKey({ year, month, day }));
  }

  return dates;
}

/** The window of dates the calendar may show, in the business timezone. */
export function bookableRange(
  config: PublicBookingConfig,
  now: Date,
): { from: string; to: string } {
  const today = dateKeyInZone(now, config.timeZone);

  return {
    from: today,
    to: addDaysToDateKey(today, config.horizonDays),
  };
}

/**
 * Whether one specific start instant is bookable.
 *
 * The server calls this again at submit time with freshly fetched busy data,
 * which is what actually prevents a double booking: two visitors can be looking
 * at the same free slot, but only the first POST to land finds it open.
 */
export function isSlotBookable(
  startIso: string,
  input: AvailabilityInput,
): boolean {
  const startMs = Date.parse(startIso);
  if (!Number.isFinite(startMs)) return false;

  const dateKey = dateKeyInZone(new Date(startMs), input.config.timeZone);

  return slotsForDate(dateKey, input).some(
    (slot) => slot.available && Date.parse(slot.start) === startMs,
  );
}
