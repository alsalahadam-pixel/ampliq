/**
 * Google Calendar provider.
 *
 * Authenticates with OAuth 2.0: the owner authorises AMPLIQ once through
 * `/api/booking/google/authorize`, and the refresh token that comes back is
 * stored as `GOOGLE_REFRESH_TOKEN`. Every request then trades that refresh
 * token for a short-lived access token, which is cached in memory for its
 * lifetime and renewed automatically when it expires. Setup is in
 * `docs/booking.md`.
 *
 * The refresh token is a server-side secret. It is read from the environment,
 * used only in a server-to-server POST to Google, and never serialised into a
 * response, a log line, or anything the browser can reach.
 *
 * Availability comes from the FreeBusy endpoint, which by design returns only
 * `{ start, end }` pairs — the API itself never discloses what the owner is
 * doing, only that the time is taken. That is the behaviour we want, so the
 * privacy guarantee does not rest on this file remembering to strip fields.
 *
 * Nothing here runs unless the client, the refresh token and the calendar id
 * are all set.
 */

import {
  GoogleOAuthError,
  refreshAccessToken,
} from "@/lib/booking/providers/google-oauth";
import type { BusyInterval, StoredBooking } from "@/lib/booking/types";
import {
  type BusyQuery,
  type CalendarProvider,
  CalendarProviderError,
  type CreatedEvent,
} from "@/lib/booking/providers/types";

const FREEBUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy";
const EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars";

export type GoogleCredentials = {
  clientId: string;
  clientSecret: string;
  /** The long-lived grant. Server-side only, never sent anywhere but Google. */
  refreshToken: string;
  calendarId: string;
};

export function readGoogleCredentials(): GoogleCredentials | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();

  if (!clientId || !clientSecret || !refreshToken || !calendarId) return null;

  return { clientId, clientSecret, refreshToken, calendarId };
}

type CachedToken = { value: string; expiresAt: number };
let cachedToken: CachedToken | null = null;

/** Forgets the cached access token. Used by the tests and the setup route. */
export function resetGoogleTokenCache(): void {
  cachedToken = null;
}

/**
 * A valid access token, refreshing it when the cached one is nearly out.
 *
 * Google's access tokens last an hour. The cache means a page of availability
 * costs one Google round trip rather than two; the minute of headroom means a
 * token never expires mid-request.
 *
 * The cache is per server instance, which on Vercel means per warm function.
 * That is correct rather than merely acceptable: a cold instance refreshes
 * once, and there is no shared state to invalidate.
 */
export async function getAccessToken(credentials: GoogleCredentials): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  try {
    const { accessToken, expiresIn } = await refreshAccessToken(
      credentials.clientId,
      credentials.clientSecret,
      credentials.refreshToken,
    );

    cachedToken = { value: accessToken, expiresAt: Date.now() + expiresIn * 1000 };
    return accessToken;
  } catch (error) {
    cachedToken = null;

    // `invalid_grant` is the one worth naming: the refresh token was revoked,
    // the OAuth client was deleted, or the consent screen is still in testing
    // mode, where Google expires refresh tokens after seven days. All of them
    // are fixed by running the authorize flow again, and none of them look
    // like a network fault, so the message says which it is.
    const reason = error instanceof GoogleOAuthError ? error.message : "unknown error";
    throw new CalendarProviderError(
      `Could not refresh the Google access token (${reason})`,
      "google",
    );
  }
}

export function createGoogleProvider(
  credentials: GoogleCredentials,
): CalendarProvider {
  return {
    id: "google",
    label: "Google Calendar",

    async getBusyIntervals(query: BusyQuery): Promise<BusyInterval[]> {
      const token = await getAccessToken(credentials);

      const response = await fetch(FREEBUSY_URL, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          timeMin: query.from.toISOString(),
          timeMax: query.to.toISOString(),
          items: [{ id: credentials.calendarId }],
        }),
        cache: "no-store",
      });

      if (!response.ok) {
        throw new CalendarProviderError(
          `FreeBusy request failed with ${response.status}`,
          "google",
        );
      }

      const payload = (await response.json()) as {
        calendars?: Record<
          string,
          { busy?: { start: string; end: string }[]; errors?: unknown[] }
        >;
      };

      const calendar = payload.calendars?.[credentials.calendarId];
      if (calendar?.errors?.length) {
        throw new CalendarProviderError(
          "FreeBusy returned an error for the calendar",
          "google",
        );
      }

      // FreeBusy only ever contains start/end. Rebuilt explicitly all the same,
      // so nothing else can travel with it if the API ever changes.
      return (calendar?.busy ?? []).map((entry) => ({
        start: entry.start,
        end: entry.end,
      }));
    },

    async createEvent(booking: StoredBooking): Promise<CreatedEvent | null> {
      const token = await getAccessToken(credentials);

      // Google's own invite mail is suppressed: the visitor already receives
      // the branded AMPLIQ confirmation, and two mails for one call is noise.
      // Set GOOGLE_CALENDAR_SEND_INVITES=true to let Google mail them as well.
      const sendUpdates =
        process.env.GOOGLE_CALENDAR_SEND_INVITES === "true" ? "all" : "none";
      const url = `${EVENTS_URL}/${encodeURIComponent(
        credentials.calendarId,
      )}/events?sendUpdates=${sendUpdates}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          summary: `AMPLIQ intro call — ${booking.name}`,
          description: [
            `Name: ${booking.name}`,
            `Email: ${booking.email}`,
            booking.company ? `Company: ${booking.company}` : null,
            booking.phone ? `Phone: ${booking.phone}` : null,
            `Timezone: ${booking.timeZone}`,
            "",
            booking.message,
          ]
            .filter((line) => line !== null)
            .join("\n"),
          start: { dateTime: booking.start },
          end: { dateTime: booking.end },
          attendees: [{ email: booking.email, displayName: booking.name }],
          reminders: { useDefault: true },
        }),
      });

      if (!response.ok) return null;

      const payload = (await response.json()) as { id?: string };
      return payload.id ? { id: payload.id } : null;
    },
  };
}
