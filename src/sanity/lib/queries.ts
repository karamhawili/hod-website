import { sanityFetch } from "@/sanity/lib/live";
import { Project } from "@/types/sanity";

export async function getFeaturedProject(): Promise<Project | null> {
  const result = await sanityFetch({
    query: `
      *[_type == "project" && featured == true] | order(_createdAt desc) [0] {
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        "location": coalesce(location, category),
        categories[]->{
          _id,
          title,
          "slug": slug.current
        },
        year,
        featured,
        overlayTextColor
      }
    `,
    tags: ["project"],
  });

  return result.data as Project | null;
}

export async function getAllProjects(): Promise<Project[]> {
  const result = await sanityFetch({
    query: `
      *[_type == "project"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        "location": coalesce(location, category),
        categories[]->{
          _id,
          title,
          "slug": slug.current
        },
        year,
        featured,
        overlayTextColor
      }
    `,
    tags: ["project"],
  });

  return result.data as Project[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const result = await sanityFetch({
    query: `
      *[_type == "project" && featured == true] | order(_createdAt desc) {
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        "location": coalesce(location, category),
        categories[]->{
          _id,
          title,
          "slug": slug.current
        },
        year,
        featured,
        overlayTextColor
      }
    `,
    tags: ["project"],
  });

  return result.data as Project[];
}
