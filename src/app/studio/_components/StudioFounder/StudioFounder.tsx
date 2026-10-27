import NativeImage from "@/components/NativeImage/NativeImage";
import OutwardIcon from "@/components/icons/OutwardIcon";
import { splitParagraphs } from "@/lib/splitParagraphs";
import type { STUDIO_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "../studio.module.css";

type Founder = NonNullable<STUDIO_PAGE_QUERY_RESULT>["founder"];

interface StudioFounderProps {
  founder?: Founder;
}

// Content comes only from the CMS (studioPage.founder); each piece renders
// only when set, and the section disappears when it's all empty.
export function hasFounderContent(founder?: Founder) {
  return Boolean(
    founder?.image?.asset || founder?.name || founder?.role || founder?.bio,
  );
}

export default function StudioFounder({ founder }: StudioFounderProps) {
  if (!founder || !hasFounderContent(founder)) return null;

  const paragraphs = founder.bio ? splitParagraphs(founder.bio) : [];

  return (
    <section className={styles.section}>
      {founder.image?.asset && (
        <figure className={styles.mediaNarrow}>
          <NativeImage
            image={founder.image}
            alt={founder.name ?? ""}
            sizes="(max-width: 899px) 100vw, 22rem"
            className={styles.img}
          />
        </figure>
      )}

      <div className={styles.text}>
        <p className={styles.label}>The Founder</p>
        {founder.name && (
          <h1 className={styles.founderName}>{founder.name}</h1>
        )}
        {founder.role && <p className={styles.founderRole}>{founder.role}</p>}
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.body}>
            {paragraph}
          </p>
        ))}
        {founder.linkUrl && (
          <a
            href={founder.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {founder.linkLabel || founder.linkUrl}
            <OutwardIcon className={styles.linkArrow} />
          </a>
        )}
      </div>
    </section>
  );
}
