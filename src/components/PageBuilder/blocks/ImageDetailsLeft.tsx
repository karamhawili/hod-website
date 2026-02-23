import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./ImageDetails.module.css";

type ImageDetailsLeftProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "imageDetailsLeftBlock" }
>;

export default function ImageDetailsLeft({
  image,
  imageAlt,
  title,
  subtitle,
  description,
}: ImageDetailsLeftProps) {
  return (
    <Section animate={false} height="auto">
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
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </Section.Content>
    </Section>
  );
}
