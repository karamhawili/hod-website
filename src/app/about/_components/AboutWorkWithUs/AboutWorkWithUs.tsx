import Section from "@/components/Section";
import styles from "./AboutWorkWithUs.module.css";
import Image from "next/image";

export default function AboutWorkWithUs() {
  return (
    <Section shadow={false} background="white" className={styles.wrapper}>
      <div className={styles.colorBlock}></div>
      <div className={styles.columns}>
        {/* add a 2 col layout */}
        <div className={styles.leftCol}>
          <div className={styles.textContent}>
            <Section.Header align="left">
              <Section.Title>Work With Us</Section.Title>
              <Section.Description>
                Blends heartfelt inspiration with thoughtful design, where
                beauty, comfort, and connection live together.
              </Section.Description>
            </Section.Header>
          </div>
          <div className={styles.leftImage}>
            <Image
              src="/about-image.png"
              alt="House of Design"
              width={460}
              height={660}
            />
          </div>
        </div>
        <div className={styles.rightCol}>
          <div className={styles.rightImage}>
            <Image
              src="/instagram-2.png"
              alt="House of Design"
              width={460}
              height={660}
            />
          </div>
        </div>
      </div>
      <div className={styles.bottomImage}>
        <Image
          src="/brand-image.png"
          alt="House of Design"
          width={460}
          height={660}
        />
      </div>
    </Section>
  );
}
