import { splitParagraphs } from "@/lib/splitParagraphs";
import type { STUDIO_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "../studio.module.css";

const DEFAULTS = {
  heading: "House of Design is an interior design studio rooted in Beirut",
  body: "We create spaces inspired by the emotions we’ve experienced, so you can step inside, live the moment, and leave with emotions of your own.\n\nOur designs bring beauty and practicality together, transforming every space into a reflection of the people who live in it — from first sketch to final detail.",
};

interface StudioIntroProps {
  intro?: NonNullable<STUDIO_PAGE_QUERY_RESULT>["intro"];
}

// The firm description — text only.
export default function StudioIntro({ intro }: StudioIntroProps) {
  const paragraphs = splitParagraphs(intro?.body || DEFAULTS.body);

  return (
    <section className={styles.section}>
      <div className={styles.text}>
        <h2 className={styles.heading}>{intro?.heading || DEFAULTS.heading}</h2>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.body}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
