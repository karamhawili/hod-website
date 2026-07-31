"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);

  // The archive URL for the current search — `/archive` or `/archive?q=…`.
  // Doubles as (a) the return URL each project link carries, and (b) the live
  // address-bar value below.
  const returnTo =
    "/archive" +
    (query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "");

  // Keep the URL in sync with the search, so refresh / shared links AND the
  // browser/mobile BACK button all restore it. This goes through the Next
  // router (not raw `history.replaceState`) on purpose: replaceState isn't
  // tracked by the App Router, so its URL wasn't kept in history/cache and
  // back returned to a bare `/archive`. `router.replace` records the entry
  // properly (and, since `getArchiveProjects` is query-independent, re-renders
  // with the same list — only `initialQuery` changes). Debounced (trailing) so
  // instant local filtering isn't a soft-nav per keystroke; the load URL is
  // skipped. `scroll: false` keeps the scroll position.
  const firstSync = useRef(true);
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false;
      return;
    }
    const id = setTimeout(() => {
      router.replace(returnTo, { scroll: false });
    }, 300);
    return () => clearTimeout(id);
  }, [returnTo, router]);

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
