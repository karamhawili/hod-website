import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { Project, SiteSettings } from "@/types/sanity";

// Card/listing fields. Used by the landing + portfolio project feeds, which
// render cover image, title, location, year, categories — NOT the page-builder
// `content`. Keeping `content` out of these queries avoids fetching the entire
// project-page payload for every card (see Audit.md S1).
const LIST_FIELDS = `
  _id,
  title,
  formattedTitle,
  slug,
  coverImage,
  excerpt,
  "location": coalesce(location, category),
  categories[]->{
    _id,
    title,
    "slug": slug.current,
    "color": color.hex
  },
  year,
  featured,
  overlayTextColor
`;

// The page-builder blocks — heavy, and only the project detail page renders them.
const CONTENT_FIELDS = `
  content[]{
    ...,
    _type == "heroBlock" => {
      _key,
      _type,
      image,
      alt
    },
    _type == "imageDetailsBlock" => {
      _key,
      _type,
      image,
      imageAlt,
      title,
      subtitle,
      description,
      layout,
      imageFormat
    },
    _type == "imageBlock" => {
      _key,
      _type,
      image,
      alt,
      variant
    },
    _type == "centeredTextBlock" => {
      _key,
      _type,
      title,
      description,
      width
    },
    _type == "imagePairBlock" => {
      _key,
      _type,
      leftImage,
      leftAlt,
      rightImage,
      rightAlt
    },
    _type == "mixedImagePairBlock" => {
      _key,
      _type,
      landscapeImage,
      landscapeAlt,
      nonLandscapeImage,
      nonLandscapeAlt,
      nonLandscapeFormat,
      landscapePosition
    }
  }
`;

// Full project payload for the detail page: listing fields + page-builder content.
const DETAIL_FIELDS = `
  ${LIST_FIELDS},
  ${CONTENT_FIELDS}
`;

export const FEATURED_PROJECT_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(_createdAt desc) [0] {
    ${LIST_FIELDS}
  }
`);

export const ALL_PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(_createdAt desc) {
    ${LIST_FIELDS}
  }
`);

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(_createdAt desc) {
    ${LIST_FIELDS}
  }
`);

export const PROJECT_PAGE_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    ${DETAIL_FIELDS}
  }
`);

export async function getFeaturedProject(): Promise<Project | null> {
  const result = await sanityFetch({
    query: FEATURED_PROJECT_QUERY,
    tags: ["project"],
  });

  return result.data as Project | null;
}

export async function getAllProjects(): Promise<Project[]> {
  const result = await sanityFetch({
    query: ALL_PROJECTS_QUERY,
    tags: ["project"],
  });

  return result.data as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const result = await sanityFetch({
    query: FEATURED_PROJECTS_QUERY,
    tags: ["project"],
  });

  return result.data as Project[];
}

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    brandLine,
    nav[]{ label, href },
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
