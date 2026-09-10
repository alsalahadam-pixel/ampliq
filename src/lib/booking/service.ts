/**
 * Booking service — the only place the calendar provider, the booking store and
 * the availability engine meet.
 *
 * Both API routes call in here, so the rule that a slot is re-checked against
 * fresh data at submit time lives in one function rather than being restated
 * per route.
 */

import {
  applyBuffer,
  bookableRange,
  isSlotBookable,
  slotsForDate,
  summariseDays,
} from "@/lib/booking/availability";
import { bookingConfig, publicBookingConfig } from "@/lib/booking/config";
import { notificationAddress, sendEmail } from "@/lib/mail";
import {
  clientConfirmation,
  ownerNotification,
} from "@/lib/booking/email/templates";
import { CalendarProviderError, getCalendarProvider } from "@/lib/booking/providers";
import { bookingsToBusy, getBookingStore } from "@/lib/booking/store";
import { MINUTE, addDaysToDateKey, parseDateKey } from "@/lib/booking/time";
import type {
  AvailabilityMode,
  AvailabilityResponse,
  BookingRequest,
  BookingResult,
  BusyInterval,
} from "@/lib/booking/types";

/** Instants bounding a `YYYY-MM-DD` range, padded so edge slots are covered. */
function rangeToInstants(from: string, to: string): { from: Date; to: Date } {
  const start = parseDateKey(from);
  const end = parseDateKey(addDaysToDateKey(to, 1));

  return {
    // A day either side absorbs every timezone offset without special cases.
    from: new Date(Date.UTC(start!.year, start!.month - 1, start!.day - 1)),
    to: new Date(Date.UTC(end!.year, end!.month - 1, end!.day + 1)),
  };
}

type BusyResult = {
  busy: BusyInterval[];
  mode: AvailabilityMode;
};

/**
 * Everything blocking the calendar in a range: the owner's real commitments
 * when a provider is connected, plus bookings taken through this site.
 */
async function collectBusy(from: Date, to: Date): Promise<BusyResult> {
  const store = getBookingStore();
  const ownBookings = bookingsToBusy(await store.listBetween(from, to));

  const provider = getCalendarProvider();
  if (!provider) {
    return { busy: ownBookings, mode: "provisional" };
  }

  try {
    const external = await provider.getBusyIntervals({ from, to });
    return { busy: [...external, ...ownBookings], mode: "live" };
  } catch (error) {
    // A configured calendar that cannot be reached is reported as such. The
    // alternative — quietly falling back to working hours — would show the
    // visitor availability that looks live and is not.
    console.error(
      "[booking] calendar lookup failed:",
      error instanceof CalendarProviderError ? error.message : error,
    );
    return { busy: ownBookings, mode: "unavailable" };
  }
}

export type AvailabilityQuery = {
  /** `YYYY-MM-DD`, first day to summarise. */
  from: string;
  /** `YYYY-MM-DD`, last day to summarise. */
  to: string;
  /** `YYYY-MM-DD`; when given, the full slot list for that day is included. */
  date?: string;
};

export async function loadAvailability(
  query: AvailabilityQuery,
  now: Date = new Date(),
): Promise<AvailabilityResponse> {
  const config = publicBookingConfig();
  const limits = bookableRange(config, now);

  // Never look further ahead than the horizon, whatever was asked for.
  const from = query.from < limits.from ? limits.from : query.from;
  const to = query.to > limits.to ? limits.to : query.to;

  if (from > to) {
    return {
      mode: "provisional",
      businessTimeZone: config.timeZone,
      slotMinutes: config.slotMinutes,
      days: [],
      slots: query.date ? [] : undefined,
    };
  }

  const instants = rangeToInstants(from, to);
  const { busy, mode } = await collectBusy(instants.from, instants.to);
  const input = {
    config,
    busy: applyBuffer(busy, bookingConfig.bufferMinutes),
    now,
  };

  const days: string[] = [];
  for (let date = from; date <= to; date = addDaysToDateKey(date, 1)) {
    days.push(date);
  }

  return {
    mode,
    businessTimeZone: config.timeZone,
    slotMinutes: config.slotMinutes,
    days: summariseDays(days, input),
    slots: query.date ? slotsForDate(query.date, input) : undefined,
  };
}

export async function submitBooking(
  request: BookingRequest,
  now: Date = new Date(),
): Promise<BookingResult> {
  const config = publicBookingConfig();
  const startMs = Date.parse(request.start);

  if (!Number.isFinite(startMs)) {
    return {
      confirmed: false,
      start: request.start,
      end: request.start,
      calendarSynced: false,
      emailSent: false,
      error: "invalid",
    };
  }

  const end = new Date(startMs + config.slotMinutes * MINUTE).toISOString();

  // Re-read availability now, rather than trusting what the browser was shown.
  // The visitor may have had the page open for an hour.
  const window = {
    from: new Date(startMs - 24 * 60 * MINUTE),
    to: new Date(startMs + 24 * 60 * MINUTE),
  };
  const { busy } = await collectBusy(window.from, window.to);

  const bookable = isSlotBookable(request.start, {
    config,
    busy: applyBuffer(busy, bookingConfig.bufferMinutes),
    now,
  });

  if (!bookable) {
    return {
      confirmed: false,
      start: request.start,
      end,
      calendarSynced: false,
      emailSent: false,
      error: "slot-taken",
    };
  }

  const stored = await getBookingStore().create(request, end);
  if (!stored) {
    // Lost the race to a request that landed microseconds earlier.
    return {
      confirmed: false,
      start: request.start,
      end,
      calendarSynced: false,
      emailSent: false,
      error: "slot-taken",
    };
  }

  const provider = getCalendarProvider();
  let calendarSynced = false;

  if (provider?.createEvent) {
    try {
      calendarSynced = (await provider.createEvent(stored)) !== null;
    } catch (error) {
      // The booking stands; the owner is told by email either way, and the
      // confirmation screen does not claim a calendar entry that failed.
      console.error("[booking] could not write the calendar event:", error);
    }
  }

  const [clientMail] = await Promise.all([
    sendEmail(
      request.email,
      clientConfirmation(stored, config.timeZone, config.slotMinutes),
    ),
    // The notification carries the enquirer as reply-to, so answering it goes
    // straight back to them instead of to our own mailbox.
    sendEmail(
      notificationAddress(),
      ownerNotification(stored, config.timeZone, config.slotMinutes),
      request.email,
    ),
  ]);

  return {
    confirmed: true,
    start: stored.start,
    end: stored.end,
    calendarSynced,
    emailSent: clientMail.sent,
    error: undefined,
  };
}
