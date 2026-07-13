import Image from "next/image";
import { urlForSized } from "@/sanity/lib/image";
import type { HomePage } from "@/types/sanity";
import styles from "./HomeHero.module.css";

interface HomeHeroProps {
  home: HomePage | null;
}

// Full-bleed hero. CMS video plays muted/looping over the CMS image as
// poster; with no video the image renders alone. Falls back to the interim
// local photo until the Home Page document is populated.
export default function HomeHero({ home }: HomeHeroProps) {
  const imageUrl = home?.heroImage
    ? urlForSized(home.heroImage, 2400)
    : "/sof.jpeg";

  return (
    <section className={styles.hero}>
      {home?.heroVideoUrl ? (
        <video
          className={styles.video}
          src={home.heroVideoUrl}
          poster={imageUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <Image
          src={imageUrl}
          alt="House of Design interior"
          fill
          priority
          sizes="100vw"
          quality={80}
          className={styles.image}
        />
      )}
    </section>
  );
}
