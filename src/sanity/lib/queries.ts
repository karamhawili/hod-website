import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import type {
  VIEWER_PROJECTS_QUERY_RESULT,
  ALL_VIEWER_PROJECTS_QUERY_RESULT,
} from "@/sanity/sanity.types";
import { JoinUsPage, Project, SiteSettings, StudioPage } from "@/types/sanity";

// Card/listing fields. Used by the landing + portfolio project feeds, which
// render cover image, title, location, year, categories — NOT the page-builder
// `content`. Keeping `content` out of these queries avoids fetching the entire
// project-page payload for every card (see Audit.md S1).
//
// Transitional shims (Phase 4 schema rebuild): projects entered with the NEW
// minimal schema (images[], single category ref) are presented in the OLD card
// shape so the not-yet-rebuilt landing/portfolio keep working until Phases
// 5/7 replace them. formattedTitle/excerpt/overlayTextColor resolve null for
// new documents by design.
const LIST_FIELDS = `
  _id,
  title,
  formattedTitle,
  slug,
  "coverImage": coalesce(coverImage, images[0]),
  excerpt,
  "location": coalesce(location, category),
  "categories": coalesce(
    categories[]->{
      _id,
      title,
      "slug": slug.current,
      "color": color.hex
    },
    [category->{
      _id,
      title,
      "slug": slug.current
    }]
  ),
  year,
  featured,
  overlayTextColor
`;

// The image filter shields the out-of-scope portfolio components from docs
// without any image (their urlFor(coverImage) crashes on null — audit N2).
// Phase 7's archive rebuild replaces this query and handles it properly.
export const ALL_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && (defined(coverImage) || count(images) > 0)]
    | order(_createdAt desc) {
    ${LIST_FIELDS}
  }
`);

export async function getAllProjects(): Promise<Project[]> {
  const result = await sanityFetch({
    query: ALL_PROJECTS_QUERY,
    tags: ["project"],
  });

  return result.data as Project[];
}

// Landing project-viewer payload: the ordered gallery with intrinsic
// dimensions (native-ratio layout) and LQIP placeholders.
const VIEWER_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  location,
  year,
  images[]{
    _key,
    alt,
    asset,
    hotspot,
    crop,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions{ width, height, aspectRatio }
  }
`;

export const VIEWER_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true && defined(slug.current) && count(images) > 0]
    | order(_createdAt desc) { ${VIEWER_FIELDS} }
`);

// Fallback so the landing never renders blank while no project is featured.
export const ALL_VIEWER_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current) && count(images) > 0]
    | order(_createdAt desc) { ${VIEWER_FIELDS} }
`);

export async function getViewerProjects(): Promise<VIEWER_PROJECTS_QUERY_RESULT> {
  const result = await sanityFetch({
    query: VIEWER_PROJECTS_QUERY,
    tags: ["project"],
  });

  return (result.data ?? []) as VIEWER_PROJECTS_QUERY_RESULT;
}

export async function getAllViewerProjects(): Promise<ALL_VIEWER_PROJECTS_QUERY_RESULT> {
  const result = await sanityFetch({
    query: ALL_VIEWER_PROJECTS_QUERY,
    tags: ["project"],
  });

  return (result.data ?? []) as ALL_VIEWER_PROJECTS_QUERY_RESULT;
}

// Project detail page: the viewer payload plus the long-form fields.
export const PROJECT_DETAIL_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    ${VIEWER_FIELDS},
    description,
    credits
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    brandLine,
    nav[]{ label, href },
    secondaryNav[]{ label, href },
    locations[]{ label, address },
    phone,
    email,
    mapUrl,
    socials[]{ platform, url }
  }
`);

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const result = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  return result.data as SiteSettings | null;
}

export const STUDIO_PAGE_QUERY = defineQuery(`
  *[_id == "studioPage"][0]{
    intro{ heading, body, image, secondaryImage, secondaryBody },
    team{ image, heading, body },
    disciplines{ image, secondaryImage, body, sectors, services },
    founder{ name, role, image, bio, linkLabel, linkUrl },
    publications{ label, image, items[]{ _key, publication, title, url } }
  }
`);

export async function getStudioPage(): Promise<StudioPage | null> {
  const result = await sanityFetch({
    query: STUDIO_PAGE_QUERY,
    tags: ["studioPage"],
  });

  return result.data as StudioPage | null;
}

export const JOIN_US_PAGE_QUERY = defineQuery(`
  *[_id == "joinUsPage"][0]{
    "videoUrl": video.asset->url,
    image,
    heading,
    body,
    email
  }
`);

export async function getJoinUsPage(): Promise<JoinUsPage | null> {
  const result = await sanityFetch({
    query: JOIN_US_PAGE_QUERY,
    tags: ["joinUsPage"],
  });

  return result.data as JoinUsPage | null;
}

