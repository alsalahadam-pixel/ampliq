/**
 * Google OAuth 2.0 — the authorization-code half.
 *
 * This module exists for the one-time setup: the owner authorises AMPLIQ
 * against their own Google account, and Google hands back a refresh token that
 * is then stored as `GOOGLE_OAUTH_REFRESH_TOKEN`. From that point the booking
 * provider (`./google.ts`) only ever uses the refresh-token grant, and nothing
 * here runs again.
 *
 * Two rules shape the code below.
 *
 * **No token ever reaches a browser.** The consent redirect carries no secret;
 * the code-for-token exchange happens server-side; the refresh token is written
 * to the server log and to nothing else. The confirmation page the operator
 * sees names the account and the calendar and stops there.
 *
 **The flow is closed, but it does not hide.** Both routes always exist. They
 * are gated on `GOOGLE_OAUTH_SETUP_SECRET`: without it configured they answer
 * 503 and name what to set, and with it configured but not presented they
 * answer 401. An earlier revision answered 404 in both cases, which was
 * indistinguishable from a failed deploy and cost more than the obscurity was
 * worth.
 */

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { siteUrl } from "@/lib/site";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const TOKEN_URL = "https://oauth2.googleapis.com/token";

/** The path Google is configured to redirect back to. */
export const CALLBACK_PATH = "/api/booking/google/callback";

/** The cookie carrying the CSRF state between the two requests. */
export const STATE_COOKIE = "ampliq_google_oauth_state";

/**
 * What the integration asks for.
 *
 * `calendar.events` writes the booking into the calendar. `calendar.readonly`
 * is what the FreeBusy lookup is authorised under.
 *
 * The grant is wider than the use: this code calls exactly two endpoints —
 * `freebusy.query` and `events.insert` — and never reads an event. If you would
 * rather the token could not read event bodies at all, set
 * `GOOGLE_OAUTH_SCOPES` to a narrower pair; check Google's current scope list
 * for the granular free/busy scope before you do, because an unrecognised scope
 * fails the consent screen rather than the request.
 */
const DEFAULT_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.readonly",
];

export function oauthScopes(): string[] {
  const configured = process.env.GOOGLE_OAUTH_SCOPES?.trim();
  if (!configured) return DEFAULT_SCOPES;

  const scopes = configured.split(/[\s,]+/).filter(Boolean);
  return scopes.length > 0 ? scopes : DEFAULT_SCOPES;
}

export type OAuthApp = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

/**
 * The redirect URI, which Google matches character for character.
 *
 * Derived from the site's own origin so the production value needs no
 * configuration at all — the domain is already set in one place. Set
 * `GOOGLE_OAUTH_REDIRECT_URI` when running the flow anywhere else, such as
 * `http://localhost:3000` during setup.
 */
export function defaultRedirectUri(): string {
  return `${siteUrl}${CALLBACK_PATH}`;
}

/** The OAuth client, or null while it has not been configured. */
export function readOAuthApp(): OAuthApp | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  return {
    clientId,
    clientSecret,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim() || defaultRedirectUri(),
  };
}

/**
 * Compares two secrets without leaking their contents through timing.
 *
 * Over SHA-256 digests rather than the raw strings, so the two buffers are
 * always the same length: `timingSafeEqual` throws on a length mismatch, and a
 * throw is itself a length oracle.
 */
export function constantTimeEquals(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;

  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

/** Whether the caller may run the setup flow. */
export function setupSecretMatches(supplied: string | null): boolean {
  return constantTimeEquals(supplied, process.env.GOOGLE_OAUTH_SETUP_SECRET?.trim() ?? null);
}

/** Whether the setup flow exists on this deployment at all. */
export function setupIsEnabled(): boolean {
  return Boolean(process.env.GOOGLE_OAUTH_SETUP_SECRET?.trim());
}

export function newState(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Where to send the operator to consent.
 *
 * `access_type=offline` is what makes Google issue a refresh token at all, and
 * `prompt=consent` forces a fresh one even if this account has authorised the
 * app before — without it a second run returns an access token and no refresh
 * token, which is the single most common way this setup goes wrong.
 */
export function buildConsentUrl(app: OAuthApp, state: string): string {
  const params = new URLSearchParams({
    client_id: app.clientId,
    redirect_uri: app.redirectUri,
    response_type: "code",
    scope: oauthScopes().join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });

  return `${AUTH_URL}?${params.toString()}`;
}

export type TokenSet = {
  accessToken: string;
  /** Absent when Google declines to issue one — see `buildConsentUrl`. */
  refreshToken: string | null;
  expiresIn: number;
  scope: string;
};

/** Raised with a message that is safe to show the operator. */
export class GoogleOAuthError extends Error {
  constructor(
    message: string,
    readonly detail?: string,
  ) {
    super(message);
    this.name = "GoogleOAuthError";
  }
}

type TokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  error?: string;
  error_description?: string;
};

async function postToken(body: URLSearchParams): Promise<TokenResponse> {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => ({}))) as TokenResponse;

  if (!response.ok || payload.error) {
    // Google's own error names the cause precisely — redirect_uri_mismatch,
    // invalid_client, invalid_grant — and none of it is secret, so it is worth
    // surfacing verbatim rather than flattening to "something went wrong".
    throw new GoogleOAuthError(
      payload.error ?? `Token request failed with ${response.status}`,
      payload.error_description,
    );
  }

  return payload;
}

/** Swaps the one-time code from the callback for a token set. */
export async function exchangeCode(app: OAuthApp, code: string): Promise<TokenSet> {
  const payload = await postToken(
    new URLSearchParams({
      code,
      client_id: app.clientId,
      client_secret: app.clientSecret,
      redirect_uri: app.redirectUri,
      grant_type: "authorization_code",
    }),
  );

  if (!payload.access_token) {
    throw new GoogleOAuthError("Google returned no access token");
  }

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token ?? null,
    expiresIn: payload.expires_in ?? 3600,
    scope: payload.scope ?? "",
  };
}

/**
 * Trades the stored refresh token for a fresh access token.
 *
 * This is the only exchange that runs in normal operation, and it runs whenever
 * the cached access token is within a minute of expiring.
 */
export async function refreshAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const payload = await postToken(
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  );

  if (!payload.access_token) {
    throw new GoogleOAuthError("Refresh returned no access token");
  }

  return { accessToken: payload.access_token, expiresIn: payload.expires_in ?? 3600 };
}

/** The signed-in account, for the confirmation page. Best effort. */
export async function fetchAccountEmail(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as { email?: string };
    return payload.email ?? null;
  } catch {
    return null;
  }
}
