import { chromium } from "playwright";

const BASE = process.env.QA_BASE ?? "http://localhost:3000";
const problems = [];

function log(ok, label, extra = "") {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${extra ? ` — ${extra}` : ""}`);
  if (!ok) problems.push(label);
}

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});

// A timezone deliberately far from Europe/Berlin, so any place the two clocks
// get confused shows up rather than coinciding.
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  locale: "en-GB",
  timezoneId: "America/New_York",
});

const messages = [];
const page = await context.newPage();
page.on("console", (m) => messages.push({ type: m.type(), text: m.text() }));
page.on("pageerror", (e) => messages.push({ type: "pageerror", text: String(e) }));

await page.goto(`${BASE}/en/start/call`, { waitUntil: "networkidle" });

// --- hydration -------------------------------------------------------------
const hydration = messages.filter((m) =>
  /hydrat|did not match|server rendered|Text content does not match/i.test(m.text),
);
log(hydration.length === 0, "no hydration warnings", hydration.map((m) => m.text).join(" | "));

const errors = messages.filter(
  (m) => m.type === "error" || m.type === "pageerror",
);
log(errors.length === 0, "no console errors", errors.map((m) => m.text).join(" | "));

// --- step 1: the calendar renders -----------------------------------------
await page.waitForSelector('[role="grid"]', { timeout: 10000 });
const monthLabel = await page.locator('[role="grid"]').getAttribute("aria-labelledby");
log(Boolean(monthLabel), "grid is labelled by the month heading");

const notice = await page.locator("text=/Availability is provisional/i").count();
log(notice === 1, "provisional availability is stated (no calendar connected)");

const available = page.locator('[role="gridcell"] button[aria-disabled="false"]');
const availableCount = await available.count();
log(availableCount > 0, "calendar offers bookable days", `${availableCount} days`);

const closed = await page
  .locator('[role="gridcell"] button[aria-disabled="true"]')
  .count();
log(closed > 0, "calendar marks unavailable days", `${closed} days`);

// Weekends must be closed: the configured working hours have no Sat/Sun.
const satLabels = await page
  .locator('[role="row"] [role="gridcell"]:nth-child(6) button')
  .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("aria-label")));
const satBookable = satLabels.filter((l) => l && /available/i.test(l));
log(satBookable.length === 0, "Saturdays are never bookable", satBookable.join(", "));

await page.screenshot({ path: ".qa/out/booking-1-date.png", fullPage: false });

// --- keyboard: roving tabindex --------------------------------------------
const roving = await page
  .locator('[role="grid"] button[tabindex="0"]')
  .count();
log(roving === 1, "exactly one date is in the tab order", `found ${roving}`);

await page.locator('[role="grid"] button[tabindex="0"]').focus();
const before = await page.evaluate(() =>
  document.activeElement?.getAttribute("aria-label"),
);
await page.keyboard.press("ArrowRight");
const after = await page.evaluate(() =>
  document.activeElement?.getAttribute("aria-label"),
);
log(before !== after, "ArrowRight moves focus by one day", `${before} → ${after}`);

await page.keyboard.press("ArrowDown");
const afterWeek = await page.evaluate(() =>
  document.activeElement?.getAttribute("aria-label"),
);
log(afterWeek !== after, "ArrowDown moves focus by one week");

// --- step 2: pick a day ----------------------------------------------------
await available.first().click();
await page.waitForSelector("text=/Choose a time|Change date/i", { timeout: 10000 });

// Slot buttons are the only ones carrying aria-pressed.
const slotButtons = page.locator("button[aria-pressed]");
await page.waitForFunction(
  () => document.querySelectorAll("button[aria-pressed]").length > 0,
  { timeout: 10000 },
);
const slotCount = await slotButtons.count();
log(slotCount > 0, "slots are listed for the chosen day", `${slotCount} slots`);

// The visitor is in New York; the business is in Berlin. Both clocks shown.
const dualClock = await page.locator("text=/our time|GMT/i").count();
log(dualClock > 0, "the agency's clock is shown alongside the visitor's");

const shownIn = await page.locator("text=/Times shown in your timezone/i").count();
log(shownIn === 1, "the visitor's timezone is named");

await page.screenshot({ path: ".qa/out/booking-2-time.png", fullPage: false });

// --- step 3: details -------------------------------------------------------
const spokenName = await page
  .locator('button[aria-pressed="false"]:not([disabled])')
  .first()
  .getAttribute("aria-label");
log(
  /^\d{2}:\d{2}, \d+ minutes/.test(spokenName ?? ""),
  "slot has a readable accessible name",
  spokenName ?? "",
);

await page.locator('button[aria-pressed="false"]:not([disabled])').first().click();
await page.waitForSelector("text=Your details", { timeout: 10000 });

// Empty submit must be caught before any request goes out.
await page.locator('button[type="submit"]').click();
await page.waitForSelector('[role="alert"]', { timeout: 5000 });
const summaryFocused = await page.evaluate(
  () => document.activeElement?.getAttribute("role") === "alert",
);
log(summaryFocused, "invalid submit moves focus to the error summary");

const listedErrors = await page.locator('[role="alert"] li').count();
log(listedErrors >= 3, "every missing field is listed", `${listedErrors} errors`);

await page.fill('input[name="name"]', "Jordan Reyes");
await page.fill('input[name="email"]', "jordan@example.com");
await page.fill('input[name="company"]', "Northwind Components");
await page.fill(
  'textarea[name="message"]',
  "We rebuilt the product last year and the website still describes the old one. Looking for a redesign plus the content to go with it.",
);
await page.screenshot({ path: ".qa/out/booking-3-details.png", fullPage: false });

// --- step 4: confirm -------------------------------------------------------
const postStatus = [];
page.on("response", (r) => {
  if (r.url().endsWith("/api/booking")) postStatus.push(r.status());
});

await page.locator('button[type="submit"]').click();
try {
  await page.waitForSelector("text=/Your call is confirmed/i", { timeout: 15000 });
  log(true, "booking confirms", `POST ${postStatus.join(",")}`);
} catch {
  await page.screenshot({ path: ".qa/out/booking-FAIL.png", fullPage: true });
  log(
    false,
    "booking confirms",
    `POST ${postStatus.join(",") || "none"} — page says: ${(
      await page.locator("main").innerText()
    )
      .replace(/\s+/g, " ")
      .slice(0, 300)}`,
  );
  await browser.close();
  process.exit(1);
}

const notSent = await page
  .locator("text=/No confirmation email was sent/i")
  .count();
log(notSent === 1, "says plainly that no confirmation email went out");

const icsButton = await page.locator("text=Add to calendar").count();
log(icsButton === 1, "offers an .ics download");

await page.screenshot({ path: ".qa/out/booking-4-done.png", fullPage: false });

// --- double booking --------------------------------------------------------
// The same slot must now be gone for the next visitor.
const secondPage = await context.newPage();
await secondPage.goto(`${BASE}/en/start/call`, { waitUntil: "networkidle" });
await secondPage.waitForSelector('[role="grid"]');
await secondPage
  .locator('[role="gridcell"] button[aria-disabled="false"]')
  .first()
  .click();
await secondPage.waitForFunction(
  () => document.querySelectorAll("button[aria-pressed]").length > 0,
  { timeout: 10000 },
);
const takenCount = await secondPage.locator("text=Taken").count();
log(takenCount >= 1, "the booked slot is now marked taken", `${takenCount} taken`);

const stillFree = await secondPage
  .locator('button[aria-pressed]:not([disabled])')
  .count();
log(stillFree > 0, "other slots that day are still bookable", `${stillFree} free`);
await secondPage.screenshot({ path: ".qa/out/booking-5-taken.png" });
await secondPage.close();

// --- German ---------------------------------------------------------------
const dePage = await context.newPage();
const deMessages = [];
dePage.on("console", (m) => deMessages.push({ type: m.type(), text: m.text() }));
dePage.on("pageerror", (e) => deMessages.push({ type: "pageerror", text: String(e) }));
await dePage.goto(`${BASE}/de/start/call`, { waitUntil: "networkidle" });
await dePage.waitForSelector('[role="grid"]');

const deHydration = deMessages.filter((m) =>
  /hydrat|did not match|server rendered/i.test(m.text),
);
log(deHydration.length === 0, "German page: no hydration warnings");

const deHeading = await dePage.locator("h1").first().textContent();
log(/Gespräch buchen/i.test(deHeading ?? ""), "German page is in German", deHeading ?? "");

const deWeekday = await dePage.locator("text=Mo").first().count();
log(deWeekday > 0, "German weekday labels render");
await dePage.screenshot({ path: ".qa/out/booking-6-de.png" });
await dePage.close();

// --- API surface -----------------------------------------------------------
const availabilityRes = await page.request.get(
  `${BASE}/api/booking/availability?date=2099-01-05`,
);
const availabilityBody = await availabilityRes.json();
log(
  availabilityRes.ok() && Array.isArray(availabilityBody.days),
  "availability endpoint responds",
);
log(
  JSON.stringify(availabilityBody).length > 0 &&
    !/summary|subject|attendee|location|organizer/i.test(
      JSON.stringify(availabilityBody),
    ),
  "availability response leaks no event details",
);
const allowedDayKeys = ["availableCount", "blockedBy", "date", "totalCount"];
log(
  availabilityBody.days.every((d) =>
    Object.keys(d).every((k) => allowedDayKeys.includes(k)),
  ),
  "day summaries carry counts only",
);

const badPost = await page.request.post(`${BASE}/api/booking`, {
  data: { start: "nope", name: "", email: "bad", message: "" },
});
log(badPost.status() === 400, "invalid booking is rejected", `status ${badPost.status()}`);

const pastPost = await page.request.post(`${BASE}/api/booking`, {
  data: {
    start: "2020-01-06T09:00:00.000Z",
    name: "Test Person",
    email: "test@example.com",
    company: "",
    message: "A message that is long enough to pass validation.",
    timeZone: "Europe/Berlin",
    locale: "en",
  },
});
log(
  pastPost.status() === 409,
  "a slot in the past is refused",
  `status ${pastPost.status()}`,
);

await browser.close();

console.log(
  problems.length === 0
    ? "\nBOOKING QA CLEAN"
    : `\n${problems.length} PROBLEM(S):\n- ${problems.join("\n- ")}`,
);
process.exit(problems.length === 0 ? 0 : 1);
