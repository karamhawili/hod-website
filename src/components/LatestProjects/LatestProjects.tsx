"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./LatestProjects.module.css";

interface LatestProjectsProps {
  showLogo?: boolean;
  showAction?: boolean;
  hasMaxWidth?: boolean;
  projects: Project[];
}

export default function LatestProjects({
  showLogo = false,
  showAction = true,
  hasMaxWidth = true,
  projects,
}: LatestProjectsProps) {
  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => b.year - a.year),
    [projects],
  );

  const locations = useMemo(
    () =>
      sortedProjects.reduce<string[]>((acc, project) => {
        const location = project.category?.trim();

        if (!location) return acc;
        if (
          acc.some(
            (existing) => existing.toLowerCase() === location.toLowerCase(),
          )
        )
          return acc;

        acc.push(location);
        return acc;
      }, []),
    [sortedProjects],
  );

  const [activeLocation, setActiveLocation] = useState<string | null>(
    locations[0] ?? null,
  );

  const selectedLocation =
    activeLocation &&
    locations.some(
      (location) => location.toLowerCase() === activeLocation.toLowerCase(),
    )
      ? activeLocation
      : (locations[0] ?? null);

  // Filter projects by location if active filter is set
  const filteredProjects = selectedLocation
    ? sortedProjects.filter(
        (p) => p.category?.toLowerCase() === selectedLocation.toLowerCase(),
      )
    : sortedProjects;

  // Get the most recent project to display
  const featuredProject =
    filteredProjects.length > 0 ? filteredProjects[0] : null;

  return (
    <Section
      background="white"
      animate={false}
      className={showLogo ? styles.sectionWithLogo : ""}
    >
      {showLogo && (
        <div className={styles.logo}>
          <Image
            src="/logo.svg"
            alt="House of Design"
            width={200}
            height={88}
          />
        </div>
      )}

      <Section.Header>
        <Section.Title>LATEST PROJECTS</Section.Title>
      </Section.Header>

      {/* Location Filter */}
      <div className={styles.filterWrapper}>
        <div className={styles.filters}>
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => {
                const isActive =
                  selectedLocation?.toLowerCase() === location.toLowerCase();
                setActiveLocation(isActive ? null : location);
              }}
              className={`${styles.filterButton} ${
                selectedLocation?.toLowerCase() === location.toLowerCase()
                  ? styles.active
                  : ""
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Project Image */}
      {featuredProject && (
        <Section.Content hasMaxWidth={hasMaxWidth}>
          <div className={styles.projectWrapper}>
            <Image
              src={urlFor(featuredProject.coverImage).url() || ""}
              alt={featuredProject.title}
              width={1034}
              height={483}
              quality={100}
              className={styles.projectImage}
            />
            <div className={styles.projectOverlay}>
              <h3 className={styles.projectTitle}>{featuredProject.title}</h3>
            </div>
          </div>
        </Section.Content>
      )}

      {showAction && (
        <Section.Action>
          <Link href="/portfolio" className={styles.link}>
            VIEW PORTFOLIO
          </Link>
        </Section.Action>
      )}
    </Section>
  );
}
