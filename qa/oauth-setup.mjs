/**
 * The Google connect flow exists, and is closed.
 *
 * Both halves of that matter. `/api/booking/google/authorize` starts an OAuth
 * grant, so it must not start one for a stranger — but it must also not
 * pretend to be absent, which is what a 404 does and which reads as a broken
 * deployment to the one person who is supposed to use it.
 *
 * So: 503 with an explanation while `GOOGLE_OAUTH_SETUP_SECRET` is unset, 401
 * when it is set but not presented, and a redirect to Google only for a caller
 * who presented it. This asserts the first two, and that no response is ever
 * token-shaped.
 *
 * The authorised path is exercised by hand during setup — it ends at Google's
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
  /\bvercel_[\w]{20,}/i, // a Vercel access token
];

const PROBES = [
  ["/api/booking/google/authorize", "the authorize route"],
  ["/api/booking/google/authorize?secret=", "authorize with an empty secret"],
  ["/api/booking/google/authorize?secret=guess", "authorize with a guessed secret"],
  ["/api/booking/google/callback", "the callback route"],
  ["/api/booking/google/callback?code=abc&state=abc", "callback with a forged code"],
  ["/api/booking/google/status", "the status route"],
  ["/api/booking/google/status?secret=guess", "status with a guessed secret"],
];

for (const [path, label] of PROBES) {
  const response = await fetch(BASE + path, { redirect: "manual" });
  const body = await response.text();

  // The route exists and refuses. An earlier revision answered 404 here to hide
  // it, which was indistinguishable from a broken deploy. 503 is "closed, and
  // here is what to set", 401 is "open, but prove it is you", and 400 is the
  // callback rejecting a request that carries no valid state.
  ok(
    [400, 401, 503].includes(response.status),
    `${label} exists and refuses`,
    `got ${response.status}`,
  );

  const leak = TOKEN_SHAPED.find((pattern) => pattern.test(body));
  if (leak) problems.push(`${path}: response matched ${leak}`);

  // The one thing that must never happen unauthenticated: an actual grant.
  if (response.headers.get("location")?.includes("accounts.google.com")) {
    problems.push(`${path}: redirected to Google's consent screen unauthenticated`);
  }
}

ok(problems.length === 0, `${PROBES.length} probes found no open OAuth initiator`);

// A closed flow should say what to set rather than leaving the operator to
// guess. This is the sentence that cost a round trip when it was a bare 404.
const disabled = await fetch(`${BASE}/api/booking/google/authorize`);
const page = await disabled.text();
ok(
  page.includes("GOOGLE_OAUTH_SETUP_SECRET"),
  "the closed page names the variable that opens it",
);
ok(
  /no-store/.test(disabled.headers.get("cache-control") ?? ""),
  "the setup pages are never stored",
  disabled.headers.get("cache-control") ?? "no header",
);

// The callback used to print the refresh token to stderr for the operator to
// copy out of the function log. On a free plan that log is gone by the time
// you look, so the token now goes straight to storage — and nothing anywhere
// in the flow writes it to a console again.
const source = await import("node:fs").then((fs) =>
  fs.readFileSync("src/app/api/booking/google/callback/route.ts", "utf8"),
);
ok(
  !/console\.(log|error|warn|info)/.test(source),
  "the callback logs nothing at all",
);

console.log(problems.length === 0 ? "\nOAUTH SETUP CLOSED" : "\nPROBLEMS:\n- " + problems.join("\n- "));
process.exit(problems.length === 0 ? 0 : 1);
