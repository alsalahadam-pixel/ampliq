/**
 * The calendar provider contract.
 *
 * This is the seam between the booking UI and whatever calendar the agency
 * actually runs. The site above this line only ever sees busy intervals; the
 * implementations below it hold the credentials and speak the vendor API.
 *
 * ## The privacy rule
 *
 * `getBusyIntervals` returns times and nothing else. No subject, no attendees,
 * no location, no notes, no free/busy status beyond "not available". Google's
 * FreeBusy endpoint returns exactly this shape natively; Microsoft's
 * `getSchedule` can return more, so the adapter drops the extra fields at the
 * boundary rather than passing them inward.
 *
 * An implementation MUST NOT widen `BusyInterval`. If a future feature needs
 * richer data, that is a deliberate decision to be taken explicitly — not
 * something that arrives because a vendor happened to include it in a payload.
 */

import type { BusyInterval, StoredBooking } from "@/lib/booking/types";

export type BusyQuery = {
  /** Inclusive lower bound. */
  from: Date;
  /** Exclusive upper bound. */
  to: Date;
};

export type CreatedEvent = {
  /** The provider's identifier, stored so the event can be found again. */
  id: string;
};

export interface CalendarProvider {
  /** Stable key, used in logs and diagnostics. */
  readonly id: "google" | "microsoft";
  /** Human-readable name for the operator-facing diagnostics endpoint. */
  readonly label: string;

  /**
   * When the owner is unavailable in the given range.
   *
   * Times only — see the privacy rule above.
   */
  getBusyIntervals(query: BusyQuery): Promise<BusyInterval[]>;

  /**
   * Writes the confirmed booking into the calendar.
   *
   * Optional: a provider may be connected read-only, in which case the booking
   * is still recorded on this side and the owner is emailed. Returning null
   * means "not written", and the UI says so rather than implying a calendar
   * entry that does not exist.
   */
  createEvent?(booking: StoredBooking): Promise<CreatedEvent | null>;
}

/** Thrown when a provider is configured but the lookup could not be completed. */
export class CalendarProviderError extends Error {
  constructor(
    message: string,
    readonly provider: string,
  ) {
    super(message);
    this.name = "CalendarProviderError";
  }
}
