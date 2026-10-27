import { splitParagraphs } from "@/lib/splitParagraphs";
import type { STUDIO_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "../studio.module.css";

type Intro = NonNullable<STUDIO_PAGE_QUERY_RESULT>["intro"];

interface StudioIntroProps {
  intro?: Intro;
}

export function hasIntroContent(intro?: Intro) {
  return Boolean(intro?.heading || intro?.body);
}

// The firm description — text only, from the CMS (studioPage.intro).
export default function StudioIntro({ intro }: StudioIntroProps) {
  if (!intro || !hasIntroContent(intro)) return null;

  const paragraphs = intro.body ? splitParagraphs(intro.body) : [];

  return (
    <section className={styles.section}>
      <div className={styles.text}>
        {intro.heading && <h2 className={styles.heading}>{intro.heading}</h2>}
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.body}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
