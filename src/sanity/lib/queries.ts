import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import type {
  VIEWER_PROJECTS_QUERY_RESULT,
  ARCHIVE_PROJECTS_QUERY_RESULT,
  CATEGORIES_QUERY_RESULT,
  STUDIO_PAGE_QUERY_RESULT,
  JOIN_US_PAGE_QUERY_RESULT,
  PUBLICATIONS_PAGE_QUERY_RESULT,
  AWARDS_PAGE_QUERY_RESULT,
  INTRO_SLIDESHOW_QUERY_RESULT,
} from "@/sanity/sanity.types";
import { SiteSettings } from "@/types/sanity";

// ---- Project gallery fragments ----
//
// `project.images` is a mixed array: plain `image` members plus `imagePair` /
// `imageTrio` blocks that nest their own `images[]`. The detail page renders
// the blocks; everything else (landing viewer, archive thumb, presence gates)
// wants the flat, page-ordered list of every image.

// Per-image projection: LQIP + intrinsic dimensions for next/image.
const GALLERY_IMAGE = `
    _key,
    alt,
    asset,
    hotspot,
    crop,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions{ width, height, aspectRatio }`;

// Flat list: a plain image member has no `images` field, so coalesce falls
// through to `[@]` (itself); a pair/trio yields its nested array. The nested
// `[]` traversal flattens, and assetless slots are dropped.
const FLAT_IMAGES = `images[]{ "items": coalesce(images, [@]) }[].items[defined(asset)]{ ${GALLERY_IMAGE}
  }`;

// "Has at least one real image" — top-level image members have no `images`,
// pair/trio blocks have no `asset`, so the two counts are disjoint.
const HAS_IMAGES = `(count(images[defined(asset)]) + count(images[].images[defined(asset)])) > 0`;

// Archive: the "see everything" grid. Thumb = first gallery image (flattened).
export const ARCHIVE_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current) && ${HAS_IMAGES}
      && ($category == null || category->slug.current == $category)]
    | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
    location,
    status,
    year,
    "category": category->title,
    "thumb": (${FLAT_IMAGES})[0]
  }
`);

// Only categories with at least one home-featured project — the rail links
// filter the home rotation, so a category with nothing on home would land on an
// empty viewer. Empty (for-home) categories are hidden from the rail.
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && defined(slug.current)
      && count(*[_type == "project" && references(^._id) && showOnHome == true && ${HAS_IMAGES}]) > 0]
    | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }
`);

export async function getArchiveProjects(
  category?: string,
): Promise<ARCHIVE_PROJECTS_QUERY_RESULT> {
  const result = await sanityFetch({
    query: ARCHIVE_PROJECTS_QUERY,
    params: { category: category ?? null },
    tags: ["project"],
  });

  return (result.data ?? []) as ARCHIVE_PROJECTS_QUERY_RESULT;
}

export async function getCategories(): Promise<CATEGORIES_QUERY_RESULT> {
  const result = await sanityFetch({
    query: CATEGORIES_QUERY,
    tags: ["category"],
  });

  return (result.data ?? []) as CATEGORIES_QUERY_RESULT;
}

// Landing project-viewer payload: the ordered gallery, flattened (pair/trio
// members become individual frames, in page order), with intrinsic dimensions
// (native-ratio layout) and LQIP placeholders.
const VIEWER_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  location,
  year,
  "images": ${FLAT_IMAGES}
`;

// The home rotation: only projects flagged `showOnHome` (curated subset of the
// full catalog — the Archive still lists everything), optionally narrowed by
// the rail's category filter.
export const VIEWER_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && showOnHome == true && defined(slug.current) && ${HAS_IMAGES}
      && ($category == null || category->slug.current == $category)]
    | order(orderRank) { ${VIEWER_FIELDS} }
`);

export async function getViewerProjects(
  category?: string,
): Promise<VIEWER_PROJECTS_QUERY_RESULT> {
  const result = await sanityFetch({
    query: VIEWER_PROJECTS_QUERY,
    params: { category: category ?? null },
    tags: ["project"],
  });

  return (result.data ?? []) as VIEWER_PROJECTS_QUERY_RESULT;
}

