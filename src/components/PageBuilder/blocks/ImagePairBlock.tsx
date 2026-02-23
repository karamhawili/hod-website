import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./ImagePairBlock.module.css";

type ImagePairBlockProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "imagePairBlock" }
>;

export default function ImagePairBlock({
  leftImage,
  leftAlt,
  rightImage,
  rightAlt,
}: ImagePairBlockProps) {
  return (
    <Section animate={false} height="auto">
      <Section.Content>
        <div className={styles.twinWrapper}>
          <div className={styles.twinGrid}>
            <div className={styles.squareWrap}>
              <Image
                src={urlFor(leftImage).width(900).auto("format").quality(80).url()}
                alt={leftAlt}
                fill
                sizes="(max-width: 900px) 100vw, 450px"
                quality={80}
                className={styles.image}
              />
            </div>
            <div className={styles.squareWrap}>
              <Image
                src={urlFor(rightImage).width(900).auto("format").quality(80).url()}
                alt={rightAlt}
                fill
                sizes="(max-width: 900px) 100vw, 450px"
                quality={80}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </Section.Content>
    </Section>
  );
}
