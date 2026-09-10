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
      // The legal pages are public but noindex: required disclosures, not
      // content anyone should reach through search, so keeping crawlers off
      // them saves crawl budget. If the section is ever taken down, naming the
      // paths here would only advertise an address that is not there. The API
      // is not content and has nothing to index either.
      disallow: legalIsPublished
        ? ["/en/legal", "/de/legal", "/api/"]
        : ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
