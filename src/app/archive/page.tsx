import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { getArchiveProjects } from "@/sanity/lib/queries";
import ArchiveExplorer from "./_components/ArchiveExplorer/ArchiveExplorer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Archive — House of Design",
};

export default async function ArchivePage() {
  const projects = await getArchiveProjects();

  return (
    <>
      <Navigation />
      <main className={`theme-redesign ${styles.page}`}>
        <ArchiveExplorer projects={projects} />
      </main>
    </>
  );
}
