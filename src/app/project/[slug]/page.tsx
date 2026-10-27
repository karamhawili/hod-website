import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PortableText,
  toPlainText,
  type PortableTextComponents,
} from "next-sanity";
import { pageMetadata } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/live";
import { PROJECT_DETAIL_QUERY } from "@/sanity/lib/queries";
import type { PROJECT_DETAIL_QUERY_RESULT } from "@/sanity/sanity.types";
import CloseButton from "./_components/CloseButton/CloseButton";
import Gallery from "./_components/Gallery/Gallery";
import styles from "./page.module.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

async function getProject(params: ProjectPageProps["params"]) {
  const routeParams = await params;
  const result = await sanityFetch({
    query: PROJECT_DETAIL_QUERY,
    params: routeParams,
    tags: ["project"],
  });
  return result.data as PROJECT_DETAIL_QUERY_RESULT;
}

// Search/preview snippet: the description's opening, cut at a word boundary to
// fit the ~160-char limit; projects without copy fall back to their meta line.
function metaDescription(project: NonNullable<PROJECT_DETAIL_QUERY_RESULT>) {
  const text = project.description
    ? toPlainText(project.description).replace(/\s+/g, " ").trim()
    : "";
  if (!text) {
    return [project.title, project.location, project.year]
      .filter(Boolean)
      .join(" — ");
  }
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params);
  if (!project) return {};

  return pageMetadata({
    title: project.title ?? undefined,
    description: metaDescription(project),
    path: `/project/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params);

  if (!project) {
    notFound();
  }

  return (
    <main className={`theme-redesign ${styles.page}`}>
      <CloseButton />

      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        {project.location && (
          <p className={styles.meta}>{project.location}</p>
        )}
        {project.year && <p className={styles.meta}>{project.year}</p>}

        {project.description && (
          <div className={styles.description}>
            <PortableText
              value={project.description}
              components={portableTextComponents}
            />
          </div>
        )}

        {project.credits && (
          <footer className={styles.credits}>
            <span className={styles.creditsRule} aria-hidden="true" />
            <p>{project.credits}</p>
          </footer>
        )}
      </header>

      <Gallery gallery={project.gallery ?? []} title={project.title} />
    </main>
  );
}
