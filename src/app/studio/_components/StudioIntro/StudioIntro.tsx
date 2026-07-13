import Image from "next/image";
import Reveal from "@/components/Reveal/Reveal";
import { splitParagraphs } from "@/lib/splitParagraphs";
import { urlForSized } from "@/sanity/lib/image";
import type { StudioPage } from "@/types/sanity";
import styles from "./StudioIntro.module.css";

// Placeholder copy until the client fills the studioPage singleton — mined
// from the old about page.
const DEFAULTS = {
  heading: "House of Design is an interior design studio rooted in Beirut",
  body: "We create spaces inspired by the emotions we’ve experienced, so you can step inside, live the moment, and leave with emotions of your own.\n\nOur designs bring beauty and practicality together, transforming every space into a reflection of the people who live in it — from first sketch to final detail.",
  image: "/about/wwu-right.jpg",
  secondaryImage: "/about/hero.jpg",
  secondaryBody:
    "Blending heartfelt inspiration with thoughtful design — where beauty, comfort, and connection live together.",
};

interface StudioIntroProps {
  intro?: StudioPage["intro"];
}

// Page opening, per the k-studio reference: statement + paragraphs left with a
// tall image right, then a staggered second row (wide image left, short line
// right).
export default function StudioIntro({ intro }: StudioIntroProps) {
  const mainImageUrl = intro?.image
    ? urlForSized(intro.image, 1600)
    : DEFAULTS.image;
  const secondaryImageUrl = intro?.secondaryImage
    ? urlForSized(intro.secondaryImage, 2000)
    : DEFAULTS.secondaryImage;

  const paragraphs = splitParagraphs(intro?.body || DEFAULTS.body);

  return (
    <section className={styles.section}>
      <Reveal className={styles.textCol}>
        <h1 className={styles.heading}>{intro?.heading || DEFAULTS.heading}</h1>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.body}>
            {paragraph}
          </p>
        ))}
      </Reveal>

      <Reveal className={styles.mainMedia}>
        <Image
          src={mainImageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={90}
          className={styles.img}
          priority
        />
      </Reveal>

      <Reveal className={styles.secondaryMedia}>
        <Image
          src={secondaryImageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={90}
          className={styles.img}
        />
      </Reveal>

      <Reveal className={styles.secondaryText}>
        <p className={styles.secondaryBody}>
          {intro?.secondaryBody || DEFAULTS.secondaryBody}
        </p>
      </Reveal>
    </section>
  );
}
