"use client";

import Image from "next/image";
import styles from "./Recognition.module.css";
import Section from "@/components/Section";

interface PressItem {
  id: string;
  image: string;
  publication: string;
  title: string;
  alt: string;
}

const pressItems: PressItem[] = [
  {
    id: "1",
    image: "/press.png",
    publication: "PRESS",
    title: "Design & Build (BUILD Magazine) Q2 2020",
    alt: "Outdoor dining setup with city view",
  },
  {
    id: "2",
    image: "/press-2.png",
    publication: "PRESS",
    title: "Design & Build (BUILD Magazine) Q2 2020",
    alt: "Bar seating with floral arrangements",
  },
  {
    id: "3",
    image: "/press-3.png",
    publication: "PRESS",
    title: "Hospitality News Magazine (Eye for Design)",
    alt: "Curved architectural detail",
  },
  {
    id: "4",
    image: "/press-4.jpg",
    publication: "PRESS",
    title: "Caterer Middle East / Hotel & Catering",
    alt: "Outdoor dining setup with city view",
  },
];

const magazineFeatures = [
  {
    publication: "NOUN MAGAZINE",
    quote: "Énergie et créativité",
  },
  {
    publication: "LOVE THAT DESIGN",
    title: "Online Design Directory",
  },
  {
    publication: "ARCHITECTURAL DIGEST",
    title: "(International Edition)",
  },
];

export default function Recognition() {
  return (
    <Section shadow background="white">
      <Section.Header limitWidth={false}>
        <h2 className={styles.title}>RECOGNITION</h2>
      </Section.Header>

      <Section.Content>
        {/* Press Grid */}
        <div className={styles.pressGrid}>
          {pressItems.map((item) => (
            <div key={item.id} className={styles.pressCard}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={280}
                  height={280}
                  quality={90}
                  className={styles.pressImage}
                />
              </div>
              <div className={styles.pressInfo}>
                <p className={styles.publication}>{item.publication}</p>
                <p className={styles.pressTitle}>{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Magazine Features */}
        <div className={styles.magazineSection}>
          {magazineFeatures.map((feature, index) => (
            <div key={index} className={styles.magazineFeature}>
              <p className={styles.magazinePublication}>
                {feature.publication}
              </p>
              <p className={styles.magazineContent}>
                {"quote" in feature ? feature.quote : feature.title}
              </p>
            </div>
          ))}
        </div>
      </Section.Content>
    </Section>
  );
}
