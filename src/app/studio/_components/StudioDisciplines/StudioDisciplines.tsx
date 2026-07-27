import type { STUDIO_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "../studio.module.css";

const DEFAULTS = {
  heading: "What we do",
  body: "Experts in high-end F&B spaces, we apply our sophisticated interior design skills to restaurants, beaches, lounges, and other exclusive venues, tailoring our expertise to craft exceptional environments throughout the sector.",
  sectors: ["Private Residential", "Restaurants", "Lounges", "Beaches"],
  services: [
    "Architecture",
    "Interior Design",
    "Interior Architecture",
    "Creative Concept",
  ],
};

interface StudioDisciplinesProps {
  disciplines?: NonNullable<STUDIO_PAGE_QUERY_RESULT>["disciplines"];
}

// Sectors we work in / services we offer — text only, two-column lists.
export default function StudioDisciplines({
  disciplines,
}: StudioDisciplinesProps) {
  const sectors = disciplines?.sectors?.length
    ? disciplines.sectors
    : DEFAULTS.sectors;
  const services = disciplines?.services?.length
    ? disciplines.services
    : DEFAULTS.services;

  return (
    <section className={styles.section}>
      <div className={styles.text}>
        <h2 className={styles.heading}>
          {disciplines?.heading || DEFAULTS.heading}
        </h2>
        <p className={styles.body}>{disciplines?.body || DEFAULTS.body}</p>
      </div>

      <div className={styles.lists}>
        <div>
          <p className={styles.listLabel}>Sectors</p>
          <ul className={styles.list}>
            {sectors.map((sector) => (
              <li key={sector} className={styles.row}>
                {sector}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={styles.listLabel}>Services</p>
          <ul className={styles.list}>
            {services.map((service) => (
              <li key={service} className={styles.row}>
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
