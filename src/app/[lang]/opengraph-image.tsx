import { ImageResponse } from "next/og";

import {
  DISC_DOT,
  DISC_RING_PATH,
  DISC_TAIL_PATH,
} from "@/components/brand/disc-geometry";
import { isLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

export const alt = "AMPLIQ — Marketing, amplified.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Prerender one card per locale rather than rendering it per request. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Social share card. Drawn from the same DISC geometry as the rest of the site,
 * so the mark on a shared link is identical to the mark in the header.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";

  const tagline = site.tagline[locale];
  const kicker =
    locale === "de"
      ? "Marketing- & Kreativagentur"
      : "Marketing & creative agency";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0F0F0E",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 100 100" fill="#F7F5F2">
            <path d={DISC_RING_PATH} />
            <path d={DISC_TAIL_PATH} />
            <circle cx={DISC_DOT.cx} cy={DISC_DOT.cy} r={DISC_DOT.r} />
          </svg>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: -2,
              color: "#F7F5F2",
            }}
          >
            AMPLIQ
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: -4,
              color: "#F7F5F2",
              lineHeight: 1.05,
            }}
          >
            {tagline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#9C9A94",
              letterSpacing: -0.5,
            }}
          >
            {kicker} — {site.market}
          </div>
        </div>

        <div style={{ display: "flex", height: 6, background: "#1B4DFF", width: 180 }} />
      </div>
    ),
    size,
  );
}
