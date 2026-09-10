# AMPLIQ

Marketing, amplified. The website for AMPLIQ — a marketing and creative studio
working with companies in Germany.

English is the primary language, German the secondary one. Both are fully
translated and statically rendered.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — tokens defined in `src/app/globals.css`
- No UI framework, no animation library, no icon package. Motion is ~1 KB of
  inline JavaScript plus CSS; icons are inline SVG.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — the site runs without it
npm run dev                  # http://localhost:3000 → redirects to /en
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run qa` | The QA suite — links, SEO, accessibility, contrast, German, mobile, the two forms, page weight. Needs a built site running (see `qa/README.md`) |
| `npm run launch-check` | What the site is still waiting for before it can go live |
| `npm run brand` | Regenerate `public/brand/*` and the favicon from the DISC geometry |

## Architecture

```
src/
  app/[lang]/          Every route, one tree, rendered per locale
  proxy.ts             Locale routing (Next 16's renamed middleware)
  components/
    brand/             DISC geometry, Logo, decorative compositions
    layout/            Page hero, footer, analytics, legal blocks
    navigation/        Header, mobile menu, language switcher
    sections/          Cross-page sections (final CTA, process, packages)
    home/ services/ packages/ insights/ contact/ booking/ legal/
    ui/                Button, Section, FAQ, Media primitives
  content/             Structured data: services, packages, insights, media slots
  dictionaries/        UI copy — en.ts defines the shape, de.ts must satisfy it
  lib/                 i18n, routes, SEO helpers, site config
```

**Content is data.** Adding a service or article is an entry in
`src/content/*` — the page, the index card, the sitemap entry and the structured
data all follow. No template duplication.

There is no portfolio section. AMPLIQ has no client work to show yet, and
inventing case studies was never an option, so the site earns its credibility
from how the work is described instead.

**Translations are type-checked.** `de.ts` is typed against `en.ts`, so a
missing German string fails the build rather than silently falling back.

## Localisation

Routes are locale-prefixed: `/en/...` and `/de/...`. `src/proxy.ts` redirects
unprefixed requests using, in order: a stored language choice, the browser's
`Accept-Language`, then English.

Slugs are shared across locales, which keeps one page tree and unambiguous
hreflang pairs. Every page emits canonical + `hreflang` alternates including
`x-default`.

## Brand

The DISC mark is generated from one geometry module
(`src/components/brand/disc-geometry.ts`). The React `<Logo />`, the favicon, the
static SVGs in `public/brand/` and the Open Graph card all derive from it, so the
mark cannot drift between surfaces. See `PLACEHOLDERS.md` for how to swap in
official vector files.

## The domain

Everything — canonical URLs, hreflang, the sitemap, Open Graph, and all three
published addresses — derives from one constant. Buying the real domain is a
one-line change:

```bash
NEXT_PUBLIC_SITE_DOMAIN="yourdomain.com"
```

## Photography

There is none yet. Rather than build sections that assume there never will be,
every intended photograph has a named slot in `src/content/media.ts` carrying
its aspect ratio and alt text, and the sections are built around those boxes.
Adding a picture is putting the file in `public/media/` and filling in `src` —
no section is re-laid out, and nothing shifts while it loads. Until then the
slot holds the DISC panel.

## Before launch

```bash
npm run launch-check
```

Prints everything still outstanding, grouped by whether it blocks launch, and
exits non-zero while anything required is missing. It reads the same registries
the pages read, so it cannot drift from what the site renders.

`PLACEHOLDERS.md` explains each item — legal entity details, the mail
transport, photography — and everything that is deliberately absent (client
logos, testimonials, statistics) because it does not exist yet and was not
invented.
