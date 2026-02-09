import Section from "@/components/Section";
import styles from "./AboutWorkWithUs.module.css";
import Image from "next/image";

export default function AboutWorkWithUs() {
  return (
    <Section shadow={false} background="white" className={styles.wrapper}>
      <div className={styles.colorBlock}></div>
      <div className={styles.columns}>
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
              src="/about/wwu-left.png"
              alt="House of Design"
              width={460}
              height={660}
            />
          </div>
        </div>
        <div className={styles.rightCol}>
          <div className={styles.rightImage}>
            <Image
              src="/about/wwu-right.jpg"
              alt="House of Design"
              width={460}
              height={660}
            />
          </div>
        </div>
      </div>
      <div className={styles.bottomImage}>
        <Image
          src="/about/wwu-bottom.jpg"
          alt="House of Design"
          width={460}
          height={660}
          quality={100}
        />
      </div>
    </Section>
  );
}
