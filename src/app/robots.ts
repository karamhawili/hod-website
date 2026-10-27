import type { MetadataRoute } from "next";
import { IS_PRODUCTION_DEPLOY, SITE_URL } from "@/lib/site";

// Only the production deployment is crawlable. Preview deployments (and local
// runs) disallow everything so *.vercel.app preview URLs never get indexed.
// /admin also sends its own `noindex` via next-sanity/studio's metadata.
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOY) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
