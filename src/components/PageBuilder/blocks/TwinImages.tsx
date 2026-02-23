import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./TwinImages.module.css";

type TwinImagesProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "twinImagesBlock" }
>;

export default function TwinImages({
  leftImage,
  leftAlt,
  rightImage,
  rightAlt,
}: TwinImagesProps) {
  return (
    <Section animate={false} height="auto">
      <Section.Content>
        <div className={styles.wrapper}>
          <div className={styles.grid}>
            <div className={styles.imageWrap}>
              <Image
                src={urlFor(leftImage).url()}
                alt={leftAlt}
                fill
                quality={95}
                className={styles.image}
              />
            </div>
            <div className={styles.imageWrap}>
              <Image
                src={urlFor(rightImage).url()}
                alt={rightAlt}
                fill
                quality={95}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </Section.Content>
    </Section>
  );
}
