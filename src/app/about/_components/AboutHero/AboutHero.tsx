import Section from "@/components/Section";
import Image from "next/image";
import styles from "./AboutHero.module.css";

export default function AboutHero() {
  return (
    <Section shadow background="gradient" className={styles.wrapper}>
      <div className={styles.logo}>
        <Image src="/logo.svg" alt="House of Design" width={200} height={88} />
      </div>
      <Section.Header>
        <Section.Title>About Us</Section.Title>
        <Section.Description>
          We create spaces inspired by the emotions we’ve experienced, so you
          can step inside, live the moment, and leave with emotions of your own.
        </Section.Description>
      </Section.Header>
      <div className={styles.image}>
        <Image
          src="/sof.jpeg"
          alt="House of Design"
          width={1200}
          height={538}
        />
        <div className={styles.overlay}>
          <p className={styles.quote}>
            &apos;There is a crack in everything, that&apos;s how the light gets
            in.&apos;
          </p>
          <p className={styles.author}>- Leonard Cohen</p>
        </div>
      </div>
    </Section>
  );
}
