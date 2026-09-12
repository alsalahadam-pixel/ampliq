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
    google.ts       Google Calendar (FreeBusy + events), OAuth refresh grant
    google-oauth.ts the authorization-code half: consent URL, exchange, refresh
    microsoft.ts    Microsoft 365 / Outlook (Graph getSchedule + events)
    index.ts        picks one from the environment, or none
  email/
    templates.ts    branded client and owner mails, EN and DE

src/lib/mail.ts           the one transport the whole site sends through
src/lib/email/brand.ts    the shared AMPLIQ email shell
src/lib/email/enquiry.ts  the enquiry mails, off the same shell

src/components/booking/   the UI. Knows nothing about any provider.
src/app/api/booking/
  availability/           the slot lookup
  route.ts                the booking itself
  google/
    authorize/            one-time connect, step 1. 404 unless enabled
    callback/             one-time connect, step 2. The registered redirect URI
    setup-page.ts         the plain HTML those two render. Not a route
```

The UI talks to `/api/booking/availability` and `/api/booking`. It never sees a
provider, a credential, or anything from the owner's calendar beyond "this time
is not free". Swapping Google for Outlook, or adding a third provider, touches
`providers/` and nothing else.

The two `google/` routes are operator-only and exist for a single use. They
answer 404 unless `GOOGLE_OAUTH_SETUP_SECRET` is set, which it should not be
except during the minutes it takes to connect a calendar.

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

Uses **OAuth 2.0**. The owner authorises AMPLIQ against their own Google account
once; Google returns a refresh token, which the server trades for a short-lived
access token whenever it needs one. There is no service account and no private
key — Google Cloud blocks service-account key creation on many organisations,
and this path does not need one.

The refresh token is a server-side secret. It lives in an environment variable,
is used only in a server-to-server POST to Google, and is never rendered,
returned, or sent to a browser.

#### 1. Google Cloud

1. Create (or open) a project and enable the **Google Calendar API**.
2. **APIs & Services → OAuth consent screen.** Choose **External** unless the
   calendar belongs to a Workspace organisation, in which case **Internal** is
   simpler and skips verification.
   - Add your own Google account under **Test users**.
   - Add the two scopes below under **Data access**.
   - Leave the app in **Testing** only if you intend to reconnect regularly:
     Google expires refresh tokens issued by an app in testing after **seven
     days**. **Publish** the app (no verification review is needed while it is
     used only by its owner) and the refresh token lasts until it is revoked.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID.**
   - Application type: **Web application**.
   - Fill in the two fields exactly as below.

**Authorized JavaScript origins** — one entry:

```
https://ampliq.net
```

**Authorized redirect URIs** — one entry for production, plus the local one if
you intend to run the connect flow from a dev server:

```
https://ampliq.net/api/booking/google/callback
http://localhost:3000/api/booking/google/callback
```

Google matches the redirect URI character for character: no trailing slash, no
`www.`, `https` in production. A mismatch surfaces as `redirect_uri_mismatch`,
and the callback page repeats the exact URI this deployment sent so the two can
be compared side by side.

Copy the **client ID** and **client secret**.

#### 2. Vercel environment variables

Set these on the deployment (Settings → Environment Variables), then redeploy:

| Variable | Value |
| --- | --- |
| `BOOKING_CALENDAR_PROVIDER` | `google` |
| `GOOGLE_CLIENT_ID` | `….apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-…` |
| `GOOGLE_CALENDAR_ID` | `you@example.com`, or the calendar's ID |
| `GOOGLE_OAUTH_REDIRECT_URI` | `https://ampliq.net/api/booking/google/callback` |
| `GOOGLE_OAUTH_SETUP_SECRET` | a long random string — `openssl rand -hex 32` |

`GOOGLE_OAUTH_REDIRECT_URI` is optional in production: it defaults to the site's
own origin plus the callback path, which is the same value. Set it explicitly
anyway if you run the flow from a preview deployment or from localhost, because
Vercel preview URLs change on every deploy and Google will not match them.

`GOOGLE_REFRESH_TOKEN` is deliberately **not** in that table. You do not have it
yet — step 3 produces it.

#### 3. Connect the calendar, once

