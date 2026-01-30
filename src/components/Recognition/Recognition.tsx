"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./Recognition.module.css";
import Section from "@/components/Section";

interface PressItem {
  id: string;
  image: string;
  publication: string;
  title: string;
  alt: string;
  url: string;
}

const pressItems: PressItem[] = [
  {
    id: "1",
    image: "/press.png",
    publication: "PRESS",
    title: "Design & Build (BUILD Magazine) Q2 2020",
    alt: "Outdoor dining setup with city view",
    url: "https://www.build-review.com/issues/q2-2020/22/",
  },
  {
    id: "2",
    image: "/press-2.png",
    publication: "PRESS",
    title: "Design & Build (BUILD Magazine) Q2 2020",
    alt: "Bar seating with floral arrangements",
    url: "https://www.build-review.com/issues/design-and-build-2021/37/?utm_source=",
  },
  {
    id: "3",
    image: "/press-3.png",
    publication: "PRESS",
    title: "Hospitality News Magazine (Eye for Design)",
    alt: "Curved architectural detail",
    url: "https://issuu.com/hospitalityservices/docs/hospitality_news_131_low_res",
  },
  {
    id: "4",
    image: "/press-4.jpg",
    publication: "PRESS",
    title: "Caterer Middle East / Hotel & Catering",
    alt: "Outdoor dining setup with city view",
    url: "https://www.caterermiddleeast.com/outlets/addmind-group-invests-in-iris-dubai-with-retractable-roof-new-nightclub-and-pizza-bar?utm_source=chatgpt.com",
  },
];

const magazineFeatures = [
  {
    publication: "NOUN MAGAZINE",
    quote: "Énergie et créativité",
    url: "https://www.scribd.com/doc/175579206/Suzy-Nasr-Noun-Magazine?utm_source=chatgpt.com",
  },
  {
    publication: "LOVE THAT DESIGN",
    title: "Online Design Directory",
    url: "https://www.scribd.com/doc/175579206/Suzy-Nasr-Noun-Magazine?utm_source=chatgpt.com",
  },
  {
    publication: "ARCHITECTURAL DIGEST",
    title: "(International Edition)",
    url: "https://www.scribd.com/doc/175579206/Suzy-Nasr-Noun-Magazine?utm_source=chatgpt.com",
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
            <Link
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pressCard}
            >
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
            </Link>
          ))}
        </div>

        {/* Magazine Features */}
        <div className={styles.magazineSection}>
          {magazineFeatures.map((feature, index) => (
            <a
              key={index}
              href={feature.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.magazineFeature}
            >
              <p className={styles.magazinePublication}>
                {feature.publication}
              </p>
              <p className={styles.magazineContent}>
                {"quote" in feature ? feature.quote : feature.title}
              </p>
            </a>
          ))}
        </div>
      </Section.Content>
    </Section>
  );
}
