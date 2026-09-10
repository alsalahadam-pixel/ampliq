import { chromium } from "playwright";
const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

const seen = new Set();
const queue = ["/en", "/de"];
const broken = [];
const stale = [];
const consoleErrors = [];

p.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});
p.on("pageerror", (e) => consoleErrors.push(String(e)));

const STALE_LINK = /\/work(\/|$)/;

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);

  const res = await p.goto(BASE + path, { waitUntil: "load" });
  if (!res || res.status() >= 400) {
    broken.push(`${path} → ${res?.status()}`);
    continue;
  }

  const { links, text, title } = await p.evaluate(() => ({
    links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")),
    text: document.body.innerText,
    title: document.title,
  }));

  for (const href of links) {
    if (!href) continue;
    if (STALE_LINK.test(href)) stale.push(`${path}: link → ${href}`);
    if (href.startsWith("/") && !href.startsWith("//")) {
      const clean = href.split("#")[0];
      if (clean && !seen.has(clean) && !queue.includes(clean)) queue.push(clean);
    }
  }

  for (const line of text.split("\n")) {
    if (/hello@ampliq|ampliq\.de|Small on purpose|We are early|The studio is new|IHMS/i.test(line)) {
      stale.push(`${path}: text → ${line.trim().slice(0, 70)}`);
    }
  }
  if (!title || title.length < 5) broken.push(`${path}: empty <title>`);
}

await b.close();

console.log(`crawled ${seen.size} routes`);
console.log(broken.length === 0 ? "ok   no broken routes" : `FAIL broken:\n  ${broken.join("\n  ")}`);
console.log(stale.length === 0 ? "ok   no stale references" : `FAIL stale:\n  ${[...new Set(stale)].join("\n  ")}`);
const realErrors = consoleErrors.filter((e) => !/503 \(Service Unavailable\)/.test(e));
console.log(realErrors.length === 0 ? "ok   no console errors" : `FAIL console:\n  ${[...new Set(realErrors)].slice(0,5).join("\n  ")}`);
process.exit(broken.length + stale.length + realErrors.length === 0 ? 0 : 1);
