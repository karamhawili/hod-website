import type { Metadata } from "next";

// Absolute origin for metadata (canonical, Open Graph), robots and sitemap.
// On Vercel, VERCEL_PROJECT_PRODUCTION_URL is set automatically to the primary
// production domain — it becomes the custom domain once that's attached, so no
// env var needs maintaining. NEXT_PUBLIC_SITE_URL overrides it if ever needed.
const vercelProductionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelProductionHost
    ? `https://${vercelProductionHost}`
    : "http://localhost:3000");

// Only the production deployment may be indexed — previews and local runs are
// disallowed in robots.txt.
export const IS_PRODUCTION_DEPLOY = process.env.VERCEL_ENV === "production";

export const SITE_NAME = "House of Design";

export const SITE_DESCRIPTION =
  "House of Design is an interior design studio by Suzy Habre, based in Beirut and Dubai — private residences, restaurants, beach clubs and lounges.";

export const OPEN_GRAPH_DEFAULTS = {
  siteName: SITE_NAME,
  type: "website",
  locale: "en_US",
} as const;

type PageMetadataInput = {
  /** Page name only — the root layout's title template appends the brand. */
  title?: string;
  description?: string;
  /** Path for the canonical URL (resolved against metadataBase). */
  path: string;
  /** Overrides the default ./opengraph-image card (e.g. a project photo). */
  image?: { url: string; width: number; height: number; alt: string };
};

// Per-page metadata in one place. A page-level `openGraph` object REPLACES the
// layout's (Next merges metadata shallowly), so the shared Open Graph fields
// are re-applied here rather than relying on inheritance.
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  image,
}: PageMetadataInput): Metadata {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      title: fullTitle,
      description,
      url: path,
      ...(image && { images: [image] }),
    },
  };
}
