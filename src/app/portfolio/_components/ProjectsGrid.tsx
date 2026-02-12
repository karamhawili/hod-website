"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./ProjectsGrid.module.css";

interface ProjectsGridProps {
  projects: Project[];
}

const categories = [
  { label: "All", value: null },
  { label: "Restaurants", value: "restaurants" },
  { label: "Lounges", value: "lounges" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Hospitality", value: "hospitality" },
];

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Filter projects by category
  const filteredProjects = activeFilter
    ? projects.filter(
        (p) => p.category?.toLowerCase() === activeFilter.toLowerCase(),
      )
    : projects;

  // Sort by year (newest first)
  const sortedProjects = [...filteredProjects].sort((a, b) => b.year - a.year);

  return (
    <Section background="gradient">
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
              href={`/projects/${project.slug.current}`}
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
                  <h3 className={styles.title}>{project.title}</h3>
                  <span className={styles.category}>{project.category}</span>
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
