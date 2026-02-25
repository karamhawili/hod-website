import Image from "next/image";
import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import Section from "@/components/Section";
import styles from "./page.module.css";

export default function JoinUs() {
  return (
    <>
      <Navigation />
      <main>
        <Section
          shadow
          background="white"
          height="auto"
          className={styles.page}
        >
          <div className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="House of Design"
              width={200}
              height={88}
            />
          </div>

          <Section.Header>
            <Section.Title>Join Us</Section.Title>
          </Section.Header>

          <Section.Content>
            <div className={styles.videoWrapper}>
              <video
                className={styles.video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                src="/join-us/join-us-video.mp4"
              />
            </div>
          </Section.Content>

          <p className={styles.description}>
            We are always on the lookout for new members that will enrich the
            dynamic of our team, bringing on board new qualities and
            perspectives to our work, and will grow as professionals on our
            side!
          </p>

          <div className={styles.contact}>
            <p className={styles.scriptText}>please send your resume to</p>
            <a href="mailto:info@houseofdesign.lb" className={styles.email}>
              info@houseofdesign.lb
            </a>
          </div>
        </Section>
      </main>
      <Footer showGradient={true} />
    </>
  );
}
