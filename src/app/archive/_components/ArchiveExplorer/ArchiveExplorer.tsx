"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { ARCHIVE_PROJECTS_QUERY_RESULT } from "@/sanity/sanity.types";
import ArchiveGrid from "../ArchiveGrid/ArchiveGrid";
import styles from "./ArchiveExplorer.module.css";

interface ArchiveExplorerProps {
  projects: ARCHIVE_PROJECTS_QUERY_RESULT;
}

// Search is deliberately NOT debounced: the catalog is already in memory
// (one server fetch), so each keystroke is a synchronous substring match over
// a small array — there's no async work to coalesce, and a debounce would
// only delay feedback. useDeferredValue keeps the input echo instant if the
// list ever grows large enough for filtering to become noticeable.
export default function ArchiveExplorer({ projects }: ArchiveExplorerProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const haystacks = useMemo(
    () =>
      projects.map((project) =>
        [
          project.title,
          project.location,
          project.status,
          project.category,
          project.year,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase(),
      ),
    [projects],
  );

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    if (!needle) return projects;
    return projects.filter((_, index) => haystacks[index].includes(needle));
  }, [projects, haystacks, deferredQuery]);

  const searching = deferredQuery.trim().length > 0;

  return (
    <div className={styles.explorer}>
      <input
        type="search"
        className={styles.search}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
        aria-label="Search projects by title, category, location or year"
      />

      {searching && filtered.length === 0 ? (
        <p className={styles.noMatches}>No matches.</p>
      ) : (
        <ArchiveGrid projects={filtered} />
      )}

      <p className={styles.srStatus} role="status" aria-live="polite">
        {searching ? `${filtered.length} projects match` : ""}
      </p>
    </div>
  );
}
