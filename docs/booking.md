# Booking

The `/start` page runs a four-step flow — date, time, details, confirmation —
backed by two API routes. It works with nothing configured, and gets better as
each piece is connected.

## What is honest about it

The whole feature is built so that it never claims more than it can back up.

| Situation | What the visitor is told |
| --- | --- |
| A calendar is connected and answered | "Live availability — these times are checked against our calendar right now." |
| No calendar is configured | "Availability is provisional — no calendar is connected to this site yet, so these are our published working hours minus bookings already made here." |
| A calendar is configured but unreachable | "We couldn't reach our calendar" — with a link to enquire by email instead. |
| No server at all (static export) | "Availability is not being checked" — and the booking step refuses to pretend it submitted anything. |
| No mail provider configured | The confirmation screen says no email was sent. |
| A calendar write failed | `calendarSynced: false` — the confirmation does not claim a calendar entry that isn't there. |

None of these states is hidden, and none of them is styled to be overlooked.
If you connect nothing at all, the page still works: bookings are recorded, the
owner is told by email once mail is set up, and the visitor is never shown
availability dressed up as something it isn't.

## Layout

```
src/lib/booking/
  types.ts          shared shapes. BusyInterval is times only, by design
  config.ts         working hours, slot length, buffer, notice, horizon
  time.ts           IANA timezone maths, no dependencies
  availability.ts   pure slot engine: config + busy + now → slots
  service.ts        the only place provider, store and engine meet
  store.ts          booking persistence (in-memory by default — see below)
  validate.ts       server-side request validation
  client.ts         browser-side loading, with an offline fallback
  ics.ts            the "add to calendar" file
  providers/
    types.ts        the CalendarProvider contract
    google.ts       Google Calendar (FreeBusy + events)
    microsoft.ts    Microsoft 365 / Outlook (Graph getSchedule + events)
    index.ts        picks one from the environment, or none
  email/
    templates.ts    branded client and owner mails, EN and DE
    send.ts         Resend or a generic endpoint; honest no-op when unset

src/components/booking/   the UI. Knows nothing about any provider.
src/app/api/booking/      the two routes.
```

The UI talks to `/api/booking/availability` and `/api/booking`. It never sees a
provider, a credential, or anything from the owner's calendar beyond "this time
is not free". Swapping Google for Outlook, or adding a third provider, touches
`providers/` and nothing else.

## Privacy

`getBusyIntervals` returns `{ start, end }` and nothing else. No subject, no
attendees, no location, no notes.

- **Google** — the FreeBusy endpoint returns only busy times. The API itself
  never discloses what the owner is doing, so the guarantee does not depend on
  the adapter remembering to strip anything.
- **Microsoft** — Graph's `getSchedule` *will* return `subject` and `location`
  when the app has read access to the mailbox. `microsoft.ts` reads the two
  timestamps and builds a fresh object; the other fields are never read, never
  typed, and never travel inward. That discard is deliberate — see the comment
  at the top of the file.

The availability API response carries times and counts. There is a QA check
asserting it contains no event vocabulary at all.

## Configuration

Everything is optional. Copy what you need into `.env.local`.

### Working hours

```bash
BOOKING_TIMEZONE="Europe/Berlin"       # the zone the hours below are written in
BOOKING_SLOT_MINUTES="30"              # length of the call
BOOKING_BUFFER_MINUTES="15"            # protected gap either side of anything booked
BOOKING_MINIMUM_NOTICE_HOURS="24"      # how far ahead a booking must be made
BOOKING_HORIZON_DAYS="60"              # how far ahead the calendar opens
BOOKING_STEP_MINUTES="30"              # spacing of slot start times

# Overrides the published defaults. Days may be single, comma-separated or a
# range; several windows per day are separated by commas, groups by semicolons.
BOOKING_WORKING_HOURS="mon-thu 09:30-12:30,13:30-17:30; fri 09:30-13:00"

# Days with no calls, whatever the working hours say.
BOOKING_BLACKOUT_DATES="2026-12-24,2026-12-25,2026-12-31"
```

The defaults, if you set none of these: 30-minute calls, 15 minutes of buffer,
24 hours' notice, 60 days ahead, Monday to Thursday 09:30–12:30 and
13:30–17:30, Friday 09:30–13:00, Europe/Berlin, no blackout dates.

The lunch break is simply the gap between two windows — there is no separate
setting for it.

`BOOKING_BUFFER_MINUTES` is deliberately **not** sent to the browser. It is a
scheduling detail, not something visitors need or should infer.

### Google Calendar

Uses a service account, so there is no interactive OAuth and no refresh token
to keep alive.

1. In Google Cloud, create a project and enable the **Google Calendar API**.
2. Create a **service account** and download its JSON key.
3. Either share the calendar with the service account's email address (simplest),
   or set up domain-wide delegation and impersonate a user.
