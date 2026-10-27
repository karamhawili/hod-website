import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { pageMetadata } from "@/lib/site";
import { getArchiveProjects } from "@/sanity/lib/queries";
import ArchiveExplorer from "./_components/ArchiveExplorer/ArchiveExplorer";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Archive",
  description:
    "Every House of Design project — restaurants, beach clubs, lounges and private residences.",
  path: "/archive",
});

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
