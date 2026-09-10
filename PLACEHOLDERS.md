# Before this site goes live

Everything on the site is real except the items listed here. Nothing has been
invented to fill a gap: where a fact was unavailable, the page either omits it
or shows a visible placeholder.

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
| Legal entity: name, form, address, responsible person | `.env.local` → `NEXT_PUBLIC_LEGAL_*` | Nothing is shown to a visitor while these are missing: any row, sentence or list item that depends on an unsupplied value is left out, and a chapter left with nothing to say disappears with it. No placeholder, no gap marker, no "coming soon" — and nothing invented either. Supply the values and the full documents appear on their own. **AMPLIQ is not a registered company** — do not enter a GmbH, UG, Handelsregister number or VAT ID that does not exist. |
| VAT ID, tax number, register details | `.env.local` → `..._VAT_ID`, `..._TAX_NUMBER`, `..._REGISTER_*` | Only where they genuinely apply to the legal form. Shown as "if applicable" rather than as a gap. |
| Legal review of all five documents | `/legal/*` | The structure follows German law and the technical descriptions match this build; the legal wording still needs a qualified lawyer. The pages no longer say so on themselves — that notice was removed at your request — so this list is the only place it is recorded. |
| Publishing the legal pages | `src/components/layout/footer.tsx` | The five documents are built and reachable by URL, but **no link to them appears in the footer or navigation**, and they stay `noindex` and out of the sitemap. The footer comment marks exactly where the column goes back. A German site trading publicly needs a reachable Impressum, so restore the links once the entity details and the legal review are done. |
| Email delivery | `.env.local` → `RESEND_API_KEY` or `MAIL_ENDPOINT` | One transport serves both the enquiry form and the booking confirmations. Until it is set, the form answers `503` and says plainly that nothing was sent, and a booking is recorded but **no email reaches anyone — including you**. Neither pretends to deliver. See `docs/booking.md`. |
| Hosting provider name, and the DPA with them | `/legal/privacy` → `[HOSTING PROVIDER]` | Named in the privacy policy once the host is chosen. An Art. 28 GDPR agreement is required before launch. |
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
