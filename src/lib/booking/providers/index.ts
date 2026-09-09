/**
 * Provider selection.
 *
 * Returns the configured calendar, or null when none is set up. Null is a
 * supported state, not a failure: the booking flow still works, and says
 * plainly that availability reflects published working hours rather than a
 * live calendar. Nothing anywhere pretends a calendar was consulted when it
 * was not.
 *
 * To connect one, set the credentials listed in `.env.example` and restart.
 * No other file changes.
 */

import {
  createGoogleProvider,
  readGoogleCredentials,
} from "@/lib/booking/providers/google";
import {
  createMicrosoftProvider,
  readMicrosoftCredentials,
} from "@/lib/booking/providers/microsoft";
import type { CalendarProvider } from "@/lib/booking/providers/types";

export type { CalendarProvider } from "@/lib/booking/providers/types";
export { CalendarProviderError } from "@/lib/booking/providers/types";

/**
 * The active provider.
 *
 * `BOOKING_CALENDAR_PROVIDER` picks explicitly; with it unset the first
 * provider whose credentials are complete is used, so a single set of
 * variables is enough to switch a deployment on.
 */
export function getCalendarProvider(): CalendarProvider | null {
  const requested = process.env.BOOKING_CALENDAR_PROVIDER?.toLowerCase();

  if (requested === "none") return null;

  if (!requested || requested === "google") {
    const google = readGoogleCredentials();
    if (google) return createGoogleProvider(google);
    if (requested === "google") return null;
  }

  if (!requested || requested === "microsoft" || requested === "outlook") {
    const microsoft = readMicrosoftCredentials();
    if (microsoft) return createMicrosoftProvider(microsoft);
  }

  return null;
}
