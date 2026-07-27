import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { getStudioPage } from "@/sanity/lib/queries";
import StudioDisciplines from "./_components/StudioDisciplines/StudioDisciplines";
import StudioFounder from "./_components/StudioFounder/StudioFounder";
import StudioIntro from "./_components/StudioIntro/StudioIntro";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Studio — House of Design",
};

export default async function StudioPage() {
  const studio = await getStudioPage();

  return (
    <>
      <Navigation />
      <main className={`theme-redesign rail-offset ${styles.page}`}>
        <StudioFounder founder={studio?.founder} />
        <hr className={styles.separator} />
        <StudioIntro intro={studio?.intro} />
        <StudioDisciplines disciplines={studio?.disciplines} />
      </main>
    </>
  );
}
