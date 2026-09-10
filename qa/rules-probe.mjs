/** Finds hairlines drawn twice: two rules of the same width, stacked close. */
import { chromium } from "playwright";
const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });

const PAGES = ["/en", "/en/services", "/en/services/web-design", "/en/packages", "/en/about",
  "/en/insights", "/en/insights/what-a-business-website-costs-in-germany",
  "/en/contact", "/en/start", "/en/start/call", "/en/legal", "/en/legal/imprint", "/de"];

const found = [];
for (const path of PAGES) {
  await p.goto(BASE + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(300);
  const hits = await p.evaluate(() => {
    const rules = [];
    for (const el of document.querySelectorAll("*")) {
      // A divided list draws a rule on every row on purpose.
      if (el.previousElementSibling && el.parentElement?.matches("ul, ol, dl")) continue;
      const s = getComputedStyle(el);
      const w = parseFloat(s.borderTopWidth);
      if (!w || s.borderTopStyle === "none") continue;
      const c = s.borderTopColor;
      if (/rgba\(0, 0, 0, 0\)|transparent/.test(c)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 80) continue;
      rules.push({
        x: Math.round(r.left), y: Math.round(r.top + window.scrollY),
        w: Math.round(r.width),
        tag: el.tagName + "." + String(el.className).slice(0, 30),
      });
    }
    const out = [];
    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        const a = rules[i], c = rules[j];
        if (Math.abs(a.x - c.x) > 4 || Math.abs(a.w - c.w) > 8) continue;
        const gap = Math.abs(a.y - c.y);
        if (gap > 0 && gap < 56) out.push(`${gap}px apart · ${a.tag} / ${c.tag}`);
      }
    }
    return [...new Set(out)];
  });
  for (const h of hits) found.push(`${path}  ${h}`);
}
console.log(found.length ? `Stacked rules (${found.length}):\n  ` + found.join("\n  ") : "No stacked rules");
process.exitCode = found.length ? 1 : 0;
await b.close();
