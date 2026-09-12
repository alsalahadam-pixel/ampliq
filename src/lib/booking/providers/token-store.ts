/**
 * Where the refresh token goes when the OAuth flow succeeds.
 *
 * The token has to end up somewhere the deployment reads on every cold start,
 * and it must not pass through a browser or a log line on the way. A serverless
 * deployment has no writable disk and this project has no database, so there is
 * exactly one durable place available: the project's own environment variables.
 *
 * Two strategies, picked by where the code is running.
 *
 * **On Vercel** — written straight into the project's environment through the
 * Vercel REST API, as an encrypted variable named `GOOGLE_OAUTH_REFRESH_TOKEN`.
 * This needs a Vercel access token, which is available on the free plan; it is
 * a powerful credential and `docs/booking.md` says to delete it afterwards.
 *
 * **Locally** — appended to `.env.local`, which is gitignored. The operator can
 * then read it off their own disk rather than out of a cloud log, which is the
 * quieter place for a secret to sit anyway.
 *
 * Neither path returns the token to the caller, and nothing here logs it. When
 * neither is available the token is discarded rather than displayed, and the
 * caller is told to configure one and run the flow again.
 */

import { readFileSync, writeFileSync, chmodSync } from "node:fs";
import { resolve } from "node:path";

export const REFRESH_TOKEN_KEY = "GOOGLE_OAUTH_REFRESH_TOKEN";

export type StoreResult =
  | {
      ok: true;
      /** Where it landed, for the confirmation page. */
      where: string;
      /** What the operator still has to do, if anything. */
      next: string[];
    }
  | {
      ok: false;
      reason: string;
      /** How to make a store available, in the operator's own words. */
      how: string[];
    };

/** True when this process is a Vercel deployment rather than a local server. */
export function onVercel(): boolean {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_URL);
}

type VercelTarget = { token: string; projectId: string; teamId?: string };

function readVercelTarget(): VercelTarget | null {
  const token = process.env.VERCEL_TOKEN?.trim();
  // Vercel injects VERCEL_PROJECT_ID when system environment variables are
  // exposed; otherwise the operator sets it from Project Settings → General.
  const projectId =
    process.env.VERCEL_PROJECT_ID?.trim() || process.env.VERCEL_PROJECT?.trim();
  if (!token || !projectId) return null;

  // The CLI writes ORG_ID, the dashboard calls it the team id. Same value.
  const teamId = process.env.VERCEL_TEAM_ID?.trim() || process.env.VERCEL_ORG_ID?.trim();
  return { token, projectId, teamId: teamId || undefined };
}

/**
 * Upserts one encrypted environment variable on the Vercel project.
 *
 * `upsert=true` makes a repeat run replace the value rather than fail on a
 * duplicate key, which matters because reconnecting the calendar is a thing
 * that happens — a revoked grant, a rotated client secret.
 */
async function saveToVercel(target: VercelTarget, value: string): Promise<StoreResult> {
  const query = new URLSearchParams({ upsert: "true" });
  if (target.teamId) query.set("teamId", target.teamId);

  try {
    const response = await fetch(
      `https://api.vercel.com/v10/projects/${encodeURIComponent(target.projectId)}/env?${query}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${target.token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          key: REFRESH_TOKEN_KEY,
          value,
          type: "encrypted",
          target: ["production", "preview", "development"],
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        error?: { code?: string; message?: string };
      };
      const detail = payload.error?.message ?? `HTTP ${response.status}`;

      return {
        ok: false,
        reason: `Vercel refused the write — ${detail}`,
        how: [
          "A 403 usually means the access token cannot write to this project. Create one with full account scope, or the right team scope.",
          "A 404 means VERCEL_PROJECT_ID does not match — copy it from Project Settings → General → Project ID. Add VERCEL_TEAM_ID as well if the project belongs to a team.",
        ],
      };
    }

    return {
      ok: true,
      where: `the Vercel project's environment, as ${REFRESH_TOKEN_KEY}`,
      next: [
        "Redeploy. An environment variable only reaches the running functions on the next deployment — until then the booking page still shows provisional availability.",
        "Delete VERCEL_TOKEN and GOOGLE_OAUTH_SETUP_SECRET. Neither is needed again, and the first one can change anything about this project.",
      ],
    };
  } catch {
    return {
      ok: false,
      reason: "The Vercel API could not be reached",
      how: ["Check the deployment has outbound network access, then run the flow again."],
    };
  }
}

/**
 * Writes the value into `.env.local`, replacing any existing line for the key.
 *
 * Only ever called off Vercel. The file is gitignored by the Next.js default
 * `.gitignore`, and is chmod 600 where the platform supports it.
 */
function saveToEnvFile(value: string): StoreResult {
  const path = resolve(process.cwd(), ".env.local");
  const line = `${REFRESH_TOKEN_KEY}="${value}"`;

  try {
    let contents = "";
    try {
      contents = readFileSync(path, "utf8");
    } catch {
      // No .env.local yet; the write below creates it.
    }

    const pattern = new RegExp(`^${REFRESH_TOKEN_KEY}=.*$`, "m");
    const next = pattern.test(contents)
      ? contents.replace(pattern, line)
      : `${contents.replace(/\s*$/, "")}\n${line}\n`.replace(/^\n/, "");

    writeFileSync(path, next, { encoding: "utf8", mode: 0o600 });
    try {
      chmodSync(path, 0o600);
    } catch {
      // Windows and some mounts do not support it. Not worth failing over.
    }

    return {
      ok: true,
      where: `.env.local, as ${REFRESH_TOKEN_KEY}`,
      next: [
        "Restart the dev server if it does not pick the file up on its own.",
        `Copy that one line into the production deployment's environment variables when you are ready, then redeploy.`,
      ],
    };
  } catch (error) {
    return {
      ok: false,
      reason: `Could not write .env.local — ${error instanceof Error ? error.message : "unknown error"}`,
      how: ["Check the working directory is writable, then run the flow again."],
    };
  }
}

/**
 * Stores the refresh token, or explains why it could not be.
 *
 * Never returns the token, never logs it. A failure here means the grant is
 * discarded: running the flow again costs one click, and a token with nowhere
 * to live is worse than no token at all.
 */
export async function storeRefreshToken(value: string): Promise<StoreResult> {
  if (onVercel()) {
    const target = readVercelTarget();
    if (!target) {
      return {
        ok: false,
        reason: "This deployment has nowhere to put the token",
        how: [
          "Create a Vercel access token at vercel.com/account/tokens and set it as VERCEL_TOKEN on this project.",
          "Set VERCEL_PROJECT_ID from Project Settings → General → Project ID, and VERCEL_TEAM_ID too if the project sits in a team.",
          "Redeploy and run this flow again. Alternatively, run the whole flow against a local dev server, where the token is written to .env.local instead.",
        ],
      };
    }
    return saveToVercel(target, value);
  }

  return saveToEnvFile(value);
}

/**
 * Whether a store is available, without needing a token to try it.
 *
 * The authorize route checks this before sending anyone to Google: it is better
 * to say "configure somewhere to put this first" than to spend a consent and
 * then discard the result.
 */
export function storeIsAvailable(): boolean {
  return onVercel() ? readVercelTarget() !== null : true;
}

/** A one-line description of where a token would go, for the setup pages. */
export function storeDescription(): string {
  if (!onVercel()) return ".env.local on this machine";
  return readVercelTarget()
    ? "the Vercel project's environment variables"
    : "nowhere — VERCEL_TOKEN and VERCEL_PROJECT_ID are not set";
}
