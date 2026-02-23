import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./HalfSquareImage.module.css";

type HalfSquareImageProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "halfSquareImageBlock" }
>;

export default function HalfSquareImage({ image, alt }: HalfSquareImageProps) {
  return (
    <Section animate={false} height="auto">
      <Section.Content>
        <div className={styles.wrap}>
          <Image
            src={urlFor(image).url()}
            alt={alt}
            fill
            quality={95}
            className={styles.image}
          />
        </div>
      </Section.Content>
    </Section>
  );
}
