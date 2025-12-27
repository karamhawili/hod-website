"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedProject.module.css";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FeaturedProjectProps {
  project: Project;
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${isVisible ? "visible" : ""}`}
    >
      <div className={styles.textContent}>
        <p className={styles.description}>
          House of Design is a leading design studio – shaping some of the
          world’s most exceptional and stylish environments.
        </p>
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src={urlFor(project.coverImage).url() || ""}
          alt={project.title}
          width={1034}
          height={483}
          quality={100}
          className={styles.image}
        />
      </div>

      <Link href={`/projects/${project.slug.current}`} className={styles.link}>
        VIEW PROJECT
      </Link>
    </section>
  );
}
