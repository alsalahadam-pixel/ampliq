/**
 * The site origin can never be a fragment.
 *
 * A production build once failed on `new URL("https://")`, because a hosting
 * dashboard hands you an empty string for a variable that is defined with no
 * value, and `??` does not fall back on an empty string. Everything on the
 * site derives from this one value — canonical URLs, hreflang, the sitemap,
 * Open Graph, every published address — so a fragment here breaks the build
 * rather than one page.
 *
 * This exercises the reader directly. It needs no server and no build.
 */

import { readOrigin, siteUrl, siteDomain, siteOrigin } from "../src/lib/site.ts";

const FALLBACK = "https://ampliq.net";

/** [input, expected origin or null] */
const CASES = [
  // The case that broke production: defined, but empty.
  ["", null],
  ["   ", null],
  [undefined, null],

  // Fragments and malformed values.
  ["https://", null],
  ["http://", null],
  ["https:/", null],
  ["//", null],
  ["/", null],
  ["https:// ", null],
  ["not a url", null],
  ["ftp://ampliq.net", null],
  ["javascript:alert(1)", null],

  // A bare word is a typo, not a host.
  ["ampliq", null],

  // The forms someone actually types.
  ["ampliq.net", "https://ampliq.net"],
  ["  ampliq.net  ", "https://ampliq.net"],
  ["https://ampliq.net", "https://ampliq.net"],
  ["https://ampliq.net/", "https://ampliq.net"],
  ["http://ampliq.net", "http://ampliq.net"],
  ["https://www.ampliq.net", "https://www.ampliq.net"],
  ["https://ampliq.net/some/path", "https://ampliq.net"],
  ["ampliq-preview.vercel.app", "https://ampliq-preview.vercel.app"],
  ["localhost:3000", "https://localhost:3000"],
  ["http://localhost:3000", "http://localhost:3000"],
];

const problems = [];

for (const [input, expected] of CASES) {
  const actual = readOrigin(input);
  if (actual !== expected) {
    problems.push(
      `readOrigin(${JSON.stringify(input)}) → ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`,
    );
  }
}

// Whatever the environment says, what the site exports must be usable.
try {
  const parsed = new URL(siteUrl);
  if (!parsed.hostname) problems.push(`siteUrl "${siteUrl}" has no host`);
  if (siteUrl.endsWith("/")) problems.push(`siteUrl "${siteUrl}" has a trailing slash`);
  if (siteDomain !== parsed.hostname) {
    problems.push(`siteDomain "${siteDomain}" disagrees with siteUrl "${siteUrl}"`);
  }
  if (siteOrigin.href.replace(/\/$/, "") !== siteUrl) {
    problems.push(`siteOrigin "${siteOrigin.href}" disagrees with siteUrl "${siteUrl}"`);
  }
} catch (error) {
  problems.push(`new URL(siteUrl) threw on "${siteUrl}": ${error.message}`);
}

// And the fallback itself has to be one.
if (readOrigin(FALLBACK) !== FALLBACK) {
  problems.push(`the fallback "${FALLBACK}" is not a valid origin`);
}

console.log(
  problems.length === 0
    ? `SITE URL CLEAN — ${CASES.length} inputs handled, siteUrl is "${siteUrl}"`
    : `Site URL problems (${problems.length}):\n  ` + problems.join("\n  "),
);
process.exit(problems.length === 0 ? 0 : 1);
