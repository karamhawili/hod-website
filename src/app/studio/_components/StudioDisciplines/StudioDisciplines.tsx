import type { STUDIO_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "../studio.module.css";

type Disciplines = NonNullable<STUDIO_PAGE_QUERY_RESULT>["disciplines"];

interface StudioDisciplinesProps {
  disciplines?: Disciplines;
}

export function hasDisciplinesContent(disciplines?: Disciplines) {
  return Boolean(
    disciplines?.heading ||
      disciplines?.body ||
      disciplines?.sectors?.length ||
      disciplines?.services?.length,
  );
}

// Sectors we work in / services we offer — text only, two-column lists, from
// the CMS (studioPage.disciplines). An empty list hides with its label.
export default function StudioDisciplines({
  disciplines,
}: StudioDisciplinesProps) {
  if (!disciplines || !hasDisciplinesContent(disciplines)) return null;

  const lists = [
    { label: "Sectors", items: disciplines.sectors ?? [] },
    { label: "Services", items: disciplines.services ?? [] },
  ].filter((list) => list.items.length > 0);

  return (
    <section className={styles.section}>
      {(disciplines.heading || disciplines.body) && (
        <div className={styles.text}>
          {disciplines.heading && (
            <h2 className={styles.heading}>{disciplines.heading}</h2>
          )}
          {disciplines.body && (
            <p className={styles.body}>{disciplines.body}</p>
          )}
        </div>
      )}

      {lists.length > 0 && (
        <div className={styles.lists}>
          {lists.map((list) => (
            <div key={list.label}>
              <p className={styles.listLabel}>{list.label}</p>
              <ul className={styles.list}>
                {list.items.map((item) => (
                  <li key={item} className={styles.row}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
