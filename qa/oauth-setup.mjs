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
];

const PROBES = [
  ["/api/booking/google/authorize", "the authorize route"],
  ["/api/booking/google/authorize?secret=", "authorize with an empty secret"],
  ["/api/booking/google/authorize?secret=guess", "authorize with a guessed secret"],
  ["/api/booking/google/callback", "the callback route"],
  ["/api/booking/google/callback?code=abc&state=abc", "callback with a forged code"],
];

for (const [path, label] of PROBES) {
  const response = await fetch(BASE + path, { redirect: "manual" });
  const body = await response.text();

  // The route exists. An earlier revision answered 404 here to hide it, which
  // was indistinguishable from a broken deploy; 503 means "closed, and here is
  // what to set", 401 means "open, but prove it is you".
  ok(
    response.status === 503 || response.status === 401,
    `${label} exists and is closed`,
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

console.log(problems.length === 0 ? "\nOAUTH SETUP CLOSED" : "\nPROBLEMS:\n- " + problems.join("\n- "));
process.exit(problems.length === 0 ? 0 : 1);
