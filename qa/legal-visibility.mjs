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
];

const PUBLIC = [
  "/en", "/de", "/en/services", "/de/services", "/en/packages", "/de/packages",
  "/en/about", "/de/about", "/en/insights", "/de/insights",
  "/en/contact", "/de/contact", "/en/start", "/de/start",
  "/en/start/call", "/de/start/call",
  "/en/services/web-design", "/en/insights/what-a-business-website-costs-in-germany",
];

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

for (const path of [...PUBLIC, ...LEGAL]) {
  const res = await page.goto(BASE + path, { waitUntil: "load" });
  if (!res || res.status() >= 400) { problems.push(`${path} → ${res?.status()}`); continue; }

  const r = await page.evaluate(() => ({
    text: document.body.innerText,
    legalLinks: [...document.querySelectorAll("footer a[href], header a[href], nav a[href]")]
      // The language switcher points at the current page in the other
      // language — on a legal page that is a legal URL, and that is correct.
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
  if (hits.length) problems.push(`${path}: draft language — ${hits.join(" ")}`);
  if (r.red) problems.push(`${path}: red styling present`);
  if (r.legalLinks.length) problems.push(`${path}: legal links in chrome — ${[...new Set(r.legalLinks)].join(", ")}`);
}

ok(problems.length === 0, `${PUBLIC.length + LEGAL.length} pages carry no draft language, no placeholder, no red, no legal link in the header, nav or footer`);

// The two form privacy links are deliberate and must survive.
await page.goto(`${BASE}/en/contact`, { waitUntil: "load" });
const formLink = await page.locator('form a[href$="/legal/privacy"]').count();
ok(formLink === 1, "the enquiry form still links its privacy note", `${formLink} link`);

// The documents must still read as finished documents, not empty shells.
for (const path of ["/en/legal/imprint", "/de/legal/privacy", "/en/legal/terms"]) {
  await page.goto(BASE + path, { waitUntil: "load" });
  const { chapters, words } = await page.evaluate(() => ({
    chapters: document.querySelectorAll("main section[id]").length,
    words: (document.querySelector("main")?.innerText ?? "").split(/\s+/).length,
  }));
  ok(chapters >= 3 && words > 200, `${path} still reads as a document`, `${chapters} chapters, ${words} words`);
}

console.log(problems.length === 0 ? "\nLEGAL VISIBILITY CLEAN" : "\nPROBLEMS:\n- " + problems.join("\n- "));
process.exit(problems.length === 0 ? 0 : 1);
