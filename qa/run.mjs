/**
 * The whole QA suite, in order, against one running site.
 *
 *   npm run build && npm run start -- -p 3100   # in one terminal
 *   npm run qa                                  # in another
 *
 * Or point it somewhere else:
 *
 *   QA_BASE=https://staging.example.com npm run qa
 *
 * Every check exits non-zero when it finds something, and so does this, so it
 * can gate a deploy. `perf` is reported but never fails the run — it prints
 * numbers to read, not a threshold to pass.
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.QA_BASE ?? "http://localhost:3100";

/** In dependency order: the cheap structural checks first. */
const CHECKS = [
  { name: "site-url", what: "the site origin is never a fragment, whatever the environment says" },
  { name: "build-output", what: "no entity registry in client bundles, no draft wording anywhere" },
  { name: "crawl", what: "every internal link resolves, no console errors" },
  { name: "seo", what: "titles, descriptions, canonicals, hreflang, Open Graph, robots, sitemap" },
  { name: "a11y", what: "labels, alt text, accessible names, heading order" },
  { name: "contrast", what: "WCAG AA contrast on every text node" },
  { name: "german", what: "translation completeness, formal address, link locale" },
  { name: "legal-visibility", what: "the five documents are public, linked and whole; no draft language" },
  { name: "addresses", what: "project@ and info@ stay in their own lanes" },
  { name: "rules-probe", what: "no hairline is drawn twice" },
  { name: "mobile", what: "overflow, gutters, tap targets and text size at 7 widths" },
  { name: "contact", what: "the enquiry flow end to end" },
  { name: "booking", what: "the booking flow end to end, including double-booking" },
  { name: "perf", what: "page weight, layout shift and LCP", advisory: true },
];

function run(name) {
  return new Promise((resolve) => {
    // `site-url` imports the app's own module, so it needs type stripping and
    // the `@/` resolver the rest of the scripts do not.
    const args =
      name === "site-url"
        ? ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--experimental-strip-types", "--import", join(HERE, "..", "scripts", "alias-hook.mjs"), join(HERE, `${name}.mjs`)]
        : [join(HERE, `${name}.mjs`)];

    const child = spawn(process.execPath, args, {
      env: { ...process.env, QA_BASE: BASE },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (d) => (output += d));
    child.stderr.on("data", (d) => (output += d));
    child.on("close", (code) => resolve({ code, output: output.trimEnd() }));
  });
}

// Fail fast if nothing is listening — otherwise every check reports the same
// connection error and the real problem is buried nine times over.
try {
  const probe = await fetch(`${BASE}/en`, { redirect: "manual" });
  if (probe.status >= 500) throw new Error(`HTTP ${probe.status}`);
} catch (error) {
  console.error(`\nNothing is serving ${BASE} — ${error.message}\n`);
  console.error("  npm run build && npm run start -- -p 3100\n");
  process.exit(2);
}

console.log(`\nAMPLIQ QA — ${BASE}\n`);

const failed = [];
for (const check of CHECKS) {
  process.stdout.write(`  ${check.name.padEnd(10)} ${check.what}\n`);
  const { code, output } = await run(check.name);
  const ok = code === 0 || check.advisory;

  for (const line of output.split("\n")) console.log(`      ${line}`);
  console.log();

  if (!ok) failed.push(check.name);
}

if (failed.length === 0) {
  console.log("All checks pass.\n");
} else {
  console.log(`Failed: ${failed.join(", ")}\n`);
}

process.exit(failed.length === 0 ? 0 : 1);
