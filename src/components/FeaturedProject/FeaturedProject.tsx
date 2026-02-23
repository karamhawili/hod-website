"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./FeaturedProject.module.css";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";

interface FeaturedProjectProps {
  project: Project;
}

export default function FeaturedProject({ project }: FeaturedProjectProps) {
  const projectHref = `/project/${project.slug.current}`;

  return (
    <Section shadow background="gradient">
      <Section.Header>
        <Section.Description>
          House of Design is a leading design studio – shaping some of the
          world’s most exceptional and stylish environments.
        </Section.Description>
      </Section.Header>

      <Section.Content>
        <Link href={projectHref} aria-label={`View ${project.title} project`}>
          <Image
            src={urlFor(project.coverImage).url() || ""}
            alt={project.title}
            width={1034}
            height={483}
            quality={100}
            className={styles.image}
          />
        </Link>
      </Section.Content>

      <Section.Action>
        <Link href={projectHref} className={styles.link}>
          VIEW PROJECT
        </Link>
      </Section.Action>
    </Section>
  );
}
