import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import styles from "./InstagramGrid.module.css";

export default function InstagramGrid() {
  // Placeholder images - replace with actual Instagram feed later
  const instagramImages = [
    "/instagram-1.png",
    "/instagram-2.png",
    "/instagram-3.png",
  ];

  return (
    <Section background="white">
      <Section.Header limitWidth={false}>
        <div className={styles.headerContent}>
          <p className={styles.tagline}>
            Treat yourself to an unforgettable break
          </p>
          <Link
            href="https://www.instagram.com/hod.houseofdesign/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.handle}
          >
            @HOD.HOUSEOFDESIGN
          </Link>
        </div>
      </Section.Header>

      <div className={styles.grid}>
        {/* Top row - 3 images with sequential animation */}
        <div className={styles.topRow}>
          {instagramImages.map((src, index) => (
            <div
              key={index}
              className={`${styles.gridItem} animate-popIn animate-delay-${(index + 1) * 300}`}
            >
              <Image
                src={src}
                alt={`Instagram post ${index + 1}`}
                width={300}
                height={300}
                quality={100}
                className={styles.gridImage}
              />
            </div>
          ))}
        </div>

        {/* Bottom row - Large brand image */}
        <div
          className={`${styles.brandImage} animate-popIn animate-delay-1000`}
        >
          <Image
            src="/brand-image.png"
            alt="House of Design Brand"
            width={1000}
            height={400}
            quality={100}
            className={styles.brandImg}
          />
        </div>
      </div>
    </Section>
  );
}
