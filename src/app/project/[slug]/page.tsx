import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PortableText,
  toPlainText,
  type PortableTextComponents,
} from "next-sanity";
import { pageMetadata } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";
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
    return [project.title?.trim(), project.location, project.year]
      .filter(Boolean)
      .join(" — ");
  }
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

// Link-preview image: the first gallery image in page order (a pair/trio
// contributes its first member — same flattening as the landing viewer),
// cropped to 1200×630 on the CDN around the editor's hotspot. JPG because
// some preview crawlers reject WebP/AVIF.
function ogImage(project: NonNullable<PROJECT_DETAIL_QUERY_RESULT>) {
  const first = (project.gallery ?? [])
    .map((block) => (block._type === "image" ? block : block.images?.[0]))
    .find((image) => image?.asset);
  if (!first) return undefined;

  return {
    url: urlFor(first).width(1200).height(630).fit("crop").format("jpg").url(),
    width: 1200,
    height: 630,
    alt: first.alt ?? project.title?.trim() ?? "",
  };
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params);
  if (!project) return {};

  return pageMetadata({
    title: project.title?.trim(),
    description: metaDescription(project),
    path: `/project/${project.slug}`,
    image: ogImage(project),
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
