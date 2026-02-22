import { notFound } from "next/navigation";
import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import PageBuilder from "@/components/PageBuilder/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_PAGE_QUERY } from "@/sanity/lib/queries";
import styles from "./page.module.css";

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
      <section className={styles.meta}>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.details}>
          {project.location} • {project.year}
        </p>
      </section>
      <Footer showGradient={false} />
    </>
  );
}
