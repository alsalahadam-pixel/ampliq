import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/site";

/** Nothing here reads the request, so it is generated once at build time. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Legal pages are noindex; keeping crawlers off them saves crawl budget.
      // The API is not content and has nothing to index either.
      disallow: ["/en/legal", "/de/legal", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
