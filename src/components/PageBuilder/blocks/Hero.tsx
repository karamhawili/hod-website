import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Project } from "@/types/sanity";
import styles from "./Hero.module.css";

type HeroProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "heroBlock" }
>;

export default function Hero({ image, alt }: HeroProps) {
  return (
    <section className={styles.hero}>
      <Image
        src={urlFor(image).url()}
        alt={alt}
        fill
        priority
        quality={100}
        className={styles.image}
      />
    </section>
  );
}
