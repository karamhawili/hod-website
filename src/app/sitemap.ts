import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getSitemapProjects } from "@/sanity/lib/queries";

// Redirect-only routes (/about → /studio, /portfolio → /archive) are omitted.
const STATIC_ROUTES = [
  "/",
  "/archive",
  "/studio",
  "/contact",
  "/publications",
  "/awards",
  "/join-us",
];

// Prerendered at build; refresh hourly so newly published projects appear
// without waiting for a deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getSitemapProjects();

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/project/${project.slug}`,
      lastModified: project._updatedAt,
    })),
  ];
}
