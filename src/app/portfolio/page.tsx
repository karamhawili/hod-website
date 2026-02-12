import Footer from "@/components/Footer/Footer";
import LatestProjects from "@/components/LatestProjects/LatestProjects";
import Navigation from "@/components/Navigation/Navigation";
import { getAllProjects } from "@/sanity/lib/queries";
import ProjectsGrid from "./_components/ProjectsGrid";

export default async function Portfolio() {
  const allProjects = await getAllProjects();

  return (
    <>
      <Navigation />
      <main>
        <LatestProjects
          showLogo={true}
          showAction={false}
          projects={allProjects}
          hasMaxWidth={false}
        />
        <ProjectsGrid projects={allProjects} />
      </main>
      <Footer showGradient={false} />
    </>
  );
}
