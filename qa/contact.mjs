import { chromium } from "playwright";
const BASE = process.env.QA_BASE ?? "http://localhost:3100";
const problems = [];
const log = (ok, label, extra = "") => {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${extra ? ` — ${extra}` : ""}`);
  if (!ok) problems.push(label);
};

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });

const msgs = [];
p.on("console", (m) => msgs.push({ type: m.type(), text: m.text() }));
p.on("pageerror", (e) => msgs.push({ type: "pageerror", text: String(e) }));

await p.goto(`${BASE}/en/contact`, { waitUntil: "networkidle" });

log(
  msgs.filter((m) => /hydrat|did not match/i.test(m.text)).length === 0,
  "no hydration warnings",
);

// Both addresses, labelled.
log((await p.locator("text=project@ampliq.net").count()) > 0, "project address shown");
log((await p.locator("text=help@ampliq.net").count()) > 0, "help address shown");

// Empty submit is caught client-side, before any request.
let posted = 0;
p.on("request", (r) => {
  if (r.url().endsWith("/api/contact")) posted += 1;
});
await p.locator('button[type="submit"]').click();
await p.waitForSelector('form [role="alert"]', { timeout: 5000 });
log(posted === 0, "empty submit never reaches the network", `${posted} requests`);

// Fill and submit for real.
await p.fill('input[name="firstName"]', "Jordan");
await p.fill('input[name="lastName"]', "Reyes");
await p.fill('input[name="email"]', "jordan@example.com");
await p.fill('input[name="company"]', "Northwind Components");
await p.selectOption('select[name="need"]', "redesign");
await p.selectOption('select[name="budget"]', "1199-2500");
await p.fill('textarea[name="message"]', "We rebuilt the product last year and the website still describes the old one.");

const [response] = await Promise.all([
  p.waitForResponse((r) => r.url().endsWith("/api/contact"), { timeout: 15000 }),
  p.locator('button[type="submit"]').click(),
]);

log(true, "form posts to the API", `status ${response.status()}`);

// No mail transport is configured here, so the honest state is the one to see.
await p.waitForSelector('[role="status"]', { timeout: 10000 });
const text = await p.locator('[role="status"]').innerText();
log(
  response.status() === 503,
  "unconfigured mail is reported as 503, not a fake success",
  `status ${response.status()}`,
);
log(
  /can't deliver mail yet|not transmitted/i.test(text),
  "the UI says plainly that nothing was sent",
  text.replace(/\s+/g, " ").slice(0, 90),
);
await p.screenshot({ path: ".qa/out/f-contact-state.png", fullPage: false });

// Budget options reflect the new pricing.
await p.goto(`${BASE}/en/contact`, { waitUntil: "load" });
const budgets = await p.locator('select[name="budget"] option').allInnerTexts();
log(!budgets.some((o) => o.includes("€500")), "no stale €500 budget band", budgets.join(" | "));
log(budgets.some((o) => o.includes("1,199")), "budget bands start at the GROW figure");

// The 503 is the expected unconfigured-mail response; the browser logs
// every failed fetch, so it is not a page error.
const errs = msgs.filter(
  (m) =>
    (m.type === "error" || m.type === "pageerror") &&
    !/503 \(Service Unavailable\)/.test(m.text),
);
log(errs.length === 0, "no console errors", errs.map((m) => m.text).join(" | ").slice(0, 120));

await b.close();
console.log(problems.length === 0 ? "\nCONTACT CLEAN" : `\n${problems.length} problem(s)`);
process.exit(problems.length === 0 ? 0 : 1);
