import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { Project } from "@/types/sanity";

const PROJECT_FIELDS = `
  _id,
  title,
  slug,
  coverImage,
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
      description
    },
    _type == "imageDetailsLeftBlock" => {
      _key,
      _type,
      image,
      imageAlt,
      title,
      subtitle,
      description
    },
    _type == "fullLandscapeImageBlock" => {
      _key,
      _type,
      image,
      alt
    },
    _type == "compactLandscapeImageBlock" => {
      _key,
      _type,
      image,
      alt
    },
    _type == "halfSquareImageBlock" => {
      _key,
      _type,
      image,
      alt
    },
    _type == "centeredTextBlock" => {
      _key,
      _type,
      title,
      description
    },
    _type == "twinImagesBlock" => {
      _key,
      _type,
      leftImage,
      leftAlt,
      rightImage,
      rightAlt
    },
    _type == "offsetLandscapeSquareBlock" => {
      _key,
      _type,
      leftImage,
      leftAlt,
      rightImage,
      rightAlt
    }
  },
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

export const FEATURED_PROJECT_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(_createdAt desc) [0] {
    ${PROJECT_FIELDS}
  }
`);

export const ALL_PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(_createdAt desc) {
    ${PROJECT_FIELDS}
  }
`);

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(_createdAt desc) {
    ${PROJECT_FIELDS}
  }
`);

export const PROJECT_PAGE_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    ${PROJECT_FIELDS}
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
