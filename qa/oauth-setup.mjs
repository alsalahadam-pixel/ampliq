/**
 * The Google connect flow is closed by default.
 *
 * `/api/booking/google/authorize` starts an OAuth grant and
 * `/api/booking/google/callback` exchanges a code for a refresh token. Both
 * exist for one use, on one afternoon, and should spend the rest of their life
 * answering 404 — which they do unless `GOOGLE_OAUTH_SETUP_SECRET` is set.
 *
 * This asserts the closed state, because that is the one a deployment is
 * normally in and the one that matters if it is ever wrong. It also checks the
 * routes never answer with anything token-shaped, whatever they are asked.
 *
 * The open state is exercised by hand during setup: the flow ends at Google's
 * consent screen, which no automated check can click through.
 */

const BASE = process.env.QA_BASE ?? "http://localhost:3100";

const problems = [];
const ok = (cond, label, detail = "") =>
  cond
    ? console.log(`ok   ${label}${detail ? ` — ${detail}` : ""}`)
    : problems.push(`${label}${detail ? ` — ${detail}` : ""}`);

/** Anything that looks like a Google credential, in any response body. */
const TOKEN_SHAPED = [
  /ya29\.[\w.-]{20,}/, // access token
  /\b1\/\/[\w-]{20,}/, // refresh token
  /"refresh_token"/,
  /"access_token"/,
  /GOCSPX-[\w-]+/, // client secret
];

const PROBES = [
  ["/api/booking/google/authorize", "the authorize route"],
  ["/api/booking/google/authorize?secret=", "authorize with an empty secret"],
  ["/api/booking/google/authorize?secret=guess", "authorize with a guessed secret"],
  ["/api/booking/google/callback", "the callback route"],
  ["/api/booking/google/callback?code=abc&state=abc", "callback with a forged code"],
  ["/api/booking/google", "the flow's parent path"],
];

for (const [path, label] of PROBES) {
  const response = await fetch(BASE + path, { redirect: "manual" });
  const body = await response.text();

  ok(response.status === 404, `${label} answers 404`, `got ${response.status}`);

  const leak = TOKEN_SHAPED.find((pattern) => pattern.test(body));
  if (leak) problems.push(`${path}: response matched ${leak}`);

  // A 302 would mean the gate opened; a redirect to Google would mean it
  // opened to anyone. Checked separately because a body-only test would miss it.
  if (response.headers.get("location")?.includes("accounts.google.com")) {
    problems.push(`${path}: redirected to Google's consent screen unauthenticated`);
  }
}

ok(problems.length === 0, `${PROBES.length} probes found no open OAuth initiator`);

// The setup pages must never be cached by anything between here and a browser.
const callback = await fetch(`${BASE}/api/booking/google/callback`);
ok(
  /no-store/.test(callback.headers.get("cache-control") ?? ""),
  "the callback is never stored",
  callback.headers.get("cache-control") ?? "no header",
);

console.log(problems.length === 0 ? "\nOAUTH SETUP CLOSED" : "\nPROBLEMS:\n- " + problems.join("\n- "));
process.exit(problems.length === 0 ? 0 : 1);
