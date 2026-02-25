"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import { renderProjectTitle } from "@/lib/renderProjectTitle";
import styles from "./ProjectsGrid.module.css";

interface ProjectsGridProps {
  projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const categories = useMemo(() => {
    const categoriesBySlug = new Map<string, string>();

    projects.forEach((project) => {
      project.categories?.forEach((category) => {
        if (!category?.slug || !category?.title) return;
        categoriesBySlug.set(category.slug, category.title);
      });
    });

    const preferredOrder = [
      "private-residential",
      "restaurants",
      "lounges",
      "beaches",
    ];

    const sorted = Array.from(categoriesBySlug.entries()).sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a[0]);
      const bIndex = preferredOrder.indexOf(b[0]);
      const aPreferred = aIndex !== -1;
      const bPreferred = bIndex !== -1;

      if (aPreferred && bPreferred) return aIndex - bIndex;
      if (aPreferred) return -1;
      if (bPreferred) return 1;

      return a[1].localeCompare(b[1]);
    });

    return [
      { label: "All", value: null as string | null },
      ...sorted.map(([slug, title]) => ({ label: title, value: slug })),
    ];
  }, [projects]);

  // Filter projects by category
  const filteredProjects = activeFilter
    ? projects.filter((p) =>
        p.categories?.some(
          (category) =>
            category.slug.toLowerCase() === activeFilter.toLowerCase(),
        ),
      )
    : projects;

  // Sort by year (newest first)
  const sortedProjects = [...filteredProjects].sort((a, b) => b.year - a.year);

  return (
    <Section background="gradient" animate={false}>
      <Section.Header>
        <Section.Title>Portfolio</Section.Title>
      </Section.Header>

      {/* Filters */}
      <div className={styles.filterWrapper}>
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveFilter(cat.value)}
              className={`${styles.filterButton} ${
                activeFilter === cat.value ? styles.active : ""
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <Section.Content hasMaxWidth={false}>
        <div className={styles.grid}>
          {sortedProjects.map((project, index) => (
            <Link
              href={`/project/${project.slug.current}`}
              key={project._id}
              className={`${styles.gridItem} animate-popIn animate-delay-${Math.min(index * 100, 1000)}`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={urlFor(project.coverImage).url() || ""}
                  alt={project.title}
                  width={600}
                  height={800}
                  quality={90}
                  className={styles.image}
                />
                <div
                  className={`${styles.overlay} ${project.overlayTextColor === "dark" ? styles.darkText : styles.lightText}`}
                >
                  <span className={styles.year}>{project.year}</span>
                  <h3
                    className={`${styles.title} ${
                      project.formattedTitle?.length ? styles.formattedTitle : ""
                    }`}
                  >
                    {renderProjectTitle(project.title, project.formattedTitle)}
                  </h3>
                  <span className={styles.location}>{project.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {sortedProjects.length === 0 && (
          <div className={styles.emptyState}>
            <p>No projects found in this category.</p>
          </div>
        )}
      </Section.Content>
    </Section>
  );
}
