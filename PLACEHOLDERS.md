# Before this site goes live

Everything on the site is real except the items listed here. Nothing has been
invented to fill a gap: where a fact was unavailable, the page either omits it
or shows a visible placeholder.

## Must be supplied

| What | Where | Notes |
| --- | --- | --- |
| Company name, legal form, address, representative | `.env.local` → `NEXT_PUBLIC_LEGAL_*` | Renders in `/legal/imprint`. Unset fields show a red "to be supplied" marker. |
| VAT ID / register details | `.env.local` → `NEXT_PUBLIC_LEGAL_VAT_ID`, `..._REGISTER_*` | Only required if applicable to the legal form. |
| Contact email | `.env.local` → `NEXT_PUBLIC_CONTACT_EMAIL` | Defaults to `hello@ampliq.de`, which is a **guess** — confirm or change it. |
| Legal review of Impressum and Datenschutz | `/legal/imprint`, `/legal/privacy` | Both pages carry a visible draft notice until a lawyer has reviewed them. The technical descriptions in the privacy policy are accurate for this build; the legal framing is not reviewed. |
| Contact form delivery | `.env.local` → `NEXT_PUBLIC_CONTACT_ENDPOINT` | Until set, the form validates and then states plainly that nothing was sent. It does not pretend to deliver. |

## Should be supplied

| What | Where | Notes |
| --- | --- | --- |
| Project imagery for IHMS Global | `src/content/projects.ts` → `gallery[].src` | Put files in `public/work/ihms-global/` and set the paths. Until then a designed placeholder renders — no stock photography is used anywhere on the site. |
| Case study detail for IHMS Global | `src/content/projects.ts` | The current text describes the scope of work only. Add background and results once the client has approved what may be published. |
| Measurable results | `src/content/projects.ts` | Deliberately absent. The case study says so on the page. Do not add estimated figures. |
| Social profiles | `.env.local` → `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_LINKEDIN_URL` | Links are hidden entirely while unset. |
| Analytics | `.env.local` → `NEXT_PUBLIC_GTM_ID` etc. | No script loads and no tracking cookie is set while unset. **Add a consent banner before enabling any of these** — the privacy policy currently states truthfully that the site sets no tracking cookies, and that statement stops being true the moment a tag is added. |

## Deliberately absent

These are not oversights. The brief was explicit that nothing may be fabricated,
and the design is built to work without them:

- **Client logos** — there is no logo wall. The band under the hero shows
  disciplines instead.
- **Testimonials** — no quotes, invented or otherwise.
- **Statistics** — no "200+ projects", no "10 years", no revenue figures.
- **Team size, offices, awards, certifications, partnerships** — none claimed
  anywhere. The About page says the studio is new and treats that as a position
  rather than something to hide.
- **Extra portfolio entries** — the portfolio holds one real project. Concept
  projects can be added later; the data model has a `status: "concept"` flag
  that labels them as such everywhere they appear.

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
