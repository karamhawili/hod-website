import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { PROJECT_DETAIL_QUERY } from "@/sanity/lib/queries";
import type { PROJECT_DETAIL_QUERY_RESULT } from "@/sanity/sanity.types";
import CloseButton from "./_components/CloseButton/CloseButton";
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

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProject(params);
  return {
    title: project ? `${project.title} — House of Design` : "House of Design",
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params);

  if (!project) {
    notFound();
  }

  const images = project.images ?? [];

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

      <section className={styles.gallery} aria-label="Project images">
        {images.map(
          (image) =>
            image.asset && (
              <figure key={image._key} className={styles.figure}>
                <Image
                  src={urlFor(image).width(2000).auto("format").url()}
                  alt={image.alt ?? project.title}
                  width={image.dimensions?.width ?? 2000}
                  height={image.dimensions?.height ?? 1333}
                  sizes="(max-width: 899px) 100vw, 62vw"
                  className={styles.image}
                  placeholder={image.lqip ? "blur" : undefined}
                  blurDataURL={image.lqip ?? undefined}
                />
              </figure>
            ),
        )}
      </section>
    </main>
  );
}
