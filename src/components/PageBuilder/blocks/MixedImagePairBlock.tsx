import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./MixedImagePairBlock.module.css";

type MixedImagePairBlockProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "mixedImagePairBlock" }
>;

export default function MixedImagePairBlock({
  landscapeImage,
  landscapeAlt,
  nonLandscapeImage,
  nonLandscapeAlt,
  nonLandscapeFormat,
  landscapePosition,
}: MixedImagePairBlockProps) {
  const secondFormatClass =
    nonLandscapeFormat === "portrait" ? styles.portrait : styles.square;

  const landscapeNode = (
    <div className={styles.landscapeWrap}>
      <Image
        src={urlFor(landscapeImage)
          .width(1400)
          .auto("format")
          .quality(80)
          .url()}
        alt={landscapeAlt}
        fill
        sizes="(max-width: 900px) 100vw, 760px"
        quality={80}
        className={styles.image}
      />
    </div>
  );

  const secondNode = (
    <div className={`${styles.nonLandscapeWrap} ${secondFormatClass}`}>
      <Image
        src={urlFor(nonLandscapeImage)
          .width(1100)
          .auto("format")
          .quality(80)
          .url()}
        alt={nonLandscapeAlt}
        fill
        sizes="(max-width: 900px) 100vw, 360px"
        quality={80}
        className={styles.image}
      />
    </div>
  );

  return (
    <Section animate={false} height="auto" className="section-autoheight-tight">
      <Section.Content hasMaxWidth={false}>
        <div className={styles.wrapper}>
          <div
            className={`${styles.grid} ${landscapePosition === "right" ? styles.landscapeRight : ""}`.trim()}
          >
            {landscapePosition === "right" ? (
              <>
                {secondNode}
                {landscapeNode}
              </>
            ) : (
              <>
                {landscapeNode}
                {secondNode}
              </>
            )}
          </div>
        </div>
      </Section.Content>
    </Section>
  );
}
