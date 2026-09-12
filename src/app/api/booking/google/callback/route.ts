/**
 * `GET /api/booking/google/callback`
 *
 * Step two of the one-time Google Calendar connection, and the URL registered
 * in Google Cloud as the authorized redirect URI:
 *
 *     https://ampliq.net/api/booking/google/callback
 *
 * Google sends the operator back here with a one-time code. This route proves
 * the round trip belongs to the authorize request that started it, exchanges
 * the code server-side, checks the resulting token can actually read the target
 * calendar, and writes the refresh token to the server log.
 *
 * **The refresh token never reaches the browser.** The page rendered here says
 * which account was connected and whether the calendar answered; the token
 * itself goes to stderr, which is the deployment's function log locally and in
 * Vercel. The operator copies it from there into `GOOGLE_OAUTH_REFRESH_TOKEN` and
 * redeploys. Nothing persists it on this side — there is no writable disk on a
 * serverless deployment, and a token in a response body is a token in a browser
 * history, a proxy cache and a screenshot.
 *
 * Authorization is the state cookie, not a second secret: the cookie is
 * httpOnly and could only have been set by a request that already passed the
 * `GOOGLE_OAUTH_SETUP_SECRET` check, and Google will not send a secret query
 * parameter back with its redirect.
 */

import {
  constantTimeEquals,
  exchangeCode,
  fetchAccountEmail,
  GoogleOAuthError,
  readOAuthApp,
  setupIsEnabled,
  STATE_COOKIE,
} from "@/lib/booking/providers/google-oauth";
import {
  code,
  setupDisabledPage,
  setupPage,
} from "@/app/api/booking/google/setup-page";

/** Exchanges a one-time code against Google; never prerendered or cached. */
export const dynamic = "force-dynamic";
/** `node:crypto` in the state comparison needs the Node runtime. */
export const runtime = "nodejs";

/** Expired immediately, whatever the outcome: the state is single-use. */
const CLEAR_STATE_COOKIE = `${STATE_COOKIE}=; Path=/api/booking/google; HttpOnly; SameSite=Lax; Max-Age=0`;

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;

  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=") || null;
  }
  return null;
}

/** Adds the cookie clear to whatever page is being returned. */
function withClearedState(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.append("set-cookie", CLEAR_STATE_COOKIE);
  return new Response(response.body, { status: response.status, headers });
}

/**
 * Asks the calendar for its busy times over the next day.
 *
 * The point is not the answer but the round trip: it proves the granted scopes
 * cover FreeBusy and that `GOOGLE_CALENDAR_ID` names a calendar this account
 * can actually see. Getting that wrong is otherwise invisible until the first
 * visitor opens the booking page.
 */
async function probeCalendar(
  accessToken: string,
  calendarId: string,
): Promise<{ ok: true; busy: number } | { ok: false; reason: string }> {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        timeMin: now.toISOString(),
        timeMax: tomorrow.toISOString(),
        items: [{ id: calendarId }],
      }),
      cache: "no-store",
    });

    if (!response.ok) return { ok: false, reason: `FreeBusy answered ${response.status}` };

    const payload = (await response.json()) as {
      calendars?: Record<
        string,
        { busy?: unknown[]; errors?: { reason?: string }[] }
      >;
    };

    const calendar = payload.calendars?.[calendarId];
    const error = calendar?.errors?.[0]?.reason;
    if (error) return { ok: false, reason: error };

    return { ok: true, busy: calendar?.busy?.length ?? 0 };
  } catch {
    return { ok: false, reason: "the request to Google failed" };
  }
}

