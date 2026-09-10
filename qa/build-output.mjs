/**
 * What the build actually ships.
 *
 * A page can render nothing and still hand a visitor the words: import a
 * server module into a client component and its whole contents land in a
 * browser bundle. That happened once here — gating a form's privacy link on a
 * flag imported from `@/lib/legal` pulled the entire legal-entity registry,
 * placeholder tokens and all, into two chunks any visitor could download. The
 * rendered page looked perfect throughout.
 *
 * So this reads `.next` rather than the rendered page. The legal documents
 * themselves are public and belong in the output; what may never appear in it
 * is a placeholder token or a sentence describing the state of the paperwork —
 * in a client chunk, in a prerendered document, anywhere a browser can reach.
 *
 * Run it after `npm run build`; it needs no server.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const BUILD = ".next";
const PUBLIC_FILE = /\.(js|css|html|rsc|txt|json)$/;

/**
 * The entity registry belongs to the server. A browser chunk carrying one of
 * these tokens means a client component reached into `@/lib/legal` again.
 */
const REGISTRY_TOKENS = [
  "BUSINESS ADDRESS", "LEGAL NAME", "RESPONSIBLE PERSON", "POSTAL CODE",
  "VAT ID", "TAX NUMBER", "REGISTRATION NUMBER", "SUPERVISORY AUTHORITY",
  "DATA PROTECTION CONTACT", "HOSTING PROVIDER", "EMAIL PROCESSOR",
  "CALENDAR PROCESSOR",
];

/**
 * Wording that tells a visitor the company is unfinished. None of it may ship
 * anywhere, rendered or not — the documents say what is known and stop there.
 */
const FORBIDDEN_PHRASES = [
  /\[[A-Z][A-Z \-/]{3,}\]/,
  /not yet complete/i, /nicht vollständig/i,
  /not (yet )?legally reviewed/i, /juristisch gepr[üu]ft/i,
  /working draft/i, /arbeitsstand/i, /entwurfsfassung/i,
  /(required|supplied|needed|in place)[^.<]{0,40}before launch/i,
  /vor dem launch (erforderlich|ergänzt|benötigt)/i,
  /muss vor dem launch/i, /vor dem launch muss/i,
  /to be supplied/i, /wird noch ergänzt/i,
  /noch nicht (vollständig|verfügbar|ergänzt|eingetragen|geprüft)/i,
  /document status/i, /dokumentstatus/i,
  /placeholder\s*[—–-]/i, /platzhalter\s*[—–-]/i,
  /commercial register/i, /handelsregister/i,
  /not (currently|yet) (entered|registered)/i, /unregistered/i,
  /nicht registriert/i,
  /once (the|it is) confirmed/i, /sobald .{0,30}feststeht/i,
  /will be (stated|named|added) here/i, /wird hier (benannt|angegeben)/i,
  /coming soon/i, /demnächst verfügbar/i,
  /information (is )?missing/i, /angaben fehlen/i,
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

/** Reports every forbidden phrase in one file, with enough context to find it. */
function scanPhrases(file, text) {
  for (const pattern of FORBIDDEN_PHRASES) {
    const hit = text.match(pattern);
    if (hit) problems.push(`${file} contains ${pattern} — "${hit[0].slice(0, 70)}"`);
  }
}

// 1. Client bundles: no registry, no draft wording.
let clientFiles = 0;
for (const file of walk(join(BUILD, "static"))) {
  if (!PUBLIC_FILE.test(file)) continue;
  clientFiles++;
  const text = readFileSync(file, "utf8");
  for (const token of REGISTRY_TOKENS) {
    if (text.includes(token)) problems.push(`${file} carries the entity registry — "${token}"`);
  }
  scanPhrases(file, text);
}

// 2. Prerendered documents: the legal pages must be the documents themselves,
//    and no prerendered page anywhere may carry the forbidden wording.
let prerendered = 0;
let legalPages = 0;
for (const file of walk(join(BUILD, "server", "app"))) {
  if (!/\.html$/.test(file)) continue;
  prerendered++;
  const text = readFileSync(file, "utf8");
  scanPhrases(file, text);

  if (!/legal/.test(file)) continue;
  legalPages++;

  // Every prerendered page carries the not-found boundary in its flight data,
  // so looking for 404 copy proves nothing. What proves the document rendered
  // is its own structure: `LegalDocument` gives each chapter a heading with an
  // id, and every one of these documents has several.
  const chapters = (text.match(/-heading"/g) ?? []).length;
  if (!/legal\/[a-z]+\.html$/.test(file)) continue;
  if (chapters < 3) {
    problems.push(`${file} rendered ${chapters} chapters — the document did not build`);
  }
}

if (legalPages === 0) {
  problems.push("no legal document was prerendered — the section did not build");
}

console.log(
  problems.length === 0
    ? `BUILD OUTPUT CLEAN — ${clientFiles} client files carry no entity registry; ${prerendered} prerendered pages (${legalPages} legal) carry no draft wording`
    : `Problems in the shipped build (${problems.length}):\n  ` + problems.join("\n  "),
);
process.exit(problems.length === 0 ? 0 : 1);
