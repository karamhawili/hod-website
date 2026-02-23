import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./CompactLandscapeImage.module.css";

type CompactLandscapeImageProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "compactLandscapeImageBlock" }
>;

export default function CompactLandscapeImage({
  image,
  alt,
}: CompactLandscapeImageProps) {
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
