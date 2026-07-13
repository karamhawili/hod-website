import Image from "next/image";
import Reveal from "@/components/Reveal/Reveal";
import { urlForSized } from "@/sanity/lib/image";
import type { StudioPage } from "@/types/sanity";
import styles from "./StudioDisciplines.module.css";

// Placeholder content until the client fills the studioPage singleton — lists
// from the old about page's Sectors/Services section.
const DEFAULTS = {
  image: "/about/grid-03.jpg",
  secondaryImage: "/about/wwu-left.png",
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

// Intentionally contained interlude: a wide image with a small offset portrait
// beside it, then a short text and the sectors/services lists — all left
// aligned within the narrower container.
export default function StudioDisciplines({
  disciplines,
}: StudioDisciplinesProps) {
  const imageUrl = disciplines?.image
    ? urlForSized(disciplines.image, 1400)
    : DEFAULTS.image;
  const secondaryImageUrl = disciplines?.secondaryImage
    ? urlForSized(disciplines.secondaryImage, 800)
    : DEFAULTS.secondaryImage;

  const sectors = disciplines?.sectors?.length
    ? disciplines.sectors
    : DEFAULTS.sectors;
  const services = disciplines?.services?.length
    ? disciplines.services
    : DEFAULTS.services;

  return (
    <section className={styles.section}>
      <div className={styles.media}>
        <Reveal className={styles.mainMedia}>
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            quality={90}
            className={styles.img}
          />
        </Reveal>
        <Reveal className={styles.portraitMedia}>
          <Image
            src={secondaryImageUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            quality={90}
            className={styles.img}
          />
        </Reveal>
      </div>

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
