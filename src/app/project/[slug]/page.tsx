import { notFound } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import PageBuilder from "@/components/PageBuilder/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_PAGE_QUERY } from "@/sanity/lib/queries";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const routeParams = await params;
  const { data: project } = await sanityFetch({
    query: PROJECT_PAGE_QUERY,
    params: routeParams,
    tags: ["project"],
  });

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navigation />
      {project.content ? <PageBuilder content={project.content} /> : null}
      <Footer showGradient={false} />
    </>
  );
}