// Project detail page: the long-form fields plus the gallery as BLOCKS (not
// flattened) — a plain image renders native-ratio, pair/trio render their
// layouts. Order is the editor's, top to bottom.
export const PROJECT_DETAIL_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    location,
    year,
    description,
    credits,
    "gallery": images[]{
      _key,
      _type,
      _type == "image" => { ${GALLERY_IMAGE}
      },
      _type != "image" => {
        images[defined(asset)]{ ${GALLERY_IMAGE}
        }
      }
    }
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    brandLine,
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

// Home intro slideshow images (with LQIP + intrinsic dimensions for next/image).
// Empty slots are filtered out; an empty result disables the intro.
export const INTRO_SLIDESHOW_QUERY = defineQuery(`
  *[_id == "siteSettings"][0].introSlideshow[defined(asset)]{
    _key,
    alt,
    asset,
    hotspot,
    crop,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions{ width, height, aspectRatio }
  }
`);

export async function getIntroSlideshow(): Promise<
  NonNullable<INTRO_SLIDESHOW_QUERY_RESULT>
> {
  const result = await sanityFetch({
    query: INTRO_SLIDESHOW_QUERY,
    tags: ["siteSettings"],
  });

  return (result.data ?? []) as NonNullable<INTRO_SLIDESHOW_QUERY_RESULT>;
}

// Image projection carrying native-ratio metadata (intrinsic dimensions +
// LQIP) so studio/join-us images render at their true aspect, uncropped.
const IMAGE_META = `{
  asset,
  hotspot,
  crop,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions{ width, height, aspectRatio }
}`;

export const STUDIO_PAGE_QUERY = defineQuery(`
  *[_id == "studioPage"][0]{
    founder{ name, role, bio, linkLabel, linkUrl, image${IMAGE_META} },
    intro{ heading, body },
    disciplines{ heading, body, sectors, services }
  }
`);

export async function getStudioPage(): Promise<STUDIO_PAGE_QUERY_RESULT> {
  const result = await sanityFetch({
    query: STUDIO_PAGE_QUERY,
    tags: ["studioPage"],
  });

  return result.data as STUDIO_PAGE_QUERY_RESULT;
}

export const PUBLICATIONS_PAGE_QUERY = defineQuery(`
  *[_id == "publicationsPage"][0]{
    publications[]{
      _key,
      publication,
      date,
      description,
      url,
      linkLabel,
      image${IMAGE_META}
    }
  }
`);

export async function getPublicationsPage(): Promise<PUBLICATIONS_PAGE_QUERY_RESULT> {
  const result = await sanityFetch({
    query: PUBLICATIONS_PAGE_QUERY,
    tags: ["publicationsPage"],
  });

  return result.data as PUBLICATIONS_PAGE_QUERY_RESULT;
}

export const AWARDS_PAGE_QUERY = defineQuery(`
  *[_id == "awardsPage"][0]{
    recognition[]{ project, awards },
    studioAwards
  }
`);

export async function getAwardsPage(): Promise<AWARDS_PAGE_QUERY_RESULT> {
  const result = await sanityFetch({
    query: AWARDS_PAGE_QUERY,
    tags: ["awardsPage"],
  });

  return result.data as AWARDS_PAGE_QUERY_RESULT;
}

export const JOIN_US_PAGE_QUERY = defineQuery(`
  *[_id == "joinUsPage"][0]{
    "videoUrl": video.asset->url,
    image${IMAGE_META},
    heading,
    body,
    email
  }
`);

export async function getJoinUsPage(): Promise<JOIN_US_PAGE_QUERY_RESULT> {
  const result = await sanityFetch({
    query: JOIN_US_PAGE_QUERY,
    tags: ["joinUsPage"],
  });

  return result.data as JOIN_US_PAGE_QUERY_RESULT;
}

