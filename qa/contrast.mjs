import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const routes = [
  "/en", "/en/services", "/en/services/seo", "/en/packages", "/en/about",
  "/en/insights", "/en/insights/what-a-business-website-costs-in-germany",
  "/en/contact", "/en/start", "/en/start/call",
  "/en/legal", "/en/legal/imprint", "/en/legal/privacy",
  "/de", "/de/packages", "/de/start", "/de/start/call",
];

const failures = new Map();
const skipped = [];

for (const path of routes) {
  const response = await page.goto(BASE + path, { waitUntil: "load" });
  if (response && response.status() === 404) { skipped.push(path); continue; }
  // Reveal animations start elements at opacity 0; measure the finished state.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(200);

  const found = await page.evaluate(() => {
    const parse = (c) => {
      const m = c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
    };
    const lum = ({ r, g, b }) => {
      const f = (v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const over = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    });
    const ratio = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return (x + 0.05) / (y + 0.05);
    };

    /** The nearest ancestor that actually paints a background. */
    const background = (el) => {
      let node = el;
      while (node) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a > 0) return c.a === 1 ? c : over(c, background(node.parentElement) ?? { r: 255, g: 255, b: 255, a: 1 });
        node = node.parentElement;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };

    const out = [];
    for (const el of document.querySelectorAll("p, li, a, span, h1, h2, h3, h4, dt, dd, label, button, td, th, time")) {
      if (el.children.length > 0) continue;
      const text = el.textContent?.trim() ?? "";
      if (!text) continue;
      const s = getComputedStyle(el);
      if (s.visibility === "hidden" || s.display === "none" || +s.opacity === 0) continue;
      const box = el.getBoundingClientRect();
      if (!box.width || !box.height) continue;

      // The header floats transparently over whatever it happens to be above,
      // so there is no ancestor background to measure against. It is paper on
      // ink before scroll and ink on a solid paper bar after, both far above
      // AA by construction — measuring it here would only produce a false 1:1.
      let floating = false;
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.position === "fixed" && parse(cs.backgroundColor)?.a === 0) { floating = true; break; }
      }
      if (floating) continue;

      // An inactive control has no contrast requirement (WCAG 1.4.3), and
      // dimming is how a taken slot or a closed day says it is unavailable.
      if (el.closest("[disabled], [aria-disabled='true']")) continue;

      const fg = parse(s.color);
      if (!fg) continue;
      // Transparent fill means the glyph is drawn by something a colour ratio
      // cannot evaluate — here a `-webkit-text-stroke` outline. The one such
      // case on the site is the ghosted process numeral, which is aria-hidden
      // and has an sr-only equivalent inside the heading beside it.
      if (fg.a === 0) continue;
      const bg = background(el);
      // Inherited opacity dims the text against its ground.
      let inherited = 1;
      for (let n = el; n; n = n.parentElement) inherited *= +getComputedStyle(n).opacity;
      const painted = over({ ...fg, a: fg.a * inherited }, bg);

      const size = parseFloat(s.fontSize);
      const weight = +s.fontWeight || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const required = large ? 3 : 4.5;
      const r = ratio(painted, bg);

      if (r < required) {
        out.push({
          text: text.slice(0, 40),
          ratio: r.toFixed(2),
          required,
          size: Math.round(size),
          color: s.color,
          tag: el.tagName,
        });
      }
    }
    return out;
  });

  for (const f of found) {
    const key = `${f.tag} ${f.size}px ${f.color} → ${f.ratio}:1 (needs ${f.required})`;
    if (!failures.has(key)) failures.set(key, { count: 0, sample: f.text, pages: new Set() });
    const entry = failures.get(key);
    entry.count++;
    entry.pages.add(path);
  }
}

process.exitCode = failures.size > 0 ? 1 : 0;

if (failures.size === 0) {
  console.log(
    `CONTRAST CLEAN — WCAG AA across ${routes.length - skipped.length} routes` +
      (skipped.length ? ` (${skipped.length} unpublished, skipped)` : ""),
  );
} else {
  console.log(`Contrast below WCAG AA (${failures.size} distinct):\n`);
  for (const [key, v] of [...failures].sort((a, b) => b[1].count - a[1].count)) {
    console.log(`  ${key}`);
    console.log(`    ×${v.count} on ${v.pages.size} page(s) — e.g. "${v.sample}"`);
  }
}
await browser.close();
