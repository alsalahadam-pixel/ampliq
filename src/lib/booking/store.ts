/**
 * Booking persistence.
 *
 * Bookings made on this site have to be remembered somewhere, or the second
 * visitor of the day is offered a slot the first one already took. Where that
 * "somewhere" is depends on how the site is deployed, so this file defines the
 * contract and ships one honest default.
 *
 * ## The default is in-memory, and that is a real limitation
 *
 * `createMemoryStore` keeps bookings in the Node process. It is correct for a
 * single long-lived server and wrong for anything else: a restart forgets every
 * booking, and two serverless instances do not share a list. It is the default
 * because the alternative — writing to a database this project does not have —
 * would be pretending.
 *
 * Two ways to make it durable, in order of effort:
 *
 * 1. **Connect a calendar with write access.** Once `createEvent` runs, the
 *    booking is in the real calendar, and the next availability lookup sees it
 *    through freebusy. The calendar becomes the source of truth and this store
 *    is only a guard against two requests racing inside one process.
 * 2. **Implement `BookingStore` against a database** and return it from
 *    `getBookingStore`. That is the whole integration; nothing else changes.
 */

import type { BookingRequest, BusyInterval, StoredBooking } from "@/lib/booking/types";

export interface BookingStore {
  /** Bookings that overlap the range, used to build busy intervals. */
  listBetween(from: Date, to: Date): Promise<StoredBooking[]>;

  /**
   * Records a booking.
   *
   * Returns null when the slot was claimed between the availability check and
   * this call — the last line of defence against a double booking, and the
   * reason the check is not simply "read, then write".
   */
  create(booking: BookingRequest, end: string): Promise<StoredBooking | null>;
}

function overlaps(
  booking: StoredBooking,
  from: number,
  to: number,
): boolean {
  return Date.parse(booking.start) < to && Date.parse(booking.end) > from;
}

export function createMemoryStore(): BookingStore {
  const bookings: StoredBooking[] = [];

  return {
    async listBetween(from: Date, to: Date): Promise<StoredBooking[]> {
      const fromMs = from.getTime();
      const toMs = to.getTime();
      return bookings.filter((booking) => overlaps(booking, fromMs, toMs));
    },

    async create(
      booking: BookingRequest,
      end: string,
    ): Promise<StoredBooking | null> {
      // Node runs this synchronously between awaits, so the check and the push
      // cannot be interleaved by another request in the same process.
      const taken = bookings.some(
        (existing) => existing.start === booking.start,
      );
      if (taken) return null;

      const stored: StoredBooking = {
        ...booking,
        id: cryptoRandomId(),
        end,
        createdAt: new Date().toISOString(),
      };

      bookings.push(stored);
      return stored;
    },
  };
}

function cryptoRandomId(): string {
  return globalThis.crypto.randomUUID();
}

/**
 * One store per process.
 *
 * Held on `globalThis` so the dev server's hot reload does not hand out a fresh
 * empty store on every edit.
 */
const STORE_KEY = Symbol.for("ampliq.booking.store");

type GlobalWithStore = typeof globalThis & {
  [STORE_KEY]?: BookingStore;
};

export function getBookingStore(): BookingStore {
  const scope = globalThis as GlobalWithStore;
  scope[STORE_KEY] ??= createMemoryStore();
  return scope[STORE_KEY];
}

/** Bookings, as busy intervals the availability engine understands. */
export function bookingsToBusy(bookings: StoredBooking[]): BusyInterval[] {
  return bookings.map((booking) => ({
    start: booking.start,
    end: booking.end,
  }));
}
