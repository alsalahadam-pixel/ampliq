/**
 * The two pages the Google setup flow can render.
 *
 * Deliberately plain: this is an operator utility reached once, behind a
 * secret, not part of the site. It imports nothing from the design system and
 * ships no JavaScript, so it cannot drift when the site's styling changes and
 * has no surface to leak anything through.
 *
 * Every response carries `no-store` and `noindex`, and every interpolated value
 * goes through `escape` — the only untrusted strings that reach here are
 * Google's own error codes, but a page that handles OAuth is the wrong place to
 * rely on a source being trustworthy.
 */

const PALETTE = {
  ink: "#0f0f0e",
  paper: "#f7f5f2",
  graphite: "#6b6862",
  rule: "#e3ded6",
  accent: "#1b4dff",
} as const;

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type SetupSection = { term: string; detail: string };

/**
 * Renders one page.
 *
 * `steps` are rendered as an ordered list, `facts` as a definition list. Both
 * are optional; a page with neither is just a heading and a sentence.
 */
export function setupPage({
  status,
  title,
  lead,
  facts = [],
  steps = [],
  tone = "ok",
}: {
  status: number;
  title: string;
  lead: string;
  facts?: SetupSection[];
  steps?: string[];
  tone?: "ok" | "problem";
}): Response {
  const body = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escape(title)} — AMPLIQ setup</title>
<style>
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body {
    margin: 0; padding: 48px 24px;
    background: ${PALETTE.paper}; color: ${PALETTE.ink};
    font: 15px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  }
  main { max-width: 60ch; margin: 0 auto }
  .eyebrow {
    font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .14em; text-transform: uppercase;
    color: ${tone === "ok" ? PALETTE.accent : "#a4552b"};
    margin: 0 0 14px;
  }
  h1 { font-size: 1.6rem; line-height: 1.2; letter-spacing: -.02em; margin: 0 0 12px }
  p { margin: 0 0 16px; color: ${PALETTE.graphite} }
  dl { margin: 24px 0 0; border-top: 1px solid ${PALETTE.rule} }
  div.row { display: flex; gap: 24px; padding: 12px 0; border-bottom: 1px solid ${PALETTE.rule} }
  dt { flex: 0 0 13ch; color: ${PALETTE.graphite} }
  dd { margin: 0; word-break: break-word }
  ol { margin: 24px 0 0; padding-left: 1.2em; color: ${PALETTE.graphite} }
  li { margin-bottom: 10px }
  code {
    font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
    background: #fff; border: 1px solid ${PALETTE.rule};
    border-radius: 3px; padding: 1px 5px; color: ${PALETTE.ink};
  }
</style>
</head>
<body>
<main>
  <p class="eyebrow">${tone === "ok" ? "Google Calendar" : "Setup could not finish"}</p>
  <h1>${escape(title)}</h1>
  <p>${escape(lead)}</p>
  ${
    facts.length > 0
      ? `<dl>${facts
          .map(
            (fact) =>
              `<div class="row"><dt>${escape(fact.term)}</dt><dd>${escape(fact.detail)}</dd></div>`,
          )
          .join("")}</dl>`
      : ""
  }
  ${
    steps.length > 0
      ? `<ol>${steps.map((step) => `<li>${step}</li>`).join("")}</ol>`
      : ""
  }
</main>
</body>
</html>`;

  return new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

/**
 * What both routes answer when the connect flow has not been switched on.
 *
 * An earlier version answered 404 here, on the theory that a prober should not
 * learn the endpoint exists. That was the wrong trade: the operator probing it
 * is the owner, the 404 is indistinguishable from a failed deploy, and it cost
 * real time to diagnose. The endpoint says what it is and what it needs; the
 * secret is what protects it.
 */
export function setupDisabledPage(): Response {
  return setupPage({
    status: 503,
    tone: "problem",
    title: "The Google connect flow is not switched on",
    lead: "This endpoint exists and is working. It stays closed until a setup secret is configured, so that it cannot be used by anyone who happens to find it.",
    steps: [
      `Set ${code("GOOGLE_OAUTH_SETUP_SECRET")} on the deployment to a long random string — ${code("openssl rand -hex 32")} produces one.`,
      `Set ${code("GOOGLE_CLIENT_ID")}, ${code("GOOGLE_CLIENT_SECRET")} and ${code("GOOGLE_CALENDAR_ID")} if they are not set already.`,
      "Redeploy, then open this URL again with <code>?secret=&lt;the secret&gt;</code> on the end.",
      `Remove ${code("GOOGLE_OAUTH_SETUP_SECRET")} once the calendar is connected. This page comes back, and the booking integration keeps running on the refresh token.`,
    ],
  });
}

/** The flow is switched on, but this caller did not present the secret. */
export function setupUnauthorizedPage(): Response {
  const response = setupPage({
    status: 401,
    tone: "problem",
    title: "This endpoint needs the setup secret",
    lead: "The Google connect flow is switched on, so the endpoint is here — but it will not start an OAuth grant for a caller who cannot prove they own the deployment.",
    steps: [
      `Append ${code("?secret=<GOOGLE_OAUTH_SETUP_SECRET>")} to this URL, or send it as the ${code("X-AMPLIQ-Setup-Secret")} header.`,
      "The value is whatever you set on the deployment. It is compared in constant time and never logged.",
    ],
  });

  const headers = new Headers(response.headers);
  headers.set("www-authenticate", 'AMPLIQ-Setup realm="google-oauth"');
  return new Response(response.body, { status: response.status, headers });
}

/** `code` for the step lists above, pre-escaped. */
export function code(value: string): string {
  return `<code>${escape(value)}</code>`;
}
