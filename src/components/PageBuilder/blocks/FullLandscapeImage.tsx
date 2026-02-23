import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./FullLandscapeImage.module.css";

type FullLandscapeImageProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "fullLandscapeImageBlock" }
>;

export default function FullLandscapeImage({
  image,
  alt,
}: FullLandscapeImageProps) {
  return (
    <Section animate={false} height="auto">
      <Section.Content hasMaxWidth={false}>
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
