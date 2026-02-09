import Section from "@/components/Section";
import styles from "./AboutFounder.module.css";
import Image from "next/image";
import Link from "next/link";

export default function AboutFounder() {
  return (
    <Section shadow={false} background="white" className={styles.wrapper}>
      <div className={styles.colorBlock}></div>
      <div className={styles.columns}>
        <div className={styles.leftCol}>
          <div className={styles.leftImage}>
            <Image
              src="/about/founder.jpg"
              alt="House of Design"
              width={460}
              height={660}
            />
          </div>
        </div>
        <div className={styles.rightCol}>
          <Section.Header align="left">
            <Section.Title>SUZY HABRE</Section.Title>
          </Section.Header>
          <div className={styles.founderTitle}>
            <p className={styles.title}>Founder & CEO,</p>
            <p className={styles.company}>House of Design</p>
          </div>
          <div className={styles.bio}>
            <p>
              Suzy Habre travels the world with a caring heart and a sharp eye
              for detail.
            </p>
            <p>
              Shaped by a life of contrasts—raised and educated among diverse
              cultures, yet forever marked by her time in Nepal.
            </p>
            <span className={styles.bioHighlight}>
              It was there she fell deeply in love with nature
            </span>
            <p>
              A beacon of bespoke design, Suzy shares with her team a love of
              excellence and a deep understanding of others—qualities she
              believes are the foundation of their success.
            </p>
          </div>
          <Link
            href="https://www.build-review.com/issues/q2-2020/22/"
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            READ INTERVIEW WITH BUILD Q2
          </Link>
        </div>
      </div>

      {/* Children intro text */}
      <p className={styles.childrenIntro}>
        Above all, the founder is a mother of two beautiful children, who are
        influenced by her journey in design.
      </p>

      {/* Daughter's sketches */}
      <div className={styles.childrenWrapper}>
        <h3 className={styles.childrenHeader}>
          SKETCHES FROM THE FOUNDER&apos;S DAUGHTER
        </h3>

        <div className={styles.sketchesGrid}>
          <Image
            src="/about/sketch-01.jpg"
            alt="Sketch by founder's daughter"
            width={340}
            height={240}
            className={styles.sketchImage}
          />
          <Image
            src="/about/sketch-02.jpg"
            alt="Sketch by founder's daughter"
            width={340}
            height={240}
            className={styles.sketchImage}
          />
          <Image
            src="/about/sketch-03.jpg"
            alt="Sketch by founder's daughter"
            width={340}
            height={240}
            className={styles.sketchImage}
          />
        </div>

        <div className={styles.signatureWrapper}>
          <p>Kila Nasr</p>
        </div>
      </div>

      {/* Son's quote */}
      <div className={styles.childrenWrapper}>
        <h3 className={styles.childrenHeader}>
          QUOTE FROM THE FOUNDER&apos;S SON
        </h3>

        <blockquote className={styles.quote}>
          &ldquo;Too much perfection is more unsettling than a broken
          design.&ldquo;
        </blockquote>

        <div className={styles.signatureWrapper}>
          <p>Jaden Nasr</p>
        </div>
      </div>
    </Section>
  );
}
