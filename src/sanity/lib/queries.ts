import { sanityFetch } from "@/sanity/lib/live";
import { Project } from "@/types/sanity";

export async function getFeaturedProject() {
  const { data: projects } = await sanityFetch({
    query: `
      *[_type == "project"] | order(_createdAt desc) [0] {
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        category
      }
    `,
    tags: ["project"],
  });

  return projects[0] as Project;
}

export async function getAllProjects() {
  const { data: projects } = await sanityFetch({
    query: `
      *[_type == "project"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        coverImage,
        category
      }
    `,
    tags: ["project"],
  });

  return projects as Project[];
}
