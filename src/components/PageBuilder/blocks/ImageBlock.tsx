import Image from "next/image";
import Section from "@/components/Section";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./ImageBlock.module.css";

type ImageBlockProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "imageBlock" }
>;

export default function ImageBlock({ image, alt, variant }: ImageBlockProps) {
  const usesFullWidth = variant === "fullLandscape";
  const className =
    variant === "compactLandscape"
      ? styles.compactLandscape
      : variant === "halfSquare"
        ? styles.halfSquare
        : styles.fullLandscape;

  const targetWidth =
    variant === "compactLandscape" ? 1600 : variant === "halfSquare" ? 1200 : 2200;

  const sizes =
    variant === "compactLandscape"
      ? "(max-width: 900px) 100vw, 900px"
      : variant === "halfSquare"
        ? "(max-width: 900px) 100vw, 560px"
        : "(max-width: 900px) 100vw, 1100px";

  return (
    <Section animate={false} height="auto">
      <Section.Content hasMaxWidth={!usesFullWidth}>
        <div className={className}>
          <Image
            src={urlFor(image).width(targetWidth).auto("format").quality(80).url()}
            alt={alt}
            fill
            sizes={sizes}
            quality={80}
            className={styles.image}
          />
        </div>
      </Section.Content>
    </Section>
  );
}
