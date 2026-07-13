import Reveal from "@/components/Reveal/Reveal";
import { splitParagraphs } from "@/lib/splitParagraphs";
import { urlForSized } from "@/sanity/lib/image";
import type { JoinUsPage } from "@/types/sanity";
import styles from "./JoinUsHero.module.css";

// Placeholder copy until the client fills the joinUsPage singleton — mined
// from the old join-us page. The bundled video ships with the site.
const DEFAULTS = {
  videoUrl: "/join-us/join-us-video.mp4",
  heading: "Grow as a professional on our side",
  body: "We are always on the lookout for new members that will enrich the dynamic of our team, bringing on board new qualities and perspectives to our work.",
  email: "info@houseofdesign.lb",
};

interface JoinUsHeroProps {
  joinUs: JoinUsPage | null;
  // siteSettings email — the middle step of the fallback chain:
  // joinUsPage.email → siteSettings.email → bundled default.
  fallbackEmail?: string;
}

// The whole page: looping video left, careers pitch + resume CTA right.
export default function JoinUsHero({ joinUs, fallbackEmail }: JoinUsHeroProps) {
  const videoUrl = joinUs?.videoUrl || DEFAULTS.videoUrl;
  const posterUrl = joinUs?.image ? urlForSized(joinUs.image, 1400) : undefined;

  const paragraphs = splitParagraphs(joinUs?.body || DEFAULTS.body);
  const email = joinUs?.email || fallbackEmail || DEFAULTS.email;

  return (
    <section className={styles.section}>
      <Reveal className={styles.media}>
        <video
          className={styles.video}
          src={videoUrl}
          poster={posterUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      </Reveal>

      <Reveal className={styles.text}>
        <p className={styles.label}>Careers</p>
        <h1 className={styles.heading}>{joinUs?.heading || DEFAULTS.heading}</h1>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.body}>
            {paragraph}
          </p>
        ))}
        <p className={styles.emailLead}>Send your resume to</p>
        <a href={`mailto:${email}`} className={styles.cta}>
          {email}
        </a>
      </Reveal>
    </section>
  );
}
