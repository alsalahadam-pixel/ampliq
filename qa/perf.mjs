/**
 * What a cold visit actually costs, and whether anything moves while it loads.
 *
 * Sizes are the encoded bytes on the wire, taken from the browser's own
 * network accounting — not `content-length` (often absent) and not the decoded
 * body (which counts gzip as though it never happened, and roughly triples the
 * JavaScript figure).
 *
 * Advisory: it prints numbers to read rather than thresholds to pass, so it
 * never fails the suite.
 */

import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

const PAGES = [
  "/en",
  "/en/packages",
  "/en/about",
  "/en/insights/what-a-business-website-costs-in-germany",
  "/en/contact",
  "/en/start",
  "/en/start/call",
  "/en/legal/privacy",
  "/de",
];

const kb = (n) => `${Math.round(n / 1024)}K`.padStart(6);

console.log(
  "page".padEnd(48) +
    "  html      js     css    font   other    total   reqs      CLS      LCP",
);

for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");

  const seen = new Map();
  const wire = new Map();
  client.on("Network.responseReceived", (e) =>
    seen.set(e.requestId, { type: e.type, url: e.response.url }));
  client.on("Network.loadingFinished", (e) =>
    wire.set(e.requestId, e.encodedDataLength));

  await page.goto(BASE + path, { waitUntil: "networkidle" });

  // Layout shift and largest contentful paint, measured the way Chrome does.
  // The wait lets late shifts land — a font swapping in, a reveal settling.
  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let cls = 0;
        let lcp = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => resolve({ cls, lcp }), 1500);
      }),
  );

  const bytes = { document: 0, script: 0, stylesheet: 0, font: 0, other: 0 };
  for (const [id, length] of wire) {
    const entry = seen.get(id);
    if (!entry) continue;
    const kind = /\.woff2?($|\?)/.test(entry.url)
      ? "font"
      : entry.type === "Document"
        ? "document"
        : entry.type === "Script"
          ? "script"
          : entry.type === "Stylesheet"
            ? "stylesheet"
            : "other";
    bytes[kind] += length;
  }
  const total = Object.values(bytes).reduce((a, b) => a + b, 0);

  console.log(
    (path.length > 46 ? `${path.slice(0, 45)}…` : path).padEnd(48) +
      kb(bytes.document) +
      kb(bytes.script) +
      kb(bytes.stylesheet) +
      kb(bytes.font) +
      kb(bytes.other) +
      kb(total) +
      String(wire.size).padStart(7) +
      vitals.cls.toFixed(4).padStart(9) +
      `${Math.round(vitals.lcp)}ms`.padStart(9),
  );

  await page.close();
}

console.log(
  "\nFonts are three self-hosted variable faces, preloaded, and only load once —" +
    "\nthe figure repeats per page because each is measured as a cold visit.",
);

await browser.close();
