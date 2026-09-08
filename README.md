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
    home/ work/ services/ packages/ insights/ contact/
    ui/                Button, Section, FAQ primitives
  content/             Structured data: services, packages, projects, insights
  dictionaries/        UI copy — en.ts defines the shape, de.ts must satisfy it
  lib/                 i18n, routes, SEO helpers, site config
```

**Content is data.** Adding a service, project or article is an entry in
`src/content/*` — the page, the index card, the sitemap entry and the structured
data all follow. No template duplication.

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

## Before launch

`PLACEHOLDERS.md` lists everything that still needs real data — legal entity
details, the contact form endpoint, project imagery — and everything that is
deliberately absent (client logos, testimonials, statistics) because it does not
exist yet and was not invented.
