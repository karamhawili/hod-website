import { notFound } from "next/navigation";
import Link from "next/link";
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

  const hasContent =
    Array.isArray(project.content) && project.content.length > 0;

  return (
    <>
      <Navigation theme={hasContent ? "light" : "default"} />
      {hasContent ? (
        <PageBuilder content={project.content} />
      ) : (
        <main className={styles.emptyState}>
          <div className={styles.emptyContent}>
            <h1 className={styles.emptyTitle}>No content yet</h1>
            <p className={styles.emptyText}>
              Edit this project in Sanity Studio to add page content.
            </p>
            <div className={styles.actions}>
              <Link href="/studio" className={styles.studioButton}>
                Go to Studio
              </Link>
              <Link href="/portfolio" className={styles.backLink}>
                Go to Portfolio
              </Link>
            </div>
          </div>
        </main>
      )}
      <Footer showGradient={true} />
    </>
  );
}
