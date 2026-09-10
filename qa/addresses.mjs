/**
 * The two addresses must not blur into each other.
 *
 *   project@  the Start-a-project flow, the enquiry form, the booking, and
 *             every automated message either of them sends.
 *   info@     the general company address.
 */
import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const problems = [];
const ok = (cond, label, detail = "") =>
  cond ? console.log(`ok   ${label}${detail ? ` — ${detail}` : ""}`)
       : problems.push(`${label}${detail ? ` — ${detail}` : ""}`);

async function mailtos(path, selector = "main") {
  await page.goto(BASE + path, { waitUntil: "load" });
  return page.$$eval(`${selector} a[href^="mailto:"]`, (els) =>
    [...new Set(els.map((a) => a.getAttribute("href").replace("mailto:", "")))]);
}

// The project entrances lead to the project address.
const fork = await mailtos("/en/start");
ok(fork.length === 1 && fork[0].startsWith("project@"),
  "the Start-a-project fork offers the project address", fork.join(", "));

// The booking page's own escape hatch ("rather write than talk?") is a
// project route, so it must land on the brief rather than a mailbox.
await page.goto(`${BASE}/en/start/call`, { waitUntil: "load" });
const fallback = await page.$$eval('a[href$="/contact"]', (els) => els.length);
ok(fallback >= 1, "the booking page offers the written route back", `${fallback} link`);

const brief = await mailtos("/en/contact");
ok(brief[0]?.startsWith("project@"),
  "the project brief leads with the project address", brief.join(", "));

const home = await mailtos("/en");
ok(home.every((a) => a.startsWith("project@")),
  "the closing project CTA uses the project address", home.join(", "));

// The footer is the general company contact.
await page.goto(`${BASE}/en`, { waitUntil: "load" });
const foot = await page.$$eval('footer a[href^="mailto:"]',
  (els) => els.map((a) => a.getAttribute("href").replace("mailto:", "")));
ok(foot[0]?.startsWith("info@"), "the footer leads with the general address", foot.join(", "));
ok(foot.some((a) => a.startsWith("project@")) && foot.some((a) => a.startsWith("help@")),
  "the footer still lists the project and help addresses", foot.join(", "));

// Structured data keeps them apart.
await page.goto(`${BASE}/en`, { waitUntil: "load" });
const nodes = await page.$$eval('script[type="application/ld+json"]', (els) =>
  els.flatMap((s) => {
    try {
      const parsed = JSON.parse(s.textContent);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  }));
const org = nodes.find((n) => n["@type"] === "Organization") ?? {};
const points = Object.fromEntries(
  (org.contactPoint ?? []).map((c) => [c.contactType, c.email]));
ok(org.email?.startsWith("info@"), "the organisation's own address is the general one", org.email);
ok(points.sales?.startsWith("project@"), "the sales contact point is the project address", points.sales);
ok(points["customer support"]?.startsWith("help@"), "support is the help address", points["customer support"]);

console.log(problems.length === 0 ? "\nADDRESSES CLEAN" : "\nPROBLEMS:\n- " + problems.join("\n- "));
process.exit(problems.length === 0 ? 0 : 1);