Open, in a browser, signed in as the account that owns the calendar:

```
https://ampliq.net/api/booking/google/authorize?secret=<GOOGLE_OAUTH_SETUP_SECRET>
```

Approve the consent screen. Google redirects back to the callback, which:

- checks the round trip against an httpOnly, single-use state cookie,
- exchanges the code for tokens **server-side**,
- queries FreeBusy once to prove the token can actually read
  `GOOGLE_CALENDAR_ID`,
- writes the refresh token to the **server log**,
- and shows you a page naming the account, the calendar and the free/busy
  result — and nothing else.

The refresh token is not on that page by design. Read it from the function log
(`vercel logs`, or the Logs tab on the deployment; locally it is in your
terminal), then:

1. Set `GOOGLE_REFRESH_TOKEN` on the deployment.
2. **Remove `GOOGLE_OAUTH_SETUP_SECRET`.** Both `/api/booking/google/*` routes
   answer 404 without it, which is where they should spend their life.
3. Redeploy.

Doing the whole flow against `npm run dev` instead keeps the token in your own
terminal rather than a cloud log. Point `GOOGLE_OAUTH_REDIRECT_URI` at
`http://localhost:3000/api/booking/google/callback` for that run, and put the
production value back afterwards.

#### Scopes

Two, by default:

- `https://www.googleapis.com/auth/calendar.events` — writes the booking into
  the calendar.
- `https://www.googleapis.com/auth/calendar.readonly` — authorises the
  free/busy lookup.

The grant is wider than the use. This code calls exactly two endpoints,
`freebusy.query` and `events.insert`, and never reads an event body. Narrow it
with `GOOGLE_OAUTH_SCOPES` if you prefer, but check Google's current scope list
first: an unrecognised scope fails at the consent screen rather than at the
request.

#### When it stops working

The provider reports `Could not refresh the Google access token (invalid_grant)`
when the refresh token is dead. Three causes, one fix:

- the consent screen is still in **Testing** and seven days have passed,
- access was revoked at `myaccount.google.com/permissions`,
- the OAuth client was deleted or its secret rotated.

Set `GOOGLE_OAUTH_SETUP_SECRET` again, rerun step 3, replace the token, unset
the secret.

If Google returns no refresh token at all, the account has already authorised
this client. Remove the app under `myaccount.google.com/permissions` and rerun —
the flow always asks with `access_type=offline` and `prompt=consent`, which is
what forces a fresh one.

#### What is not connected

With `GOOGLE_REFRESH_TOKEN` unset the provider simply does not activate. The
booking flow keeps working: availability is the published working hours minus
bookings made through the site, the page says plainly that no calendar was
consulted, and nothing pretends otherwise.

By default Google's own invite mail is suppressed, because the visitor already
gets the branded AMPLIQ confirmation and two emails for one call is noise. Set
`GOOGLE_CALENDAR_SEND_INVITES="true"` to let Google mail them as well.

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

One transport serves both the booking confirmations and the enquiry form.

```bash
# Option A — Resend
RESEND_API_KEY="re_…"

# Option B — anything that takes { to, subject, html, text } as JSON
# MAIL_ENDPOINT="https://…"
# MAIL_ENDPOINT_TOKEN="…"                     # sent as a bearer token if set

MAIL_FROM_EMAIL="project@ampliq.net"          # must be a verified sender
MAIL_FROM_NAME="AMPLIQ"
MAIL_NOTIFICATION_EMAIL="project@ampliq.net"  # where notifications land
# MAIL_REPLY_TO="project@ampliq.net"

# Optional: a standing meeting link, shown in the confirmation email. Without
# one the email says the details follow by reply rather than inventing a link.
# BOOKING_MEETING_LINK="https://meet.google.com/…"
```

With none of these set, `sendEmail` logs what it would have sent and returns
`{ sent: false }`. It never reports success, and the confirmation screen tells
the visitor plainly that no email went out.

Two mails go out per booking: a branded confirmation to the visitor in the
language they booked in — carrying the date, time, timezone, how the call
happens and what they told us — and a notification to AMPLIQ carrying the name,
email, company, phone, project type, description, date, time and timezone. The
notification is sent with the visitor as reply-to, so answering it goes straight
back to them.

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
