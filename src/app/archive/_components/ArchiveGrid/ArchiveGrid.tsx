import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { ARCHIVE_PROJECTS_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./ArchiveGrid.module.css";

interface ArchiveGridProps {
  projects: ARCHIVE_PROJECTS_QUERY_RESULT;
}

// Sparse thumbnail grid per the reference: fixed column width, native-ratio
// height, one-line caption ("Title, Location, Status"), no card chrome.
export default function ArchiveGrid({ projects }: ArchiveGridProps) {
  if (projects.length === 0) {
    return <p className={styles.empty}>No projects yet.</p>;
  }

  return (
    <ul className={styles.grid}>
      {projects.map((project) => {
        const caption = [project.title, project.location, project.status]
          .filter(Boolean)
          .join(", ");

        return (
          <li key={project._id}>
            <Link href={`/project/${project.slug}`} className={styles.cell}>
              {project.thumb?.asset && (
                <Image
                  src={urlFor(project.thumb).width(800).auto("format").url()}
                  alt={project.thumb.alt ?? project.title}
                  width={project.thumb.dimensions?.width ?? 800}
                  height={project.thumb.dimensions?.height ?? 600}
                  sizes="(max-width: 899px) 44vw, 15vw"
                  className={styles.thumb}
                  placeholder={project.thumb.lqip ? "blur" : undefined}
                  blurDataURL={project.thumb.lqip ?? undefined}
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
