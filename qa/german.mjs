import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const routes = [
  "/de", "/de/services", "/de/services/web-design", "/de/services/seo",
  "/de/packages", "/de/about", "/de/insights",
  "/de/insights/what-a-business-website-costs-in-germany",
  "/de/contact", "/de/start", "/de/start/call",
  "/de/legal", "/de/legal/imprint", "/de/legal/privacy", "/de/legal/terms",
  "/de/legal/cancellation", "/de/legal/cookies",
];

// Words that would mean an English string leaked into the German site. Kept to
// terms that are never German, so loanwords like Marketing, Website, Branding,
// Content, Design, Insights and Meta Ads do not trip it.
const ENGLISH_ONLY = /\b(the|and|with|your|our|from|that|which|please|thank you|choose|select|submit|available|working days|read more|learn more|get in touch|coming soon|lorem ipsum|TODO|TBD)\b/i;

const issues = [];
const skipped = [];
let duCount = 0;
let sieCount = 0;

for (const path of routes) {
  const response = await page.goto(BASE + path, { waitUntil: "load" });
  if (response && response.status() === 404) { skipped.push(path); continue; }
  const r = await page.evaluate(() => {
    const main = document.querySelector("main") ?? document.body;
    return {
      text: main.innerText,
      links: [...document.querySelectorAll("a[href^='/']")]
        .filter((a) => !a.hasAttribute("hreflang"))
        .map((a) => a.getAttribute("href")),
      lang: document.documentElement.lang,
      title: document.title,
      empties: [...document.querySelectorAll("h1,h2,h3,p,li")]
        .filter((el) => el.children.length === 0 && el.textContent.trim() === "").length,
    };
  });

  const flags = [];

  // Every internal link on a German page must stay on the German site.
  const escaped = r.links.filter((h) => h.startsWith("/en"));
  if (escaped.length) flags.push(`links to /en: ${[...new Set(escaped)].join(", ")}`);

  // Untranslated English, line by line so the report names the line.
  for (const line of r.text.split("\n")) {
    // `[BUSINESS ADDRESS]` and friends are identifiers that match the env var
    // names and the launch checklist, not copy — they are the same token in
    // both languages on purpose.
    const trimmed = line.replace(/\[[A-Z][A-Z \-/]*\]/g, "").trim();
    if (trimmed.length < 12) continue;
    if (ENGLISH_ONLY.test(trimmed)) flags.push(`English: "${trimmed.slice(0, 72)}"`);
    if (flags.length > 4) break;
  }

  // Formal address must be consistent: German business copy uses Sie.
  duCount += (r.text.match(/\b(du|dich|dir|dein|deine|deinem|deiner|deinen)\b/gi) ?? []).length;
  sieCount += (r.text.match(/\b(Sie|Ihnen|Ihr|Ihre|Ihrem|Ihren|Ihrer)\b/g) ?? []).length;

  if (r.lang !== "de-DE") flags.push(`html lang=${r.lang}`);
  if (r.empties) flags.push(`${r.empties} empty text elements`);
  if (/\{[a-z]+\}/.test(r.text)) flags.push(`unfilled placeholder: ${r.text.match(/\{[a-z]+\}/)[0]}`);

  if (flags.length) issues.push(`${path}\n    ${flags.join("\n    ")}`);
}

process.exitCode = issues.length > 0 || duCount > 0 ? 1 : 0;
console.log(`formal address: Sie ×${sieCount}, du ×${duCount}${duCount ? "  ⚠ mixed forms" : "  ✓ consistent"}`);
console.log("\n" + (issues.length ? `German issues (${issues.length}):\n\n` + issues.join("\n") : `GERMAN CLEAN across ${routes.length - skipped.length} routes` +
    (skipped.length ? ` (${skipped.length} unpublished, skipped)` : "")));
await browser.close();
