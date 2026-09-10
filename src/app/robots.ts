import type { MetadataRoute } from "next";

import { legalIsPublished } from "@/lib/legal";
import { siteUrl } from "@/lib/site";

/** Nothing here reads the request, so it is generated once at build time. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Once published, the legal pages are noindex and keeping crawlers off
      // them saves crawl budget. While they are unpublished they answer 404,
      // and naming them here would only advertise a path that is deliberately
      // not there. The API is not content and has nothing to index either.
      disallow: legalIsPublished
        ? ["/en/legal", "/de/legal", "/api/"]
        : ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
