"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { ARCHIVE_PROJECTS_QUERY_RESULT } from "@/sanity/sanity.types";
import ArchiveGrid from "../ArchiveGrid/ArchiveGrid";
import styles from "./ArchiveExplorer.module.css";

interface ArchiveExplorerProps {
  projects: ARCHIVE_PROJECTS_QUERY_RESULT;
  // Restores the search when returning from a project (via ?q= on the URL).
  initialQuery?: string;
}

// Search is deliberately NOT debounced: the catalog is already in memory
// (one server fetch), so each keystroke is a synchronous substring match over
// a small array — there's no async work to coalesce, and a debounce would
// only delay feedback. useDeferredValue keeps the input echo instant if the
// list ever grows large enough for filtering to become noticeable.
export default function ArchiveExplorer({
  projects,
  initialQuery = "",
}: ArchiveExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  // The archive URL for the current search — `/archive` or `/archive?q=…`.
  // Doubles as (a) the return URL each project link carries, and (b) the live
  // address-bar value below.
  const returnTo =
    "/archive" +
    (query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "");

  // Keep the URL in sync with the search live while typing, so a refresh or a
  // shared/bookmarked link preserves it. `replaceState` (not the Next router)
  // is deliberate: it updates the address bar without a navigation or a server
  // refetch of the project list on every keystroke. Skip the first run so the
  // load URL (which may already carry ?q=) is left untouched.
  const firstSync = useRef(true);
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false;
      return;
    }
    window.history.replaceState(null, "", returnTo);
  }, [returnTo]);

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
      <div className={styles.searchRow}>
        <input
          type="search"
          className={styles.search}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search projects by title, category, location or year"
        />
        {query ? (
          <button
            type="button"
            className={styles.clear}
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : (
          <span className={styles.hint} aria-hidden="true">
            Search
          </span>
        )}
      </div>

      {searching && filtered.length === 0 ? (
        <p className={styles.noMatches}>No matches.</p>
      ) : (
        <ArchiveGrid projects={filtered} returnTo={returnTo} />
      )}

      <p className={styles.srStatus} role="status" aria-live="polite">
        {searching ? `${filtered.length} projects match` : ""}
      </p>
    </div>
  );
}
