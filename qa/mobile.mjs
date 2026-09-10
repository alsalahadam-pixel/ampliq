import { chromium } from "playwright";

const base = process.env.QA_BASE ?? "http://localhost:3100";

// Every page, in both languages, at every width the brief names.
const paths = [
  "", "/services", "/packages", "/about", "/insights", "/contact",
  "/start", "/start/call",
  "/services/web-design", "/services/seo", "/services/social-media",
  "/insights/what-a-business-website-costs-in-germany",
  "/legal", "/legal/imprint", "/legal/privacy", "/legal/terms",
  "/legal/cancellation", "/legal/cookies",
].flatMap((p) => [`/en${p}`, `/de${p}`]);

const widths = [
  { w: 320, label: "320 (iPhone SE, smallest in use)" },
  { w: 375, label: "375 (iPhone SE 2/3, 13 mini)" },
  { w: 390, label: "390 (iPhone 12–15)" },
  { w: 430, label: "430 (iPhone Pro Max)" },
  { w: 768, label: "768 (tablet portrait)" },
  { w: 1024, label: "1024 (tablet landscape)" },
  { w: 1440, label: "1440 (desktop)" },
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const issues = [];
let checks = 0;

for (const { w, label } of widths) {
  const page = await browser.newPage({
    viewport: { width: w, height: w < 500 ? 844 : 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: w < 500 ? 3 : 1,
    isMobile: w < 500,
    hasTouch: w < 500,
  });
  await page.route("**", (r) =>
    r.request().url().startsWith("http://localhost") ? r.continue() : r.abort());

  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e.message).slice(0, 100)));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("404")) errs.push(m.text().slice(0, 100));
  });

  for (const path of paths) {
    errs.length = 0;
    await page.goto(base + path, { waitUntil: "load" });
    await page.waitForTimeout(200);
    checks++;

    const r = await page.evaluate((viewportWidth) => {
      const de = document.documentElement;
      const out = { overflow: 0, culprits: [], tiny: [], taps: [], gutter: null, h1: 0 };

      out.h1 = document.querySelectorAll("h1").length;

      if (de.scrollWidth > innerWidth + 1) {
        out.overflow = de.scrollWidth;
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.right > innerWidth + 1 && b.width > 0 && b.width < 4000) {
            out.culprits.push(
              `${el.tagName}.${String(el.className).slice(0, 46)} right=${Math.round(b.right)}`);
            if (out.culprits.length >= 3) break;
          }
        }
      }

      // Body copy that has become unreadable on a phone.
      const skip = /^(SCRIPT|STYLE|NOSCRIPT|SVG|PATH)$/;
      for (const el of document.querySelectorAll("p, li, dd, dt, label, a, span")) {
        if (skip.test(el.tagName)) continue;
        const text = (el.textContent ?? "").trim();
        if (text.length < 25) continue;
        // Only leaf-ish nodes, so a wrapper isn't blamed for its child.
        if (el.querySelector("p, li, ul, ol, div")) continue;
        const s = getComputedStyle(el);
        // Labels, indices, legend items and placeholder tokens are read as
        // markers rather than as text, and the design sets them at 11–12px on
        // purpose. What must stay readable is prose — anything that reads as a
        // sentence — so that is what this flags.
        if (s.textTransform === "uppercase") continue;
        const prose = /[.!?]\s*$/.test(text) || text.length > 60;
        if (!prose) continue;
        const size = parseFloat(s.fontSize);
        if (size < 13) out.tiny.push(`${size}px "${text.slice(0, 34)}"`);
        if (out.tiny.length >= 3) break;
      }

      // Touch targets. 44px is the platform guidance; 40 is the line where a
      // control genuinely starts being hard to hit.
      if (viewportWidth < 500) {
        const seen = new Set();
        for (const el of document.querySelectorAll(
          "a[href], button, input, select, textarea, [role='button'], [role='gridcell'] > *")) {
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) continue;
          const s = getComputedStyle(el);
          if (s.visibility === "hidden" || s.display === "none") continue;
          const cls = String(el.className);
          // Visually-hidden-until-focused controls (the skip link) measure 1×1
          // by design; links whose hit area is stretched over a card by an
          // inset ::after are as big as the card.
          if (/\bsr-only\b/.test(cls) || /after:inset-0/.test(cls)) continue;
          // The honeypot is parked off-screen behind aria-hidden: bots see it,
          // people and assistive tech never do.
          if (el.closest('[aria-hidden="true"]')) continue;
          // A checkbox wrapped in its own label: the label is what gets tapped.
          if (el.tagName === "INPUT" && el.parentElement?.tagName === "LABEL") continue;
          // A calendar day is one seventh of the shell: its width is the grid's,
          // and the cells are contiguous, so a narrow one is not a small target.
          if (el.closest('[role="gridcell"]')) continue;
          // Inline links inside a paragraph are exempt: they are read, not tapped
          // as controls, and padding them out would wreck the text block.
          const inline = s.display.startsWith("inline") && el.closest("p, li, dd");
          if (inline) continue;
          const h = Math.round(b.height);
          const wd = Math.round(b.width);

          // Two rules, because the guidelines are two rules.
          //
          // A control — a button, a field, anything with a button role — is
          // what Apple's and Google's 44px minimum is about: a discrete thing
          // people aim a thumb at. Judged on both axes.
          //
          // A link is governed by WCAG 2.2's 24px minimum instead. Its width
          // is the width of its word ("Fonts" is a narrow target because it is
          // a short word) and its height is its line box, so only height is
          // judged. Classification is by role, not by computed display: a link
          // inside a flex container is blockified to `flex` and would
          // otherwise be mistaken for a button.
          const control =
            el.tagName !== "A" || el.getAttribute("role") === "button";

          const failed = control ? h < 44 || wd < 44 : h < 24;
          if (failed) {
            const key = `${el.tagName}.${String(el.className).slice(0, 34)}`;
            if (seen.has(key)) continue;
            seen.add(key);
            out.taps.push(`${key} ${wd}×${h}`);
            if (out.taps.length >= 4) break;
          }
        }
      }

      // The side gutter: content must never touch the screen edge.
      const shell = document.querySelector(".shell");
      if (shell) {
        const b = shell.getBoundingClientRect();
        const pad = parseFloat(getComputedStyle(shell).paddingLeft);
        out.gutter = Math.round(b.left + pad);
      }

      return out;
    }, w);

    const flags = [];
    if (r.overflow) flags.push(`OVERFLOW ${r.overflow}px :: ${r.culprits.join(" | ")}`);
    if (r.h1 !== 1) flags.push(`H1×${r.h1}`);
    if (r.tiny.length) flags.push(`TINY TEXT ${r.tiny.join(" | ")}`);
    if (r.taps.length) flags.push(`TAP ${r.taps.join(" | ")}`);
    if (r.gutter !== null && r.gutter < 16) flags.push(`GUTTER ${r.gutter}px`);
    if (errs.length) flags.push(`ERR ${errs[0]}`);
    if (flags.length) issues.push(`${String(w).padStart(4)}px ${path}\n        ${flags.join("\n        ")}`);
  }
  await page.close();
  process.stdout.write(`${label} done\n`);
}

await browser.close();
process.exitCode = issues.length > 0 ? 1 : 0;
console.log("\n" + (issues.length
  ? `${issues.length} of ${checks} page/width combinations flagged:\n\n` + issues.join("\n")
  : `CLEAN across ${widths.length} widths × ${paths.length} pages (${checks} checks)`));
