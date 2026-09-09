/**
 * Shared booking types.
 *
 * These are deliberately free of any provider vocabulary. Nothing here knows
 * that Google or Microsoft exist; the provider layer under `providers/` adapts
 * to this shape, not the other way round.
 */

/**
 * A block of time the owner is unavailable, expressed as ISO-8601 UTC
 * instants.
 *
 * This is the ONLY thing the site ever learns about the owner's calendar.
 * There is no title, no attendee list, no location, no description — by design.
 * A provider that returns richer data must discard everything but the two
 * timestamps before it hands the interval back (see `providers/`).
 */
export type BusyInterval = {
  start: string;
  end: string;
};

/** Why a slot cannot be booked. Never leaks anything about the owner's day. */
export type SlotBlockedReason =
  /** Overlaps something already in the calendar, or a booking made here. */
  | "busy"
  /** Too soon — inside the configured minimum notice window. */
  | "notice"
  /** Already in the past for the visitor. */
  | "past"
  /** The wall-clock time does not exist on this date (DST spring-forward). */
  | "invalid";

export type Slot = {
  /** Start instant, ISO-8601 UTC. */
  start: string;
  /** End instant, ISO-8601 UTC. Excludes the buffer. */
  end: string;
  available: boolean;
  /** Present only when `available` is false. */
  reason?: SlotBlockedReason;
};

/**
 * How much the availability shown can be trusted.
 *
 * The distinction is load-bearing: the UI states which of these applies rather
 * than presenting published office hours as if a calendar had been consulted.
 */
export type AvailabilityMode =
  /** A calendar provider is connected and was queried successfully. */
  | "live"
  /** No provider configured: working hours minus bookings made on this site. */
  | "provisional"
  /** A provider is configured but the lookup failed. Shown as an error. */
  | "unavailable"
  /** No server at all (static export). Working hours only, computed locally. */
  | "offline";

/** A single day in the month grid. */
export type DaySummary = {
  /** Calendar date in the business timezone, `YYYY-MM-DD`. */
  date: string;
  /** Number of bookable slots. Zero renders the day as unselectable. */
  availableCount: number;
  /** Total slots the working hours define for the day, bookable or not. */
  totalCount: number;
  /**
   * Why a day with working hours has nothing left.
   *
   * A day inside the notice window is not "fully booked" and must not be
   * labelled as though the owner's diary were full — that would overstate how
   * busy the agency is, which is the same class of dishonesty as inventing
   * availability. Absent when the day still has slots.
   */
  blockedBy?: "busy" | "notice" | "past";
};

export type AvailabilityResponse = {
  mode: AvailabilityMode;
  /** IANA zone the working hours are defined in. */
  businessTimeZone: string;
  slotMinutes: number;
  days: DaySummary[];
  /** Present when a single date was requested. */
  slots?: Slot[];
};

/** What the visitor fills in at the details step. */
export type BookingDetails = {
  name: string;
  email: string;
  company: string;
  /** What they want to talk about. */
  message: string;
  /** Optional; the owner rings back on this if it is given. */
  phone?: string;
  /** IANA zone reported by the visitor's browser, echoed back in emails. */
  timeZone: string;
  /** Locale the booking was made in, so the confirmation email matches. */
  locale: string;
};

export type BookingRequest = BookingDetails & {
  /** Slot start instant, ISO-8601 UTC. */
  start: string;
};

export type StoredBooking = BookingRequest & {
  id: string;
  end: string;
  createdAt: string;
};

export type BookingResult = {
  /** The booking was accepted and recorded. */
  confirmed: boolean;
  start: string;
  end: string;
  /** Whether the slot was written into a real calendar. */
  calendarSynced: boolean;
  /** Whether a confirmation email actually went out. */
  emailSent: boolean;
  /**
   * Set when the booking could not be confirmed, so the UI can say what
   * happened instead of showing a success screen that isn't one.
   */
  error?: "slot-taken" | "invalid" | "server";
};
