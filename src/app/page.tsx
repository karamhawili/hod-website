import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import { getHomePage, getLatestProjectCards } from "@/sanity/lib/queries";
import HomeHero from "./_components/HomeHero/HomeHero";
import IntroStatement from "./_components/IntroStatement/IntroStatement";
import ProjectsFeed from "./_components/ProjectsFeed/ProjectsFeed";
import Showcase from "./_components/Showcase/Showcase";
import StudioFeed from "./_components/StudioFeed/StudioFeed";

export default async function Home() {
  const home = await getHomePage();

  // The query itself falls back to the latest projects when the singleton
  // exists with no picks; this extra fetch only runs before the Home Page
  // document has been created at all.
  const projects =
    home?.projectsSection?.projects?.length
      ? home.projectsSection.projects
      : await getLatestProjectCards();

  const showcaseProject = home?.showcase?.project ?? projects[0] ?? null;

  return (
    <>
      <Navigation theme="light" />
      <main className="theme-redesign">
        <HomeHero home={home} />
        <IntroStatement text={home?.introStatement} />
        <ProjectsFeed
          label={home?.projectsSection?.label}
          heading={home?.projectsSection?.heading}
          body={home?.projectsSection?.body}
          image={home?.projectsSection?.image}
          projects={projects}
        />
        <StudioFeed
          label={home?.studioSection?.label}
          heading={home?.studioSection?.heading}
          body={home?.studioSection?.body}
          image={home?.studioSection?.image}
          cards={home?.studioSection?.cards}
          mentions={home?.studioSection?.mentions}
        />
        <Showcase project={showcaseProject} image={home?.showcase?.image} />
      </main>
      <Footer />
    </>
  );
}
