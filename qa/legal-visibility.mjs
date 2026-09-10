/**
 * The legal section, as a visitor meets it.
 *
 * Two things have to be true at once, and they pull in opposite directions.
 * The five documents are public: reachable, linked from the footer, whole. And
 * nothing in them — or anywhere else on the site — tells the reader that the
 * company is unfinished: no bracketed placeholder, no red warning, no sentence
 * about what has still to be supplied or reviewed.
 *
 * The renderer keeps the second true by dropping any row, sentence or chapter
 * that depends on a value AMPLIQ does not have. This checks the consequence:
 * that what survives still reads as a finished document, with no heading left
 * standing over nothing and no contents entry pointing at a section that is
 * not there.
 */

import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

/** Anything that would tell a visitor the company is not finished yet. */
const FORBIDDEN = [
  /\[[A-Z][A-Z \-/]{3,}\]/,
  /not yet complete/i, /nicht vollständig/i,
  /not (yet )?legally reviewed/i, /juristisch gepr[üu]ft/i,
  /working draft/i, /arbeitsstand/i, /entwurfsfassung/i,
  /(required|supplied|needed|in place)[^.]{0,40}before launch/i,
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

const PUBLIC = [
  "/en", "/de", "/en/services", "/de/services", "/en/packages", "/de/packages",
  "/en/about", "/de/about", "/en/insights", "/de/insights",
  "/en/contact", "/de/contact", "/en/start", "/de/start",
  "/en/start/call", "/de/start/call",
  "/en/services/web-design", "/en/insights/what-a-business-website-costs-in-germany",
];

/** The five documents, in both languages. All of them are public. */
const DOCUMENTS = ["imprint", "privacy", "terms", "cancellation", "cookies"];
const LEGAL = ["/en/legal", "/de/legal"].concat(
  DOCUMENTS.flatMap((doc) => [`/en/legal/${doc}`, `/de/legal/${doc}`]),
);

const problems = [];
const ok = (cond, label, detail = "") =>
  cond
    ? console.log(`ok   ${label}${detail ? ` — ${detail}` : ""}`)
    : problems.push(`${label}${detail ? ` — ${detail}` : ""}`);

/**
 * Reads one page: its visible text, whether anything on it is drawn red, and —
 * on a document page — the shape of the contents rail against the sections it
 * points at.
 */
async function inspect(path) {
  const res = await page.goto(BASE + path, { waitUntil: "load" });
  return {
    status: res?.status(),
    ...(await page.evaluate(() => {
      const sections = [...document.querySelectorAll("main section[id]")].filter(
        (el) => el.querySelector("h2"),
      );
      return {
        text: document.body.innerText,
        footerLegal: [...document.querySelectorAll("footer a[href]")]
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && /\/legal\//.test(h)),
        contents: [...document.querySelectorAll('nav a[href^="#"]')].map((a) =>
          a.getAttribute("href").slice(1),
        ),
        sections: sections.map((el) => ({
          id: el.id,
          body: el.querySelectorAll("p, li, dd").length,
        })),
        // A red border, fill or letter anywhere is the old warning treatment
        // coming back. The palette has no red in it, so any is a regression.
        red: [...document.querySelectorAll("*")].some((el) => {
          const s = getComputedStyle(el);
          for (const v of [s.color, s.backgroundColor, s.borderTopColor]) {
            const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!m) continue;
            const [r, g, b] = [+m[1], +m[2], +m[3]];
            if (r > 120 && r - g > 60 && r - b > 60) return true;
          }
          return false;
        }),
      };
    })),
  };
}

function scan(path, text) {
  const hits = FORBIDDEN.filter((re) => re.test(text)).map(String);
  if (hits.length) problems.push(`${path}: draft language — ${hits.join(" ")}`);
}

// 1. The rest of the site says nothing about the state of the paperwork.
for (const path of PUBLIC) {
  const r = await inspect(path);
  if (r.status !== 200) {
    problems.push(`${path} → ${r.status}`);
    continue;
  }
  scan(path, r.text);
  if (r.red) problems.push(`${path}: red styling present`);
}
ok(problems.length === 0, `${PUBLIC.length} public pages carry no draft language or red`);

// 2. Every legal route is public, clean, and structurally whole.
const before = problems.length;
for (const path of LEGAL) {
  const r = await inspect(path);
  if (r.status !== 200) {
    problems.push(`${path} → ${r.status}, expected 200`);
    continue;
  }
  scan(path, r.text);
  if (r.red) problems.push(`${path}: red styling present`);

  const empty = r.sections.filter((s) => s.body === 0).map((s) => s.id);
  if (empty.length) problems.push(`${path}: heading with nothing under it — ${empty.join(", ")}`);

  // The rail is built from the same filtered chapters as the body, so a
  // mismatch means one of them is reading the unfiltered list.
  const ids = r.sections.map((s) => s.id);
  const dangling = r.contents.filter((id) => !ids.includes(id));
  if (dangling.length) problems.push(`${path}: contents points at nothing — ${dangling.join(", ")}`);
}
ok(problems.length === before, `all ${LEGAL.length} legal routes answer 200 with no empty chapter`);

// 3. The footer links every document, in both languages.
for (const locale of ["en", "de"]) {
  const r = await inspect(`/${locale}`);
  const missing = DOCUMENTS.filter(
    (doc) => !r.footerLegal.some((h) => h.endsWith(`/legal/${doc}`)),
  );
  ok(missing.length === 0, `the ${locale} footer links all five documents`, missing.join(", "));
}

// 4. The forms point at the policy that governs what they collect.
await page.goto(`${BASE}/en/contact`, { waitUntil: "load" });
const enquiryLinks = await page.locator('form a[href$="/legal/privacy"]').count();
ok(enquiryLinks > 0, "the enquiry form links the privacy policy", `${enquiryLinks} links`);

// The booking form is the third step of the flow, so the note only exists once
// a day and a time have been chosen — checking the landing page finds nothing
// and proves nothing.
await page.goto(`${BASE}/en/start/call`, { waitUntil: "load" });
await page.locator('[role="gridcell"] button[aria-disabled="false"]').first().click();
await page.locator('button[aria-pressed="false"]:not([disabled])').first().click();
const bookingLinks = await page.locator('form a[href$="/legal/privacy"]').count();
ok(bookingLinks > 0, "the booking form links the privacy policy", `${bookingLinks} links`);

// 5. Legally required disclosures, not search results.
await page.goto(`${BASE}/en/legal/imprint`, { waitUntil: "load" });
const robots = await page
  .locator('head meta[name="robots"]')
  .getAttribute("content")
  .catch(() => null);
ok(/noindex/.test(robots ?? ""), "the legal pages stay out of the index", robots ?? "no tag");

console.log(problems.length === 0 ? "\nLEGAL VISIBILITY CLEAN" : "\nPROBLEMS:\n- " + problems.join("\n- "));
await browser.close();
process.exit(problems.length === 0 ? 0 : 1);
