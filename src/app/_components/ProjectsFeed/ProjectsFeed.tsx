import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal/Reveal";
import { urlForSized } from "@/sanity/lib/image";
import type { ProjectCard, SanityImage } from "@/types/sanity";
import FeedCard from "../FeedCard/FeedCard";
import styles from "./ProjectsFeed.module.css";

const DEFAULTS = {
  label: "Selected Work",
  heading: "Spaces with character",
  body: "A selection of recent projects across private residences, restaurants, lounges and beaches.",
  stickyImage: "/about-image.png", // placeholder until set in the CMS
};

const ASPECTS = ["landscape", "portrait", "square"] as const;

interface ProjectsFeedProps {
  label?: string;
  heading?: string;
  body?: string;
  image?: SanityImage;
  projects: ProjectCard[];
}

// Left column sticky editorial text (with an image at its bottom), right
// column staggered scrolling feed of project cards.
export default function ProjectsFeed({
  label,
  heading,
  body,
  image,
  projects,
}: ProjectsFeedProps) {
  if (!projects.length) return null;

  const stickyImageUrl = image
    ? urlForSized(image, 1000)
    : DEFAULTS.stickyImage;

  return (
    <section className={styles.section}>
      <div className={styles.stickyCol}>
        <div className={styles.stickyInner}>
          <p className={styles.label}>{label || DEFAULTS.label}</p>
          <h2 className={styles.heading}>{heading || DEFAULTS.heading}</h2>
          <p className={styles.body}>{body || DEFAULTS.body}</p>
          <Link href="/portfolio" className={styles.cta}>
            View Portfolio
          </Link>
          <div className={styles.stickyMedia}>
            <Image
              src={stickyImageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={styles.stickyImg}
            />
          </div>
        </div>
      </div>

      <div className={styles.feed}>
        {projects.map((project, index) => (
          <Reveal key={project._id} className={styles.card}>
            <FeedCard
              src={urlForSized(project.coverImage, 2000)}
              alt={project.title}
              meta={`${project.location} — ${project.year}`}
              title={project.title}
              description={project.excerpt}
              href={`/project/${project.slug}`}
              aspect={ASPECTS[index % 3]}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
