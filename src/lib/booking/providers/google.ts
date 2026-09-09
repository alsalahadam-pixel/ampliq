/**
 * Google Calendar provider.
 *
 * Uses a service account: no interactive OAuth, no refresh token to keep alive,
 * and the account can be given access to exactly one calendar. Setup is in
 * `docs/booking.md`.
 *
 * Availability comes from the FreeBusy endpoint, which by design returns only
 * `{ start, end }` pairs — the API itself never discloses what the owner is
 * doing, only that the time is taken. That is the behaviour we want, so the
 * privacy guarantee does not rest on this file remembering to strip fields.
 *
 * Nothing here runs unless `GOOGLE_CALENDAR_ID` and the service-account
 * credentials are set.
 */

import { createSign } from "node:crypto";

import type { BusyInterval, StoredBooking } from "@/lib/booking/types";
import {
  type BusyQuery,
  type CalendarProvider,
  CalendarProviderError,
  type CreatedEvent,
} from "@/lib/booking/providers/types";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FREEBUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy";
const EVENTS_URL = "https://www.googleapis.com/calendar/v3/calendars";

/** Read scope is enough for availability; write is added only to book. */
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

type GoogleCredentials = {
  clientEmail: string;
  privateKey: string;
  calendarId: string;
  /**
   * With domain-wide delegation the service account acts as this user. Left
   * unset for the simpler setup where the calendar is shared with the service
   * account directly.
   */
  impersonate?: string;
};

function base64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function readGoogleCredentials(): GoogleCredentials | null {
  const clientEmail = process.env.GOOGLE_CALENDAR_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_CALENDAR_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!clientEmail || !rawKey || !calendarId) return null;

  return {
    clientEmail,
    // Env files cannot hold real newlines, so the key is stored escaped.
    privateKey: rawKey.replace(/\\n/g, "\n"),
    calendarId,
    impersonate: process.env.GOOGLE_CALENDAR_IMPERSONATE || undefined,
  };
}

type CachedToken = { value: string; expiresAt: number };
let cachedToken: CachedToken | null = null;

/**
 * Signs a JWT assertion and swaps it for an access token.
 *
 * Tokens last an hour; the cache stops every availability request from paying
 * for a round trip and an RSA signature.
 */
async function getAccessToken(credentials: GoogleCredentials): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64Url(
    JSON.stringify({
      iss: credentials.clientEmail,
      sub: credentials.impersonate,
      scope: SCOPES,
      aud: TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const signature = base64Url(signer.sign(credentials.privateKey));

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${signature}`,
    }),
  });

  if (!response.ok) {
    throw new CalendarProviderError(
      `Token request failed with ${response.status}`,
      "google",
    );
  }

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!payload.access_token) {
    throw new CalendarProviderError("Token response had no token", "google");
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  };

  return cachedToken.value;
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
