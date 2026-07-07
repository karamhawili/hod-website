import Image from "next/image";
import styles from "./Hero.module.css";

// Interim Phase-4 hero: full-bleed photo, k-studio style — logo/nav live in
// the global header. Media becomes CMS-driven with the homePage singleton.
export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/sof.jpeg"
        alt="House of Design interior"
        fill
        priority
        sizes="100vw"
        quality={80}
        className={styles.image}
      />
    </section>
  );
}
