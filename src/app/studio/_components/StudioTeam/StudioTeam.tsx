import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal/Reveal";
import { splitParagraphs } from "@/lib/splitParagraphs";
import { urlForSized } from "@/sanity/lib/image";
import type { StudioPage } from "@/types/sanity";
import styles from "./StudioTeam.module.css";

// Placeholder copy until the client fills the studioPage singleton.
const DEFAULTS = {
  image: "/about/wwu-bottom.jpg",
  heading: "We are a team of designers shaping spaces with character",
  body: "We work closely with our clients, from first sketch to final detail, and we are always on the lookout for new members that will enrich the dynamic of our team.",
};

interface StudioTeamProps {
  team?: StudioPage["team"];
}

// Wide studio/team photo with a statement and text beneath it, per the
// k-studio reference. The CTA is fixed in code: /join-us stays its own page.
export default function StudioTeam({ team }: StudioTeamProps) {
  const imageUrl = team?.image
    ? urlForSized(team.image, 2400)
    : DEFAULTS.image;

  const paragraphs = splitParagraphs(team?.body || DEFAULTS.body);

  return (
    <section className={styles.section}>
      <Reveal className={styles.media}>
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 80vw"
          quality={90}
          className={styles.img}
        />
      </Reveal>

      <Reveal className={styles.text}>
        <h2 className={styles.heading}>{team?.heading || DEFAULTS.heading}</h2>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.body}>
            {paragraph}
          </p>
        ))}
        <Link href="/join-us" className={styles.cta}>
          Join Us
        </Link>
      </Reveal>
    </section>
  );
}
