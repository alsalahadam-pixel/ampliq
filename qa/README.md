# QA

Nine checks that run against a built site. Every claim made about this build —
no overflow at 320px, WCAG AA contrast, no broken links, a booking that cannot
be double-booked — comes from one of them, so it can be re-verified rather than
taken on trust.

```bash
npm run build
npm run start -- -p 3100      # in one terminal
npm run qa                    # in another
```

Point it somewhere else with `QA_BASE`:

```bash
QA_BASE=https://staging.example.com npm run qa
```

Each check exits non-zero when it finds something, and so does `npm run qa`, so
it can gate a deploy. Individual checks run on their own too:

```bash
node qa/mobile.mjs
```

## What each one covers

| Check | Covers |
| --- | --- |
| `site-url` | The site origin against every input an environment variable can hold: empty, whitespace, `https://`, a bare word, a wrong scheme. Everything on the site derives from this one value, so a fragment here fails the build rather than one page — which is exactly what happened once. Needs neither a build nor a server. |
| `build-output` | Reads `.next` rather than the rendered page. A page can render nothing and still hand a visitor the words — importing a server module into a client component ships its whole contents to the browser. Asserts no client bundle carries the legal-entity registry, and that no prerendered file anywhere carries a placeholder token or a statement about what the business has not settled. Needs a build, not a server. |
| `crawl` | Follows every internal link from both locale roots. Broken routes, references to pages that no longer exist, console and page errors. |
| `seo` | Title and description length against what a search result actually shows, canonical URLs, hreflang completeness, Open Graph image and locale, `html lang`, one `h1` per page, valid JSON-LD, legal pages `noindex` and absent from the sitemap, `robots.txt`. |
| `a11y` | Form labels, image alt text, links and buttons with no accessible name, heading order. |
| `contrast` | Computes the real ratio for every text node against the background actually painted behind it, at the size and weight it renders. Skips inactive controls and elements with no measurable text colour (WCAG 1.4.3 exempts both). |
| `german` | Every internal link on a German page stays German, no untranslated English, consistent formal address (`Sie`, never `du`), no unfilled `{placeholders}`, correct `html lang`. |
| `legal-visibility` | The five documents are public in both languages, linked from the footer, `noindex`, and structurally whole — no heading standing over an empty section, no contents entry pointing at one that is not there. And nothing anywhere on the site says the company is unfinished: no draft notice, no `[PLACEHOLDER]`, no red. Also checks the enquiry and booking forms link the privacy policy. |
| `addresses` | `project@` and `info@` do not blur into each other: the Start-a-project fork, the brief, the booking and the closing CTA use the project address; the footer and the organisation record use the general one; support is `help@`. |
| `rules-probe` | Hairlines drawn twice — two rules of the same width stacked within 56px, which reads as a mistake. Divided lists are excluded. |
| `mobile` | 320 / 375 / 390 / 430 / 768 / 1024 / 1440 across every page in both languages: horizontal overflow and what caused it, side gutters, tap-target size, text too small to read, console errors. |
| `contact` | Fills and submits the enquiry form. Asserts that an empty submit never reaches the network, that an unconfigured mail transport produces a 503 rather than a fake success, and that the UI says so. |
| `booking` | The whole booking flow: availability, keyboard navigation of the calendar grid, timezone display, validation, a real booking, the slot then showing as taken, and the API refusing an invalid or past slot. Also asserts the availability response leaks no event details. |
| `perf` | Page weight by type, request count, cumulative layout shift and LCP. Advisory — it prints numbers to read, and never fails the run. |

## Notes

`booking` and `contact` post to the real API. Against a site with no mail
transport configured they assert the honest-failure path; against one with mail
configured they will send real messages, so point them at staging, not
production.

The checks need Playwright's Chromium. In this container it is at
`/opt/pw-browsers/chromium`, which is what the scripts use.
