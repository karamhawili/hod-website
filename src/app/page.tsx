import FeaturedProject from "@/components/FeaturedProject/FeaturedProject";
import Hero from "@/components/Hero/Hero";
import Navigation from "@/components/Navigation/Navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { Project } from "@/types/sanity";

async function getFeaturedProject() {
  const { data: projects } = await sanityFetch({
    query: `
      *[_type == "project"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        coverImage,
        excerpt
      }
    `,
    tags: ["project"],
  });

  return projects[0] as Project; // Return first project from array
}

export default async function Home() {
  const featuredProject = await getFeaturedProject();

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        {featuredProject && <FeaturedProject project={featuredProject} />}
      </main>
    </>
  );
}
