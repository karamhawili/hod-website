import AboutSection from "@/components/AboutSection/AboutSection";
import FeaturedProject from "@/components/FeaturedProject/FeaturedProject";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import InstagramGrid from "@/components/InstagramGrid/InstagramGrid";
import LatestProjects from "@/components/LatestProjects/LatestProjects";
import Navigation from "@/components/Navigation/Navigation";
import Recognition from "@/components/Recognition/Recognition";
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

  return projects[0] as Project;
}

async function getAllProjects() {
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

export default async function Home() {
  const featuredProject = await getFeaturedProject();
  const allProjects = await getAllProjects();

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        {featuredProject && <FeaturedProject project={featuredProject} />}
        {allProjects && <LatestProjects projects={allProjects} />}
        <AboutSection />
        <InstagramGrid />
        <Recognition />
      </main>
      <Footer />
    </>
  );
}
