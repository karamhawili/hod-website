import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./ImageDetails.module.css";

type ImageDetailsProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "imageDetailsBlock" }
>;

export default function ImageDetails({
  image,
  imageAlt,
  title,
  subtitle,
  description,
}: ImageDetailsProps) {
  return (
    <Section animate={false}>
      <Section.Content>
        <div className={styles.wrapper}>
          <div className={styles.imageWrap}>
            <Image
              src={urlFor(image).url()}
              alt={imageAlt}
              fill
              quality={90}
              className={styles.image}
            />
          </div>

          <div className={styles.text}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </Section.Content>
    </Section>
  );
}
