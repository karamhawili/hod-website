import Image from "next/image";
import Section from "@/components/Section";
import styles from "./AboutServices.module.css";

export default function AboutServices() {
  return (
    <Section background="gradient">
      <Section.Header>
        <Section.Title>SECTORS</Section.Title>
        <Section.Description>
          Experts in high-end F&B spaces, we apply our sophisticated interior
          design skills to restaurants, beaches, lounges, and other exclusive
          venues, tailoring our expertise to craft exceptional environments
          throughout the sector.
        </Section.Description>
      </Section.Header>
      <Section.Content>
        <div className={styles.list}>
          <div className={styles.listItem}>Private Residential</div>
          <div className={styles.listItem}>Restaurants</div>
          <div className={styles.listItem}>Lounges</div>
          <div className={styles.listItem}>Beaches</div>
        </div>
        <div className={styles.imageGrid}>
          <Image
            src="/about/grid-01.png"
            alt="Image"
            width={200}
            height={400}
            className={styles.gridImage}
            objectFit="cover"
          />

          <Image
            src="/about/grid-02.png"
            alt="Image"
            width={200}
            height={400}
            className={styles.gridImage}
            objectFit="cover"
          />

          <Image
            src="/about/grid-03.jpg"
            alt="Image"
            width={200}
            height={400}
            className={styles.gridImage}
            objectFit="cover"
          />

          <Image
            src="/about/grid-04.jpg"
            alt="Image"
            width={200}
            height={400}
            className={styles.gridImage}
            objectFit="cover"
          />
        </div>
      </Section.Content>
      <div></div>
      <Section.Header>
        <Section.Title>SERVICES</Section.Title>
        <Section.Description>
          Experts in high-end F&B spaces, we apply our sophisticated interior
          design skills to restaurants, beaches, lounges, and other exclusive
          venues, tailoring our expertise to craft exceptional environments
          throughout the sector.
        </Section.Description>
      </Section.Header>
      <Section.Content>
        <div className={styles.list}>
          <div className={styles.listItem}>Architecture</div>
          <div className={styles.listItem}>Interior Design</div>
          <div className={styles.listItem}>Interior Architecture</div>
          <div className={styles.listItem}>Creative Concept</div>
        </div>
      </Section.Content>
    </Section>
  );
}
