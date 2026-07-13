import Image from "next/image";
import Reveal from "@/components/Reveal/Reveal";
import OutwardIcon from "@/components/icons/OutwardIcon";
import { splitParagraphs } from "@/lib/splitParagraphs";
import { urlForSized } from "@/sanity/lib/image";
import type { StudioPage } from "@/types/sanity";
import styles from "./StudioFounder.module.css";

// Placeholder copy until the client fills the studioPage singleton — from
// the old about page's founder section.
const DEFAULTS = {
  name: "Suzy Habre",
  role: "Founder & CEO, House of Design",
  image: "/about/founder.jpg",
  bio: "Suzy Habre travels the world with a caring heart and a sharp eye for detail — shaped by a life of contrasts, raised and educated among diverse cultures, yet forever marked by her time in Nepal, where she fell deeply in love with nature.\n\nA beacon of bespoke design, Suzy shares with her team a love of excellence and a deep understanding of others — qualities she believes are the foundation of their success.",
  linkLabel: "Read the interview with BUILD",
  linkUrl: "https://www.build-review.com/issues/q2-2020/22/",
};

interface StudioFounderProps {
  founder?: StudioPage["founder"];
}

// Founder portrait left; name, role, bio and an external interview link right.
export default function StudioFounder({ founder }: StudioFounderProps) {
  const imageUrl = founder?.image
    ? urlForSized(founder.image, 1200)
    : DEFAULTS.image;

  const paragraphs = splitParagraphs(founder?.bio || DEFAULTS.bio);
  const linkUrl = founder?.linkUrl || DEFAULTS.linkUrl;
  const linkLabel = founder?.linkLabel || DEFAULTS.linkLabel;

  return (
    <section className={styles.section}>
      <Reveal className={styles.media}>
        <Image
          src={imageUrl}
          alt={founder?.name || DEFAULTS.name}
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          quality={90}
          className={styles.img}
        />
      </Reveal>

      <Reveal className={styles.text}>
        <p className={styles.label}>The Founder</p>
        <h2 className={styles.name}>{founder?.name || DEFAULTS.name}</h2>
        <p className={styles.role}>{founder?.role || DEFAULTS.role}</p>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.bio}>
            {paragraph}
          </p>
        ))}
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {linkLabel}
            <OutwardIcon className={styles.linkArrow} />
          </a>
        )}
      </Reveal>
    </section>
  );
}
