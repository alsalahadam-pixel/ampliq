import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * The site is static HTML, three self-hosted fonts and its own inline SVG. It
 * loads nothing from a third party unless an analytics ID is set, so the
 * policy can be tight without breaking anything.
 *
 * `unsafe-inline` for styles is required: Next injects the stylesheet and
 * React writes inline `style` attributes for the animation delays. Scripts do
 * not get it — Next's own bootstrap is nonce-free but same-origin, and the
 * analytics loaders are `next/script` from the vendors' own hosts.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Nothing here needs a camera, a microphone, a location or a payment
    // handler. Saying so denies them to anything embedded as well.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  // The version banner tells an attacker which Next release to target and
  // does nothing for anyone else.
  poweredByHeader: false,

  images: {
    // AVIF first, WebP behind it. There is no photography on the site yet, so
    // this costs nothing today and means the first picture that lands is
    // already served in a modern format at the size the layout asks for.
    formats: ["image/avif", "image/webp"],
    // The widths the layout actually uses: full bleed, the 7/12 and 5/12
    // columns, and the card grid.
    deviceSizes: [390, 640, 828, 1080, 1200, 1920],
    imageSizes: [256, 384, 512],
    // Files are content-hashed by the build, so they can be cached hard.
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};

export default nextConfig;
