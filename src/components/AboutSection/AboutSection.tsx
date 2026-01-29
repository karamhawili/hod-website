import Image from "next/image";
import Section from "@/components/Section";
import styles from "./AboutSection.module.css";
import Link from "next/link";

export default function AboutSection() {
  return (
    <Section background="gradient">
      <Section.Header>
        <Section.Description>
          Our designs bring beauty and practicality together, transforming your
          space into a reflection of your unique taste and lifestyle.
        </Section.Description>
      </Section.Header>
      <Section.Content>
        <Image
          src="/about-image.png"
          alt="About House of Design"
          width={1034}
          height={483}
          quality={100}
          className={styles.image}
        />
      </Section.Content>
      <Section.Action>
        <Link href={`#`} className={styles.link}>
          About Us
        </Link>
      </Section.Action>
    </Section>
  );
}
