import Navigation from "@/components/Navigation/Navigation";
import {
  getAllViewerProjects,
  getViewerProjects,
} from "@/sanity/lib/queries";
import ProjectViewer from "./_components/ProjectViewer/ProjectViewer";

export default async function Home() {
  // Featured projects drive the rotation; fall back to all projects so the
  // landing never renders blank while nothing is marked featured.
  let projects = await getViewerProjects();
  if (projects.length === 0) {
    projects = await getAllViewerProjects();
  }

  return (
    <>
      <Navigation />
      <main className="theme-redesign">
        <ProjectViewer projects={projects} />
      </main>
    </>
  );
}
