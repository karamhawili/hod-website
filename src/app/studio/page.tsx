import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { pageMetadata } from "@/lib/site";
import { getStudioPage } from "@/sanity/lib/queries";
import StudioDisciplines, {
  hasDisciplinesContent,
} from "./_components/StudioDisciplines/StudioDisciplines";
import StudioFounder, {
  hasFounderContent,
} from "./_components/StudioFounder/StudioFounder";
import StudioIntro, {
  hasIntroContent,
} from "./_components/StudioIntro/StudioIntro";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Studio",
  description:
    "The studio, its founder Suzy Habre, and the disciplines behind House of Design.",
  path: "/studio",
});

export default async function StudioPage() {
  const studio = await getStudioPage();
  // The hairline divides the founder from the firm sections — only drawn when
  // there's content on both sides of it.
  const showSeparator =
    hasFounderContent(studio?.founder) &&
    (hasIntroContent(studio?.intro) ||
      hasDisciplinesContent(studio?.disciplines));

  return (
    <>
      <Navigation />
      <main className={`theme-redesign rail-offset ${styles.page}`}>
        <StudioFounder founder={studio?.founder} />
        {showSeparator && <hr className={styles.separator} />}
        <StudioIntro intro={studio?.intro} />
        <StudioDisciplines disciplines={studio?.disciplines} />
      </main>
    </>
  );
}
