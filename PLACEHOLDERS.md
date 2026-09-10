# Before this site goes live

Everything on the site is real except the items listed here. Nothing has been
invented to fill a gap: where a fact was unavailable, the page leaves it out.
No visitor is shown a placeholder, and no page discusses what is missing.

## The one command

```bash
npm run launch-check
```

It prints everything still outstanding, grouped by whether it blocks launch, and
exits non-zero while anything required is missing — so it can gate a deploy. It
reads the same registries the pages read (`src/lib/legal.ts`,
`src/content/media.ts`, `src/lib/site.ts`) rather than a list kept in parallel,
so it cannot drift from what the site actually renders. This document explains
each item; the command tells you which ones are still open right now.

## The legal section

**It is public.** All five documents — Impressum, privacy policy, AGB,
Widerrufsbelehrung, cookie policy — are reachable in both languages and linked
from the footer. They are `noindex`, because they are required disclosures
rather than pages anyone should find through search, and `robots.txt` keeps
crawlers off them for the same reason.

They render with none of the entity variables set. Every row, sentence, list
item and chapter that depends on a value AMPLIQ does not have is left out of
the page — see `withoutUnresolved` in `src/components/legal/legal-document.tsx`
— so what a visitor reads is a shorter document, not a form with blanks in it.

**Nothing on the site says a value is missing.** No notice, no placeholder, no
red, no sentence about what is still being confirmed or is required before
launch. A legal document states what is known about its subject; it is not a
progress report on itself. Two checks enforce that:

- `qa/legal-visibility.mjs` — every legal route answers 200, carries no draft
  wording or bracketed token, has no heading standing over an empty section,
  and is linked from the footer in both languages.
- `qa/build-output.mjs` — no client bundle carries the entity registry, and no
  prerendered page anywhere carries the wording. A page can render nothing and
  still ship the words, so this reads `.next` rather than the rendered page.

Supplying a value makes its row or sentence appear. Nothing else changes.

```bash
# The Impressum and privacy controller block:
NEXT_PUBLIC_LEGAL_COMPANY="..."          # until set, the pages use "AMPLIQ"
NEXT_PUBLIC_LEGAL_FORM="..."
NEXT_PUBLIC_LEGAL_REPRESENTATIVE="..."   # unlocks "Responsible for content"
NEXT_PUBLIC_LEGAL_STREET="..."
NEXT_PUBLIC_LEGAL_POSTAL_CODE="..."      # these three travel together
NEXT_PUBLIC_LEGAL_CITY="..."

# Only where they exist. Leave them out and the pages never mention them:
NEXT_PUBLIC_LEGAL_VAT_ID="..."
NEXT_PUBLIC_LEGAL_TAX_NUMBER="..."
NEXT_PUBLIC_LEGAL_REGISTER_COURT="..."   # both add a "Register entry" chapter
NEXT_PUBLIC_LEGAL_REGISTER_NUMBER="..."
NEXT_PUBLIC_LEGAL_AUTHORITY="..."

# The processors the privacy policy names, once you know which they are:
NEXT_PUBLIC_LEGAL_HOST="..."
NEXT_PUBLIC_LEGAL_EMAIL_PROCESSOR="..."
NEXT_PUBLIC_LEGAL_CALENDAR_PROCESSOR="..."

# And the one switch that takes the whole section down again:
NEXT_PUBLIC_LEGAL_PUBLISHED="false"
```

Reading well is not the same as being legally sufficient. An Impressum without
a business address does not satisfy § 5 DDG, and a withdrawal notice without a
postal address does not satisfy § 355 BGB, however finished the page looks.
`npm run launch-check` is what tracks that; the page is not.

**The wording still wants a lawyer.** The structure follows German law and the
technical statements describe what this build actually does — the cookie is
real, the absence of analytics is real, the free/busy calendar read is real —
but none of it has been reviewed by anyone qualified.

## The domain

**Set it in one place.** Every URL and every published address on the site is
derived from a single constant:

```bash
NEXT_PUBLIC_SITE_DOMAIN="yourdomain.com"
```

That one line moves the canonical URLs, the hreflang pairs, the sitemap, the
Open Graph tags, `info@`, `project@` and `help@`, and the email sender. Nothing
else needs editing.

`ampliq.net` is the working default — it is there so the build has something
valid to render, not because the domain has been chosen. Individual mailboxes
can still be overridden (`NEXT_PUBLIC_CONTACT_INFO_EMAIL` and friends) if one of
them lives somewhere else, but the normal case is the single line above.

## Must be supplied

