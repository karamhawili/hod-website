import Reveal from "@/components/Reveal/Reveal";
import type { StudioPage } from "@/types/sanity";
import styles from "./StudioDisciplines.module.css";

// Placeholder lists until the client fills the studioPage singleton — from
// the old about page's Sectors/Services section.
const DEFAULTS = {
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
  disciplines?: StudioPage["disciplines"];
}

// Sectors and services as two hairline-ruled lists — the text-only index
// language from the landing's press list.
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
      <Reveal>
        <p className={styles.body}>{disciplines?.body || DEFAULTS.body}</p>
      </Reveal>

      <div className={styles.columns}>
        <Reveal>
          <p className={styles.label}>Sectors</p>
          <ul className={styles.list}>
            {sectors.map((sector) => (
              <li key={sector} className={styles.row}>
                {sector}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <p className={styles.label}>Services</p>
          <ul className={styles.list}>
            {services.map((service) => (
              <li key={service} className={styles.row}>
                {service}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
