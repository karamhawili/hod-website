import Footer from "@/components/Footer/Footer";
import LatestProjects from "@/components/LatestProjects/LatestProjects";
import Navigation from "@/components/Navigation/Navigation";
import { getAllProjects } from "@/sanity/lib/queries";

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
      </main>
      <Footer showGradient={false} />
    </>
  );
}
