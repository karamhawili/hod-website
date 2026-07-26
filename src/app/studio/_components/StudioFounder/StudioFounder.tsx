import NativeImage from "@/components/NativeImage/NativeImage";
import OutwardIcon from "@/components/icons/OutwardIcon";
import { splitParagraphs } from "@/lib/splitParagraphs";
import type { STUDIO_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import fallback from "../../../../../public/about/founder.jpg";
import styles from "../studio.module.css";

const DEFAULTS = {
  name: "Suzy Habre",
  role: "Founder & CEO, House of Design",
  bio: "Suzy Habre travels the world with a caring heart and a sharp eye for detail — shaped by a life of contrasts, raised and educated among diverse cultures, yet forever marked by her time in Nepal, where she fell deeply in love with nature.\n\nA beacon of bespoke design, Suzy shares with her team a love of excellence and a deep understanding of others — qualities she believes are the foundation of their success.",
  linkLabel: "Read the interview with BUILD",
  linkUrl: "https://www.build-review.com/issues/q2-2020/22/",
};

interface StudioFounderProps {
  founder?: NonNullable<STUDIO_PAGE_QUERY_RESULT>["founder"];
}

export default function StudioFounder({ founder }: StudioFounderProps) {
  const paragraphs = splitParagraphs(founder?.bio || DEFAULTS.bio);
  const linkUrl = founder?.linkUrl || DEFAULTS.linkUrl;
  const linkLabel = founder?.linkLabel || DEFAULTS.linkLabel;

  return (
    <section className={styles.section}>
      <figure className={styles.mediaNarrow}>
        <NativeImage
          image={founder?.image}
          fallback={fallback}
          alt={founder?.name || DEFAULTS.name}
          sizes="(max-width: 899px) 100vw, 22rem"
          className={styles.img}
        />
      </figure>

      <div className={styles.text}>
        <p className={styles.label}>The Founder</p>
        <h1 className={styles.founderName}>{founder?.name || DEFAULTS.name}</h1>
        <p className={styles.founderRole}>{founder?.role || DEFAULTS.role}</p>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.body}>
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
      </div>
    </section>
  );
}
