"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./LatestProjects.module.css";

interface LatestProjectsProps {
  projects: Project[];
}

const locations = ["Beirut", "Dubai", "Abu Dhabi", "Cairo", "Doha", "Riyadh"];

export default function LatestProjects({ projects }: LatestProjectsProps) {
  const [activeLocation, setActiveLocation] = useState<string | null>(
    locations[0],
  );

  // Filter projects by location if active filter is set
  const filteredProjects = activeLocation
    ? projects.filter(
        (p) => p.category?.toLowerCase() === activeLocation.toLowerCase(),
      )
    : projects;

  // Get the most recent project to display
  const featuredProject =
    filteredProjects.length > 0 ? filteredProjects[0] : null;

  return (
    <Section background="white" animate={false}>
      <Section.Header>
        <Section.Title>LATEST PROJECTS</Section.Title>
      </Section.Header>

      {/* Location Filter */}
      <div className={styles.filterWrapper}>
        <div className={styles.filters}>
          {locations.map((location) => (
            <button
              key={location}
              onClick={() =>
                setActiveLocation(activeLocation === location ? null : location)
              }
              className={`${styles.filterButton} ${
                activeLocation === location ? styles.active : ""
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Project Image */}
      {featuredProject && (
        <Section.Content>
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

      <Section.Action>
        <Link href="#" className={styles.link}>
          VIEW PORTFOLIO
        </Link>
      </Section.Action>
    </Section>
  );
}
