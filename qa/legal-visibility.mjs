import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Anything that would tell a visitor the legal pages are unfinished.
const FORBIDDEN = [
  /not yet complete/i, /nicht vollständig/i,
  /not yet legally reviewed/i, /juristisch geprüft/i,
  /working draft/i, /arbeitsstand/i,
  /required before launch/i, /vor dem launch erforderlich/i,
  /outstanding/i, /to be supplied/i, /wird noch ergänzt/i,
  /document status/i, /dokumentstatus/i,
  /\[[A-Z][A-Z \-/]*\]/,          // any placeholder token
  /nur soweit für die rechtsform/i,
  /only if applicable to the legal form/i,
  /commercial register/i, /handelsregister/i,
  /not (currently|yet) (entered|registered)/i,
  /nicht.{0,20}eingetragen/i,
  /unregistered/i, /nicht registriert/i,
];

const PUBLIC = [
  "/en", "/de", "/en/services", "/de/services", "/en/packages", "/de/packages",
  "/en/about", "/de/about", "/en/insights", "/de/insights",
  "/en/contact", "/de/contact", "/en/start", "/de/start",
  "/en/start/call", "/de/start/call",
  "/en/services/web-design", "/en/insights/what-a-business-website-costs-in-germany",
];

// While the section is unpublished every one of these must be a plain 404 —
// not a page explaining why it is unavailable.
const LEGAL = [
  "/en/legal", "/de/legal",
  "/en/legal/imprint", "/de/legal/imprint",
  "/en/legal/privacy", "/de/legal/privacy",
  "/en/legal/terms", "/de/legal/terms",
  "/en/legal/cancellation", "/de/legal/cancellation",
  "/en/legal/cookies", "/de/legal/cookies",
];

const problems = [];
const ok = (cond, label, detail = "") =>
  cond ? console.log(`ok   ${label}${detail ? ` — ${detail}` : ""}`)
       : problems.push(`${label}${detail ? ` — ${detail}` : ""}`);

for (const path of PUBLIC) {
  const res = await page.goto(BASE + path, { waitUntil: "load" });
  if (!res || res.status() >= 400) { problems.push(`${path} → ${res?.status()}`); continue; }

  const r = await page.evaluate(() => ({
    text: document.body.innerText,
    legalLinks: [...document.querySelectorAll("a[href]")]
      // The language switcher points at the current page in the other
      // language, which on a legal page is a legal URL, and that is correct.
      .filter((a) => !a.hasAttribute("hreflang"))
      .map((a) => a.getAttribute("href"))
      .filter((h) => h && /\/legal(\/|$)/.test(h)),
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
  }));

  const hits = FORBIDDEN.filter((re) => re.test(r.text)).map(String);
  if (hits.length) problems.push(`${path}: legal draft language — ${hits.join(" ")}`);
  if (r.red) problems.push(`${path}: red styling present`);
  if (r.legalLinks.length) problems.push(`${path}: links to a legal route — ${[...new Set(r.legalLinks)].join(", ")}`);
}

// The legal routes themselves must simply not exist.
for (const path of LEGAL) {
  const res = await page.goto(BASE + path, { waitUntil: "load" });
  const status = res?.status();
  if (status !== 404) problems.push(`${path} → ${status}, expected 404`);
  const text = await page.evaluate(() => document.body.innerText);
  const hits = FORBIDDEN.filter((re) => re.test(text)).map(String);
  if (hits.length) problems.push(`${path}: the 404 explains itself — ${hits.join(" ")}`);
}

ok(problems.length === 0,
  `${PUBLIC.length} public pages carry no legal statement, placeholder, red or legal link, and all ${LEGAL.length} legal routes are 404`);

// The privacy note stays — it says what happens to the details — but its link
// goes while the policy page is a 404.
await page.goto(`${BASE}/en/contact`, { waitUntil: "load" });
const formLink = await page.locator('form a[href$="/legal/privacy"]').count();
const formNote = await page.locator("form").innerText();
ok(formLink === 0, "the enquiry form no longer links a page that is not there", `${formLink} links`);
ok(/we use your details/i.test(formNote), "the enquiry form still explains what it does with the details");

console.log(problems.length === 0 ? "\nLEGAL VISIBILITY CLEAN" : "\nPROBLEMS:\n- " + problems.join("\n- "));
process.exit(problems.length === 0 ? 0 : 1);
