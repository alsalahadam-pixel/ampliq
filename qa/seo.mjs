import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const routes = [
  "/en", "/de", "/en/services", "/de/services", "/en/packages", "/de/packages",
  "/en/about", "/de/about", "/en/insights", "/de/insights",
  "/en/contact", "/de/contact", "/en/start", "/de/start",
  "/en/start/call", "/de/start/call",
  "/en/services/web-design", "/de/services/web-design",
  "/en/insights/what-a-business-website-costs-in-germany",
  "/en/legal/imprint", "/de/legal/imprint", "/en/legal/privacy",
];

const issues = [];
for (const path of routes) {
  await page.goto(BASE + path, { waitUntil: "load" });
  const r = await page.evaluate(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
    const link = (sel) => document.querySelector(sel)?.getAttribute("href") ?? null;
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: link('link[rel="canonical"]'),
      hreflang: [...document.querySelectorAll('link[rel="alternate"]')]
        .map((l) => `${l.hreflang}=${l.getAttribute("href")}`),
      robots: meta('meta[name="robots"]'),
      ogTitle: meta('meta[property="og:title"]'),
      ogImage: meta('meta[property="og:image"]'),
      ogLocale: meta('meta[property="og:locale"]'),
      lang: document.documentElement.lang,
      h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
      jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')]
        .flatMap((s) => { try { const d = JSON.parse(s.textContent); return (Array.isArray(d) ? d : [d]).map((x) => x["@type"]); } catch { return ["PARSE-ERROR"]; } }),
      viewport: meta('meta[name="viewport"]'),
    };
  });

  const flags = [];
  const expectedLang = path.startsWith("/de") ? "de-DE" : "en";
  const legal = path.includes("/legal");


  if (!r.title) flags.push("no title");
  else if (r.title.length > 65) flags.push(`title ${r.title.length} chars: "${r.title}"`);
  if (!r.description) flags.push("no description");
  else if (r.description.length > 165) flags.push(`description ${r.description.length} chars`);
  else if (!legal && r.description.length < 60) flags.push(`description only ${r.description.length} chars`);
  if (!r.canonical) flags.push("no canonical");
  else if (!r.canonical.endsWith(path)) flags.push(`canonical mismatch: ${r.canonical}`);
  if (r.hreflang.length < 3) flags.push(`hreflang: ${r.hreflang.join(" ")}`);
  if (r.lang !== expectedLang) flags.push(`html lang=${r.lang}`);
  if (r.h1.length !== 1) flags.push(`h1 ×${r.h1.length}`);
  if (!r.ogImage) flags.push("no og:image");
  if (!r.ogLocale) flags.push("no og:locale");
  if (!r.viewport) flags.push("no viewport meta");
  if (r.jsonLd.includes("PARSE-ERROR")) flags.push("invalid JSON-LD");
  if (legal && !/noindex/.test(r.robots ?? "")) flags.push(`legal page not noindex (robots=${r.robots})`);
  if (!legal && /noindex/.test(r.robots ?? "")) flags.push("noindex on an indexable page");

  if (flags.length) issues.push(`${path}\n    ${flags.join("\n    ")}`);
}

// robots.txt and sitemap.
const robots = await (await fetch(`${BASE}/robots.txt`)).text();
const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

console.log("robots.txt:\n" + robots.trim().split("\n").map((l) => "  " + l).join("\n"));
console.log(`\nsitemap: ${urls.length} URLs`);
const legalInSitemap = urls.filter((u) => u.includes("/legal"));
if (legalInSitemap.length) console.log(`  ⚠ noindex legal pages listed in sitemap: ${legalInSitemap.length}`);
for (const want of ["/en/start", "/en/start/call", "/de/start/call", "/en/contact"]) {
  if (!urls.some((u) => u.endsWith(want))) console.log(`  ⚠ missing from sitemap: ${want}`);
}

process.exitCode = issues.length > 0 || legalInSitemap.length > 0 ? 1 : 0;
console.log("\n" + (issues.length ? `SEO issues (${issues.length}):\n\n` + issues.join("\n") : `SEO CLEAN across ${routes.length} routes`));
await browser.close();
