import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal/Reveal";
import { urlForSized } from "@/sanity/lib/image";
import { renderProjectTitle } from "@/lib/renderProjectTitle";
import type { ProjectCard, SanityImage } from "@/types/sanity";
import styles from "./Showcase.module.css";

interface ShowcaseProps {
  project: ProjectCard | null;
  image?: SanityImage;
}

// The big featured-project card near the end of the page: full-width image,
// text below (label → title → link), per the editorial reference.
export default function Showcase({ project, image }: ShowcaseProps) {
  if (!project) return null;

  const media = image ?? project.coverImage;
  const href = `/project/${project.slug}`;

  return (
    <section className={styles.section}>
      <Reveal className={styles.frame}>
        <Link href={href} className={styles.mediaLink}>
          <div className={styles.media}>
            <Image
              src={urlForSized(media, 2200)}
              alt={project.title}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className={styles.img}
            />
          </div>
        </Link>

        <div className={styles.caption}>
          <p className={styles.label}>Featured Project</p>
          <h2 className={styles.title}>
            {renderProjectTitle(project.title, project.formattedTitle)}
          </h2>
          <p className={styles.meta}>
            {project.location} — {project.year}
          </p>
          <Link href={href} className={styles.cta}>
            View Project
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
