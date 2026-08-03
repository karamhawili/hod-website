import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { FALLBACK_BLUR } from "@/lib/blur";
import type { ARCHIVE_PROJECTS_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./ArchiveGrid.module.css";

interface ArchiveGridProps {
  projects: ARCHIVE_PROJECTS_QUERY_RESULT;
  // Return URL carried into each project link (so its close ✕ comes back here,
  // search preserved). Omitted when the grid is used outside the explorer.
  returnTo?: string;
}

// Sparse thumbnail grid per the reference: fixed column width, native-ratio
// height, one-line caption ("Title, Location"), no card chrome.
export default function ArchiveGrid({ projects, returnTo }: ArchiveGridProps) {
  if (projects.length === 0) {
    return <p className={styles.empty}>No projects yet.</p>;
  }

  const fromParam = returnTo ? `?from=${encodeURIComponent(returnTo)}` : "";

  return (
    <ul className={styles.grid}>
      {projects.map((project) => {
        const caption = [project.title, project.location]
          .filter(Boolean)
          .join(", ");

        return (
          <li key={project._id}>
            <Link
              href={`/project/${project.slug}${fromParam}`}
              className={styles.cell}
            >
              {project.thumb?.asset && (
                <Image
                  src={urlFor(project.thumb).width(800).auto("format").url()}
                  alt={project.thumb.alt ?? project.title}
                  width={project.thumb.dimensions?.width ?? 800}
                  height={project.thumb.dimensions?.height ?? 600}
                  sizes="(max-width: 899px) 44vw, 15vw"
                  className={styles.thumb}
                  placeholder="blur"
                  blurDataURL={project.thumb.lqip ?? FALLBACK_BLUR}
                />
              )}
              <span className={styles.caption}>{caption}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
