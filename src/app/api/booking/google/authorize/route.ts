/**
 * `GET /api/booking/google/authorize?secret=…`
 *
 * Step one of the one-time Google Calendar connection. Verifies the setup
 * secret, mints a CSRF state, puts it in an httpOnly cookie and redirects the
 * operator to Google's consent screen.
 *
 The endpoint always exists. What it does depends on how the deployment is
 * configured:
 *
 * - `GOOGLE_OAUTH_SETUP_SECRET` unset — 503 and a page naming what to set. The
 *   flow is closed, and says so, rather than pretending to be absent.
 * - set, but not presented — 401. No grant is started for a caller who cannot
 *   prove they own the deployment.
 * - set and presented — 302 to Google's consent screen.
 *
 * Once the connection is made, unset the secret. The flow closes again and the
 * booking integration keeps running on the refresh token.
 */

import {
  buildConsentUrl,
  newState,
  readOAuthApp,
  setupIsEnabled,
  setupSecretMatches,
  STATE_COOKIE,
} from "@/lib/booking/providers/google-oauth";
import {
  code,
  setupDisabledPage,
  setupPage,
  setupUnauthorizedPage,
} from "@/app/api/booking/google/setup-page";

/** Reads the environment and mints a nonce; never prerendered or cached. */
export const dynamic = "force-dynamic";
/** `node:crypto` and the cookie handling below both need the Node runtime. */
export const runtime = "nodejs";

/** Ten minutes is long enough to sign in to Google and short enough to matter. */
const STATE_TTL_SECONDS = 600;

function stateCookie(state: string, secure: boolean): string {
  return [
    `${STATE_COOKIE}=${state}`,
    // Scoped to the flow itself, so it is never sent with any other request.
    "Path=/api/booking/google",
    "HttpOnly",
    // Lax, not Strict: the callback arrives as a top-level navigation from
    // accounts.google.com, and Strict would withhold the cookie exactly then.
    "SameSite=Lax",
    `Max-Age=${STATE_TTL_SECONDS}`,
    secure ? "Secure" : null,
  ]
    .filter(Boolean)
    .join("; ");
}

export function GET(request: Request): Response {
  if (!setupIsEnabled()) return setupDisabledPage();

  const url = new URL(request.url);
  // The query string is the convenient way in, and safe: the site's
  // `Referrer-Policy: strict-origin-when-cross-origin` (next.config.ts) sends
  // only the origin on to accounts.google.com, never the path or the query.
  // The header is there for anyone who would rather the secret stayed out of
  // browser history and proxy access logs as well.
  const supplied =
    request.headers.get("x-ampliq-setup-secret") ?? url.searchParams.get("secret");

  if (!setupSecretMatches(supplied)) return setupUnauthorizedPage();

  const app = readOAuthApp();
  if (!app) {
    return setupPage({
      status: 500,
      tone: "problem",
      title: "The OAuth client is not configured",
      lead: "Google needs a client before it can be asked for consent. Set these two on the deployment, redeploy, then open this URL again.",
      steps: [
        `${code("GOOGLE_CLIENT_ID")} — the web application client id from Google Cloud.`,
        `${code("GOOGLE_CLIENT_SECRET")} — its secret.`,
      ],
    });
  }

  const state = newState();

  return new Response(null, {
    status: 302,
    headers: {
      location: buildConsentUrl(app, state),
      "set-cookie": stateCookie(state, url.protocol === "https:"),
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
