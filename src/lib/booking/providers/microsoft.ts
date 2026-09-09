/**
 * Microsoft 365 / Outlook Calendar provider.
 *
 * Uses the client-credentials flow against Microsoft Graph, so the app holds
 * application permissions rather than a signed-in user's session. Setup is in
 * `docs/booking.md`.
 *
 * Unlike Google's FreeBusy endpoint, Graph's `getSchedule` will happily return
 * `subject` and `location` for each block when the app has read access to the
 * mailbox. **We drop those fields here**, at the boundary, so nothing above
 * this file ever holds them: the adapter reads `start` and `end` and builds a
 * fresh object. That is a deliberate discard, not an oversight — the site needs
 * to know when the owner is busy, never what they are doing.
 *
 * Nothing here runs unless the Graph credentials are set.
 */

import type { BusyInterval, StoredBooking } from "@/lib/booking/types";
import {
  type BusyQuery,
  type CalendarProvider,
  CalendarProviderError,
  type CreatedEvent,
} from "@/lib/booking/providers/types";

const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";

type MicrosoftCredentials = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  /** The mailbox whose calendar is booked: a UPN or object id. */
  userId: string;
};

export function readMicrosoftCredentials(): MicrosoftCredentials | null {
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const userId = process.env.MICROSOFT_CALENDAR_USER;

  if (!tenantId || !clientId || !clientSecret || !userId) return null;

  return { tenantId, clientId, clientSecret, userId };
}

type CachedToken = { value: string; expiresAt: number };
let cachedToken: CachedToken | null = null;

async function getAccessToken(
  credentials: MicrosoftCredentials,
): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const response = await fetch(
    `https://login.microsoftonline.com/${credentials.tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    },
  );

  if (!response.ok) {
    throw new CalendarProviderError(
      `Token request failed with ${response.status}`,
      "microsoft",
    );
  }

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!payload.access_token) {
    throw new CalendarProviderError("Token response had no token", "microsoft");
  }

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000,
  };

  return cachedToken.value;
}

/** Graph statuses that mean the owner cannot take a call. */
const BLOCKING_STATUSES = new Set(["busy", "oof", "workingElsewhere"]);

export function createMicrosoftProvider(
  credentials: MicrosoftCredentials,
): CalendarProvider {
  return {
    id: "microsoft",
    label: "Outlook / Microsoft 365",

    async getBusyIntervals(query: BusyQuery): Promise<BusyInterval[]> {
      const token = await getAccessToken(credentials);

      const response = await fetch(
        `${GRAPH_ROOT}/users/${encodeURIComponent(
          credentials.userId,
        )}/calendar/getSchedule`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            schedules: [credentials.userId],
            startTime: { dateTime: query.from.toISOString(), timeZone: "UTC" },
            endTime: { dateTime: query.to.toISOString(), timeZone: "UTC" },
            availabilityViewInterval: 15,
          }),
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new CalendarProviderError(
          `getSchedule request failed with ${response.status}`,
          "microsoft",
        );
      }

      const payload = (await response.json()) as {
        value?: {
          scheduleItems?: {
            status?: string;
            start?: { dateTime?: string; timeZone?: string };
            end?: { dateTime?: string; timeZone?: string };
            // `subject` and `location` may also be present. Not read. Not typed.
          }[];
          error?: unknown;
        }[];
      };

      const schedule = payload.value?.[0];
      if (!schedule || schedule.error) {
        throw new CalendarProviderError(
          "getSchedule returned an error for the mailbox",
          "microsoft",
        );
      }

      const intervals: BusyInterval[] = [];

      for (const item of schedule.scheduleItems ?? []) {
        if (item.status && !BLOCKING_STATUSES.has(item.status)) continue;

        const start = toIsoInstant(item.start);
        const end = toIsoInstant(item.end);
        if (!start || !end) continue;

        // Only the two timestamps are carried forward.
        intervals.push({ start, end });
      }

      return intervals;
    },

    async createEvent(booking: StoredBooking): Promise<CreatedEvent | null> {
      const token = await getAccessToken(credentials);

      const response = await fetch(
        `${GRAPH_ROOT}/users/${encodeURIComponent(credentials.userId)}/events`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            subject: `AMPLIQ intro call — ${booking.name}`,
            body: {
              contentType: "text",
              content: [
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
            },
            start: { dateTime: booking.start, timeZone: "UTC" },
            end: { dateTime: booking.end, timeZone: "UTC" },
            attendees: [
              {
                type: "required",
                emailAddress: { address: booking.email, name: booking.name },
              },
            ],
          }),
        },
      );

      if (!response.ok) return null;

      const payload = (await response.json()) as { id?: string };
      return payload.id ? { id: payload.id } : null;
    },
  };
}

/**
 * Graph returns a naive `dateTime` plus a separate `timeZone`, which is
 * normally UTC because that is what the request asked for. The string carries
 * no offset, so it is stamped as UTC explicitly rather than left for
 * `Date.parse` to interpret in the server's local zone.
 */
function toIsoInstant(
  value: { dateTime?: string; timeZone?: string } | undefined,
): string | null {
  if (!value?.dateTime) return null;

  const raw = value.dateTime;
  const hasOffset = /(?:Z|[+-]\d{2}:?\d{2})$/.test(raw);
  const normalised = hasOffset ? raw : `${raw.replace(/\.\d+$/, "")}Z`;

  const parsed = Date.parse(normalised);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : null;
}