| What | Where | Notes |
| --- | --- | --- |
| The final domain | `.env.local` → `NEXT_PUBLIC_SITE_DOMAIN` | See above. Until it is set, everything runs on the `ampliq.net` default. |
| Legal entity: name, form, address, responsible person | `.env.local` → `NEXT_PUBLIC_LEGAL_*` | The pages are public and read as finished without these. Any row, sentence or list item that depends on an unsupplied value is left out, and a chapter left with nothing to say goes with it — no placeholder, no gap marker, no "coming soon", and nothing invented. But an Impressum without a business address is not legally sufficient however well it reads, which is why this is a blocker. Enter only what is true: leave the GmbH, UG, Handelsregister and VAT lines out if there is no such entry, and the pages will never mention them. |
| VAT ID, tax number, register details | `.env.local` → `..._VAT_ID`, `..._TAX_NUMBER`, `..._REGISTER_*` | Only where they genuinely apply to the legal form. Absent from the documents until then — the register chapter does not exist unless both register lines are set. |
| Legal review of all five documents | `/legal/*` | The structure follows German law and the technical descriptions match this build; the wording still needs a qualified lawyer. The pages do not say so on themselves — a document that discusses its own readiness is worse than one that simply waits — so this list is the only place it is recorded. |
| Publishing the legal pages | already done | All five documents are **public** in both languages and linked from the footer. `NEXT_PUBLIC_LEGAL_PUBLISHED="false"` is the only thing that takes them down again. |
| Email delivery | `.env.local` → `RESEND_API_KEY` or `MAIL_ENDPOINT` | One transport serves both the enquiry form and the booking confirmations. Until it is set, the form answers `503` and says plainly that nothing was sent, and a booking is recorded but **no email reaches anyone — including you**. Neither pretends to deliver. See `docs/booking.md`. |
| The three processors, and the Art. 28 agreements with them | `.env.local` → `NEXT_PUBLIC_LEGAL_HOST`, `..._EMAIL_PROCESSOR`, `..._CALENDAR_PROCESSOR` | Each adds one sentence to its chapter of the privacy policy and is absent until then, so the policy never names a provider this deployment does not use. The agreements themselves are paperwork, not configuration. |
| Booking persistence | `src/lib/booking/store.ts` | The default store keeps bookings in the Node process: a restart forgets them, and two instances do not share a list. Connecting a calendar with write access is usually enough, since the calendar then becomes the source of truth. |

## Should be supplied

| What | Where | Notes |
| --- | --- | --- |
| Photography | `src/content/media.ts` → each slot's `src` | Every intended photograph is registered there with the box it will occupy and the alt text it will carry, and the sections are already built around those boxes. Adding a picture is putting the file in `public/media/` and filling in `src` — no section is re-laid out, and nothing shifts while it loads because the aspect ratio is declared up front. Until then the slot holds the DISC panel, which reads as a brand graphic rather than a missing image. **Correct the alt text to describe the actual photograph** when you add one. |
| Social profiles | `.env.local` → `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_LINKEDIN_URL` | Links are hidden entirely while unset. |
| Calendar connection for `/start` | `.env.local` → Google or Microsoft credentials | Until set, the booking calendar shows the published working hours and states, on the page, that no calendar was consulted. Confirm the working hours in `BOOKING_WORKING_HOURS` are the real ones — the defaults are a reasonable schedule, not your schedule. Only busy times are ever read; no event details. See `docs/booking.md`. |
| Analytics | `.env.local` → `NEXT_PUBLIC_GTM_ID` etc. | No script loads and no tracking cookie is set while unset. **Add a consent banner before enabling any of these** — the privacy policy currently states truthfully that the site sets no tracking cookies, and that statement stops being true the moment a tag is added. |

## Deliberately absent

These are not oversights. The brief was explicit that nothing may be fabricated,
and the design is built to work without them:

- **A portfolio** — removed entirely rather than filled with invented case
  studies. The site is built to stand without one: the system section, the
  services index and the packages carry the proof instead.
- **Client logos** — there is no logo wall. The band under the hero shows
  disciplines instead.
- **Testimonials** — no quotes, invented or otherwise.
- **Statistics** — no "200+ projects", no "10 years", no revenue figures.
- **Team size, offices, awards, certifications, partnerships** — none claimed
  anywhere.
- **A phone number and a postal address** — neither is published until one is
  supplied. The legal pages show them as outstanding placeholders.

## Brand assets

The DISC mark and lockup in `public/brand/` are a **vector reconstruction traced
by eye from the supplied raster reference** — the ring proportions, the counter,
the interruption at the lower right and the outboard tail all follow the
artwork, but this is not the original vector file.

Everything derives from one geometry module
(`src/components/brand/disc-geometry.ts`), so the React `<Logo />`, the favicon,
the `/public/brand` SVGs and the Open Graph card are guaranteed identical.

**To drop in the official artwork**, do one of:

1. Replace the constants in `disc-geometry.ts` with path data exported from the
   original file — everything downstream updates automatically; or
2. Overwrite the generated files in `public/brand/` and point the `<Disc />`
   component at the official path data.

Either way it is a single-place change. Regenerate the static files after any
geometry edit:

```bash
npm run brand
```

The wordmark in the lockup SVGs is set as live text in the brand display face.
If the lockup has to render where that font is unavailable, replace those files
with an outlined export.
