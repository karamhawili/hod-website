import Navigation from "@/components/Navigation/Navigation";
import { getViewerProjects } from "@/sanity/lib/queries";
import ProjectViewer from "./_components/ProjectViewer/ProjectViewer";

type HomeProps = {
  // The rail's category links filter the rotation via ?category=<slug>;
  // ?project=<slug> restores the viewer to a project when returning from it.
  searchParams: Promise<{ category?: string; project?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { category, project } = await searchParams;
  const projects = await getViewerProjects(category);

  return (
    <>
      <Navigation activeCategory={category} />
      <main className="theme-redesign">
        {/* Key by category so switching filters remounts the viewer fresh —
            otherwise its stale projectIndex can point past the shorter list
            and fall through to the empty state. */}
        <ProjectViewer
          key={category ?? "all"}
          projects={projects}
          category={category}
          initialSlug={project}
        />
      </main>
    </>
  );
}