4. Set:

```bash
BOOKING_CALENDAR_PROVIDER="google"
GOOGLE_CALENDAR_ID="you@example.com"          # or the calendar's ID
GOOGLE_CALENDAR_CLIENT_EMAIL="…@….iam.gserviceaccount.com"
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMII…\n-----END PRIVATE KEY-----\n"
# GOOGLE_CALENDAR_IMPERSONATE="you@example.com"   # only with domain-wide delegation
# GOOGLE_CALENDAR_SEND_INVITES="true"             # also let Google mail the invite
```

The private key holds newlines, which `.env` files cannot; keep them escaped as
`\n` exactly as the JSON key file has them.

By default Google's own invite mail is suppressed, because the visitor already
gets the branded AMPLIQ confirmation and two emails for one call is noise.

### Microsoft 365 / Outlook

Uses the client-credentials flow, so the app holds application permissions
rather than a user's session.

1. Register an application in Entra ID (Azure AD).
2. Grant the **application** permissions `Calendars.ReadWrite` and
   `Calendars.Read.Shared`, then grant admin consent.
3. Create a client secret.
4. Set:

```bash
BOOKING_CALENDAR_PROVIDER="microsoft"
MICROSOFT_TENANT_ID="…"
MICROSOFT_CLIENT_ID="…"
MICROSOFT_CLIENT_SECRET="…"
MICROSOFT_CALENDAR_USER="you@yourdomain.com"   # UPN or object id of the mailbox
```

Consider an [application access policy][policy] so the app can only reach the
one mailbox it needs rather than every calendar in the tenant.

[policy]: https://learn.microsoft.com/en-us/graph/auth-limit-mailbox-access

### Email

```bash
# Option A — Resend
RESEND_API_KEY="re_…"

# Option B — anything that takes { to, subject, html, text } as JSON
# BOOKING_EMAIL_ENDPOINT="https://…"
# BOOKING_EMAIL_TOKEN="…"                # sent as a bearer token if set

BOOKING_FROM_EMAIL="hello@ampliq.de"     # must be a verified sender
BOOKING_FROM_NAME="AMPLIQ"
BOOKING_OWNER_EMAIL="you@ampliq.de"      # where notifications land
# BOOKING_REPLY_TO="you@ampliq.de"
```

With none of these set, `sendEmail` logs what it would have sent and returns
`{ sent: false }`. It never reports success, and the confirmation screen tells
the visitor plainly that no email went out.

Two mails go out per booking: a branded confirmation to the visitor in the
language they booked in, and a notification to the owner carrying the date, both
timezones, the visitor's details and what they wrote.

## Persistence — read this before launch

The default booking store keeps bookings **in the Node process**
(`store.ts`). It is correct for a single long-lived server and wrong for
anything else: a restart forgets every booking, and two serverless instances do
not share a list.

Two ways to make it durable, in order of effort:

1. **Connect a calendar with write access.** Once the event is created, it is in
   the real calendar and the next availability lookup sees it through freebusy.
   The calendar becomes the source of truth and the memory store is only a guard
   against two requests racing inside one process. For most deployments this is
   enough.
2. **Implement `BookingStore` against a database** and return it from
   `getBookingStore()`. Two methods. Nothing else changes.

## Double booking

The browser is never trusted. `POST /api/booking` re-fetches availability and
re-checks the requested slot before recording anything — a visitor may have had
the page open for an hour. If the slot has gone the route answers `409`, and the
UI sends them back to that day's times with the slot now marked taken. The store
performs one final check on write, so two requests landing microseconds apart
cannot both succeed.

## Timezones

Working hours are defined in the business timezone. The browser reports the
visitor's zone and every time is shown in it, with the agency's clock alongside
whenever the two differ, so nobody has to do the arithmetic.

`time.ts` converts between wall-clock time and UTC instants using
`Intl.DateTimeFormat` — no date library, and no bundled copy of the tz database.
It handles both DST transitions: a wall time skipped by a spring-forward is
detected and the slot is marked unavailable rather than silently sliding an
hour.

## Static export

A static export has no route handlers. The flow detects this and:

- computes the grid locally from the published working hours,
- labels it "Availability is not being checked",
- and, on submit, says plainly that nothing was sent and no time was held.

Availability shown this way is real published working hours, honestly labelled —
never invented, and never presented as a calendar check.

## Testing it

With the dev server running:

```bash
node .qa/booking.mjs
```

Drives the whole flow in a browser pinned to `America/New_York` (deliberately
far from Berlin, so any confusion between the two clocks shows up rather than
coinciding) and checks hydration, the grid's keyboard behaviour, both
timezones, validation, the confirmation, double booking, the German page, and
that the availability API leaks nothing about the owner's calendar.
