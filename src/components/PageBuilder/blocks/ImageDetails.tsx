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
  layout,
  imageFormat,
}: ImageDetailsProps) {
  const isImageLeft = layout === "imageLeft";
  const imageFormatClass =
    imageFormat === "square"
      ? styles.square
      : imageFormat === "landscape"
        ? styles.landscape
        : styles.portrait;

  return (
    <Section animate={false} height="auto">
      <Section.Content>
        <div
          className={`${styles.wrapper} ${isImageLeft ? styles.reverse : ""}`.trim()}
        >
          <div className={styles.text}>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            <p className={styles.description}>{description}</p>
          </div>

          <div className={`${styles.imageWrap} ${imageFormatClass}`}>
            <Image
              src={urlFor(image).width(1200).auto("format").quality(80).url()}
              alt={imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 580px"
              quality={80}
              className={styles.image}
            />
          </div>
        </div>
      </Section.Content>
    </Section>
  );
}
