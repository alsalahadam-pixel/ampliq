/**
 * The launch check.
 *
 * `npm run launch-check` prints everything the site is still waiting for,
 * grouped by whether it blocks launch. It reads the same registries the pages
 * read — `legalFields`, `mediaSlots`, `site.ts` — rather than a list kept in
 * parallel, so it cannot fall out of date with what the site actually renders.
 *
 * Exits non-zero while anything required is outstanding, so it can gate a
 * deploy. Run it with the production environment loaded to check what will
 * actually ship:
 *
 *   npm run launch-check                 # this machine's environment
 *   node --env-file=.env.production ...  # a specific one
 */

import { mediaSlots } from "../src/content/media.ts";
import { legalFields } from "../src/lib/legal.ts";
import {
  activeSocials,
  analyticsEnabled,
  contact,
  domainIsConfigured,
  site,
  siteDomain,
  siteUrl,
} from "../src/lib/site.ts";

type Item = {
  /** Short name, shown in the list. */
  what: string;
  /** Where the value comes from. */
  where: string;
  /** True when it is already supplied. */
  done: boolean;
  /** What the site does in the meantime. */
  meanwhile?: string;
};

type Group = { title: string; blocking: boolean; items: Item[] };

const env = process.env;
const has = (name: string) => Boolean(env[name]?.trim());

const groups: Group[] = [
  {
    title: "Domain",
    blocking: true,
    items: [
      {
        what: "The final domain",
        where: "NEXT_PUBLIC_SITE_DOMAIN",
        done: domainIsConfigured,
        meanwhile: `every URL and address is derived from the "${siteDomain}" default — one edit moves all of them`,
      },
    ],
  },
  {
    title: "Legal entity",
    blocking: true,
    items: Object.values(legalFields)
      .filter((field) => field.required)
      .map((field) => ({
        what: field.token,
        where: "NEXT_PUBLIC_LEGAL_*",
        done: field.value !== null,
        meanwhile:
          "the row or sentence that needs it is left out of the published documents — nothing on the page says it is missing",
      })),
  },
  {
    title: "Legal entity — only where the legal form or the deployment has them",
    blocking: false,
    items: Object.values(legalFields)
      .filter((field) => !field.required)
      .map((field) => ({
        what: field.token,
        where: "NEXT_PUBLIC_LEGAL_*",
        done: field.value !== null,
        meanwhile: "absent from the documents rather than shown as a gap",
      })),
  },
  {
    title: "Delivery",
    blocking: true,
    items: [
      {
        what: "Email transport",
        where: "RESEND_API_KEY or MAIL_ENDPOINT",
        done: has("RESEND_API_KEY") || has("MAIL_ENDPOINT") || has("BOOKING_EMAIL_ENDPOINT"),
        meanwhile:
          "the enquiry form answers 503 and says nothing was sent; a booking is recorded but no email reaches anyone, including you",
      },
      {
        what: "Verified sending address",
        where: "MAIL_FROM_EMAIL",
        done: has("MAIL_FROM_EMAIL") || has("BOOKING_FROM_EMAIL"),
        meanwhile: `falls back to ${contact.info}, which the provider must have verified`,
      },
    ],
  },
  {
    title: "Booking",
    blocking: false,
    items: [
      {
        what: "Calendar connection",
        where: "GOOGLE_CALENDAR_* or MICROSOFT_*",
        done:
          has("GOOGLE_CALENDAR_CLIENT_EMAIL") || has("MICROSOFT_CLIENT_ID"),
        meanwhile:
          "availability is labelled provisional on the page — published hours minus bookings made here, and the page says so",
      },
      {
        what: "Working hours confirmed as the real ones",
        where: "BOOKING_WORKING_HOURS",
        done: has("BOOKING_WORKING_HOURS"),
        meanwhile: "the default schedule is a reasonable one, not yours",
      },
      {
        what: "Meeting link",
        where: "BOOKING_MEETING_LINK",
        done: has("BOOKING_MEETING_LINK"),
        meanwhile: "the confirmation says the details follow by reply",
      },
    ],
  },
  {
    title: "Photography",
    blocking: false,
    items: Object.entries(mediaSlots).map(([name, slot]) => ({
      what: `${name} (${slot.ratio}) — ${slot.note.split(".")[0]}`,
      where: "src/content/media.ts → src",
      done: slot.src !== null,
      meanwhile: "the slot holds the DISC panel; the box is already the right size",
    })),
  },
  {
    title: "Optional",
    blocking: false,
    items: [
      {
        what: "Social profiles",
        where: "NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_LINKEDIN_URL",
        done: activeSocials.length > 0,
        meanwhile: "no social links are shown at all — none are invented",
      },
      {
        what: "Phone number",
        where: "NEXT_PUBLIC_CONTACT_PHONE",
        done: site.phone !== null,
        meanwhile: "no number is published",
      },
      {
        what: "Analytics — needs a consent banner first",
        where: "NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_GA4_ID, …",
        done: analyticsEnabled,
        meanwhile:
          "nothing loads and no tracking cookie is set; the privacy policy says so truthfully, and stops being true the moment a tag is added",
      },
    ],
  },
];

const DIM = "\u001b[2m";
const BOLD = "\u001b[1m";
const RESET = "\u001b[0m";

let blockers = 0;
let pending = 0;

console.log(`\n${BOLD}AMPLIQ — launch check${RESET}`);
console.log(`${DIM}${siteUrl}${RESET}\n`);

for (const group of groups) {
  const outstanding = group.items.filter((item) => !item.done);
  const mark = outstanding.length === 0 ? "✓" : group.blocking ? "!" : "·";
  console.log(
    `${mark} ${BOLD}${group.title}${RESET} ${DIM}(${group.items.length - outstanding.length}/${group.items.length})${RESET}`,
  );

  for (const item of outstanding) {
    if (group.blocking) blockers++;
    else pending++;
    console.log(`    ${item.what}`);
    console.log(`      ${DIM}set: ${item.where}${RESET}`);
    if (item.meanwhile) console.log(`      ${DIM}until then: ${item.meanwhile}${RESET}`);
  }
  console.log();
}

console.log(
  blockers === 0
    ? `${BOLD}Nothing is blocking launch.${RESET} ${pending} optional item${pending === 1 ? "" : "s"} outstanding.`
    : `${BOLD}${blockers} item${blockers === 1 ? "" : "s"} must be supplied before launch${RESET}, plus ${pending} optional.`,
);
console.log(
  `${DIM}The legal pages are public and say only what is known; the wording still${RESET}`,
);
console.log(`${DIM}wants a qualified lawyer before you rely on it — see PLACEHOLDERS.md.${RESET}\n`);

process.exit(blockers === 0 ? 0 : 1);
