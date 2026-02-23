import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./OffsetLandscapeSquare.module.css";

type OffsetLandscapeSquareProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "offsetLandscapeSquareBlock" }
>;

export default function OffsetLandscapeSquare({
  leftImage,
  leftAlt,
  rightImage,
  rightAlt,
}: OffsetLandscapeSquareProps) {
  return (
    <Section animate={false} height="auto">
      <Section.Content hasMaxWidth={false}>
        <div className={styles.wrapper}>
          <div className={styles.landscapeWrap}>
            <Image
              src={urlFor(leftImage).url()}
              alt={leftAlt}
              fill
              quality={95}
              className={styles.image}
            />
          </div>

          <div className={styles.squareWrap}>
            <Image
              src={urlFor(rightImage).url()}
              alt={rightAlt}
              fill
              quality={95}
              className={styles.image}
            />
          </div>
        </div>
      </Section.Content>
    </Section>
  );
}