export async function GET(request: Request): Promise<Response> {
  if (!setupIsEnabled()) return setupDisabledPage();

  const url = new URL(request.url);
  const params = url.searchParams;

  // The cookie is the authorization. Without a matching one this is either a
  // stale tab, a replayed link, or somebody else's forged redirect.
  const expectedState = readCookie(request.headers.get("cookie"), STATE_COOKIE);
  if (!constantTimeEquals(params.get("state"), expectedState)) {
    return withClearedState(
      setupPage({
        status: 400,
        tone: "problem",
        title: "This link did not come from a setup you started",
        lead: "The one-time state did not match, so the exchange was refused. If you left the consent screen open for more than ten minutes, or reopened an old callback URL, just start again.",
        steps: [`Open ${code("/api/booking/google/authorize?secret=…")} again.`],
      }),
    );
  }

  // Google reports a refusal or a misconfiguration here rather than by failing
  // the redirect, so this branch is the normal path for "you clicked Cancel"
  // and for an unregistered redirect URI alike.
  const googleError = params.get("error");
  if (googleError) {
    return withClearedState(
      setupPage({
        status: 400,
        tone: "problem",
        title: "Google did not grant access",
        lead:
          googleError === "access_denied"
            ? "Consent was declined, so no calendar was connected. Nothing changed."
            : `Google returned "${googleError}".`,
        facts: [{ term: "Error", detail: googleError }],
        steps: [
          `If this says ${code("redirect_uri_mismatch")}, the URI registered in Google Cloud is not character-for-character the one this deployment sent.`,
          `Start again at ${code("/api/booking/google/authorize?secret=…")}.`,
        ],
      }),
    );
  }

  const authCode = params.get("code");
  if (!authCode) {
    return withClearedState(
      setupPage({
        status: 400,
        tone: "problem",
        title: "No authorization code arrived",
        lead: "Google redirected back without a code, so there is nothing to exchange.",
        steps: [`Start again at ${code("/api/booking/google/authorize?secret=…")}.`],
      }),
    );
  }

  const app = readOAuthApp();
  if (!app) {
    return withClearedState(
      setupPage({
        status: 500,
        tone: "problem",
        title: "The OAuth client is not configured",
        lead: "The code cannot be exchanged without the client credentials that issued it.",
        steps: [
          `Set ${code("GOOGLE_CLIENT_ID")} and ${code("GOOGLE_CLIENT_SECRET")}, redeploy, and start again.`,
        ],
      }),
    );
  }

  let tokens;
  try {
    tokens = await exchangeCode(app, authCode);
  } catch (error) {
    const reason = error instanceof GoogleOAuthError ? error.message : "unexpected failure";
    const detail = error instanceof GoogleOAuthError ? error.detail : undefined;

    return withClearedState(
      setupPage({
        status: 502,
        tone: "problem",
        title: "The token exchange was rejected",
        lead: detail ?? "Google refused to exchange the authorization code.",
        facts: [
          { term: "Error", detail: reason },
          { term: "Redirect URI", detail: app.redirectUri },
        ],
        steps: [
          `${code("redirect_uri_mismatch")} — the Redirect URI above must appear verbatim under Authorized redirect URIs in Google Cloud.`,
          `${code("invalid_client")} — the client id or secret is wrong, or belongs to a different project.`,
          `${code("invalid_grant")} — the code was already used or has expired. Start again.`,
        ],
      }),
    );
  }

  // Without a refresh token the integration cannot outlive the hour, so this is
  // a failure even though Google called it a success.
  if (!tokens.refreshToken) {
    return withClearedState(
      setupPage({
        status: 502,
        tone: "problem",
        title: "Google issued no refresh token",
        lead: "An access token alone expires in an hour and cannot be renewed. This happens when the account has already authorised this client and Google sees no reason to issue a second long-lived grant.",
        steps: [
          "Open <code>myaccount.google.com/permissions</code>, find this app, and remove its access.",
          `Then start again at ${code("/api/booking/google/authorize?secret=…")}.`,
        ],
      }),
    );
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();
  const [accountEmail, probe] = await Promise.all([
    fetchAccountEmail(tokens.accessToken),
    calendarId ? probeCalendar(tokens.accessToken, calendarId) : Promise.resolve(null),
  ]);

  // The one place the refresh token is written. stderr is the function log —
  // `vercel logs` or the Logs tab on the deployment — and the local terminal
  // when the flow is run against a dev server, which is the quieter of the two
  // places to hand a secret over.
  console.error(
    [
      "",
      "─".repeat(72),
      "GOOGLE CALENDAR CONNECTED — copy this into the deployment, then redeploy:",
      "",
      `GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refreshToken}`,
      "",
      "Unset GOOGLE_OAUTH_SETUP_SECRET afterwards to close the setup flow.",
      "─".repeat(72),
      "",
    ].join("\n"),
  );

  const facts = [
    accountEmail ? { term: "Account", detail: accountEmail } : null,
    { term: "Calendar", detail: calendarId ?? "GOOGLE_CALENDAR_ID is not set yet" },
    {
      term: "Free/busy",
      detail: !probe
        ? "not checked — set GOOGLE_CALENDAR_ID and run this again"
        : probe.ok
          ? `readable — ${probe.busy} busy ${probe.busy === 1 ? "interval" : "intervals"} in the next 24 hours`
          : `could not be read — ${probe.reason}`,
    },
    { term: "Scopes", detail: tokens.scope || "as requested" },
  ].filter((fact) => fact !== null);

  return withClearedState(
    setupPage({
      status: 200,
      title: "Calendar connected",
      lead: "The refresh token has been written to this deployment's server log. It is deliberately not shown here — copy it from the log, set it on the deployment, and redeploy.",
      facts,
      steps: [
        "Open the function log: <code>vercel logs</code>, or the Logs tab on the deployment. Locally it is already in your terminal.",
        `Copy the ${code("GOOGLE_OAUTH_REFRESH_TOKEN=…")} line into the deployment's environment variables.`,
        `Redeploy, then remove ${code("GOOGLE_OAUTH_SETUP_SECRET")} so this flow answers 404 again.`,
      ],
    }),
  );
}
