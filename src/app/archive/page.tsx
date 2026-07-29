import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { getArchiveProjects } from "@/sanity/lib/queries";
import ArchiveExplorer from "./_components/ArchiveExplorer/ArchiveExplorer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Archive — House of Design",
};

type ArchivePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const [projects, { q }] = await Promise.all([
    getArchiveProjects(),
    searchParams,
  ]);

  return (
    <>
      <Navigation />
      <main className={`theme-redesign ${styles.page}`}>
        <ArchiveExplorer projects={projects} initialQuery={q ?? ""} />
      </main>
    </>
  );
}
