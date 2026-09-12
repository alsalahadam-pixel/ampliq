/**
 * `GET /api/booking/google/status?secret=…`
 *
 * Whether the booking flow is actually reading a live calendar, answered
 * without a log file.
 *
 * This exists because the free Vercel plan keeps only a short window of runtime
 * logs, so "did the connection work?" was a question with no reliable way to
 * answer it. It runs the real production path — the same provider the
 * availability endpoint uses, the same refresh grant, the same FreeBusy call —
 * and reports what happened.
 *
 * Gated on `GOOGLE_OAUTH_SETUP_SECRET` like the rest of the setup flow, and
 * reports the presence of each credential, never its value.
 */

import { getCalendarProvider } from "@/lib/booking/providers";
import {
  setupIsEnabled,
  setupSecretMatches,
} from "@/lib/booking/providers/google-oauth";
import { storeDescription } from "@/lib/booking/providers/token-store";
import {
  code,
  setupDisabledPage,
  setupPage,
  setupUnauthorizedPage,
} from "@/app/api/booking/google/setup-page";

/** Calls Google on every request; never prerendered or cached. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const present = (name: string) =>
  process.env[name]?.trim() ? "set" : "not set";

export async function GET(request: Request): Promise<Response> {
  if (!setupIsEnabled()) return setupDisabledPage();

  const url = new URL(request.url);
  const supplied =
    request.headers.get("x-ampliq-setup-secret") ?? url.searchParams.get("secret");
  if (!setupSecretMatches(supplied)) return setupUnauthorizedPage();

  const facts = [
    { term: "GOOGLE_CLIENT_ID", detail: present("GOOGLE_CLIENT_ID") },
    { term: "GOOGLE_CLIENT_SECRET", detail: present("GOOGLE_CLIENT_SECRET") },
    { term: "GOOGLE_CALENDAR_ID", detail: process.env.GOOGLE_CALENDAR_ID?.trim() || "not set" },
    {
      term: "GOOGLE_OAUTH_REFRESH_TOKEN",
      detail: present("GOOGLE_OAUTH_REFRESH_TOKEN"),
    },
    { term: "Token store", detail: storeDescription() },
  ];

  const provider = getCalendarProvider();

  if (!provider) {
    return setupPage({
      status: 200,
      tone: "problem",
      title: "No calendar is connected",
      lead: "The booking flow is running on published working hours minus the bookings made through the site, and says so on the page. Nothing is broken; nothing is live either.",
      facts,
      steps: [
        "Anything above reading “not set” is what is missing.",
        `If the refresh token is the only gap, run ${code("/api/booking/google/authorize?secret=…")}.`,
        "If it says “set” and you still see this page, the deployment has not restarted since the variable was written — redeploy.",
      ],
    });
  }

  // The real thing: a live FreeBusy call through the refresh grant.
  const now = new Date();
  const to = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  try {
    const busy = await provider.getBusyIntervals({ from: now, to });

    return setupPage({
      status: 200,
      title: "The calendar is live",
      lead: "The refresh token was exchanged for an access token and the calendar answered. The booking page is checking real availability.",
      facts: [
        ...facts,
        { term: "Provider", detail: provider.label },
        {
          term: "Busy next 7 days",
          detail: `${busy.length} ${busy.length === 1 ? "interval" : "intervals"}`,
        },
        {
          term: "Writes events",
          detail: provider.createEvent ? "yes — bookings are added to the calendar" : "no",
        },
      ],
      steps: [
        `Remove ${code("GOOGLE_OAUTH_SETUP_SECRET")} and ${code("VERCEL_TOKEN")}. Neither is needed again, and this page closes with them.`,
      ],
    });
  } catch (error) {
    return setupPage({
      status: 502,
      tone: "problem",
      title: "The calendar is configured but did not answer",
      lead:
        error instanceof Error
          ? error.message
          : "The free/busy lookup failed for an unknown reason.",
      facts,
      steps: [
        `${code("invalid_grant")} means the refresh token is dead — revoked, or issued by a consent screen still in Testing, where Google expires them after seven days. Publish the consent screen, then run the authorize flow again.`,
        "A 403 or 404 usually means GOOGLE_CALENDAR_ID names a calendar this account cannot see.",
      ],
    });
  }
}
