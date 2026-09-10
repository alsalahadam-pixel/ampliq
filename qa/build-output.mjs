/**
 * What the build actually ships.
 *
 * A page can render nothing and still hand a visitor the words: import a
 * server module into a client component and its whole contents land in a
 * browser bundle. That happened once here — gating a form's privacy link on
 * `legalIsPublished` pulled the entire legal-entity registry, placeholder
 * tokens and all, into two chunks any visitor could download.
 *
 * So this reads `.next` rather than the rendered page: nothing a visitor can
 * fetch may contain the legal documents, their placeholder tokens, or any
 * statement about what the business has not settled yet.
 *
 * Run it after `npm run build`; it needs no server.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BUILD = ".next";

/** Everything a visitor can fetch: client chunks and prerendered documents. */
const PUBLIC_DIRS = [join(BUILD, "static")];
const PUBLIC_FILE = /\.(js|css|html|rsc|txt|json)$/;

/** Never shipped to a browser while the legal section is unpublished. */
const FORBIDDEN = [
  "BUSINESS ADDRESS", "LEGAL NAME", "RESPONSIBLE PERSON", "POSTAL CODE",
  "VAT ID", "TAX NUMBER", "REGISTRATION NUMBER", "SUPERVISORY AUTHORITY",
  "DATA PROTECTION CONTACT",
  "Handelsregister", "commercial register", "not currently entered",
  "not yet legally reviewed", "working draft", "required before launch",
  "To be supplied", "Wird noch ergänzt",
  "Provider identification", "Anbieterkennzeichnung", "§ 5 DDG",
];

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

const problems = [];
let scanned = 0;

// 1. Client bundles must not carry any of it.
for (const dir of PUBLIC_DIRS) {
  for (const file of walk(dir)) {
    if (!PUBLIC_FILE.test(file)) continue;
    scanned++;
    const text = readFileSync(file, "utf8");
    for (const phrase of FORBIDDEN) {
      if (text.includes(phrase)) problems.push(`${file} contains "${phrase}"`);
    }
  }
}

// 2. Anything prerendered at a legal path must be the not-found page, not the
//    document — a static host serving the build directly must not expose it.
const legalPages = [...walk(join(BUILD, "server", "app"))]
  .filter((f) => /legal.*\.html$/.test(f));

for (const file of legalPages) {
  const text = readFileSync(file, "utf8");
  const isNotFound = /doesn't exist|existiert nicht|404/i.test(text);
  if (!isNotFound) problems.push(`${file} is a rendered legal document, not a 404`);
  for (const phrase of FORBIDDEN) {
    if (text.includes(phrase)) problems.push(`${file} contains "${phrase}"`);
  }
}

console.log(
  problems.length === 0
    ? `BUILD OUTPUT CLEAN — ${scanned} client files and ${legalPages.length} prerendered legal paths carry no legal content`
    : `Legal content in the shipped build (${problems.length}):\n  ` + problems.join("\n  "),
);
process.exit(problems.length === 0 ? 0 : 1);
