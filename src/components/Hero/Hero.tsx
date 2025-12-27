import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.logoContainer}>
        <Image
          src="/logo.svg" // You'll need to add your logo file
          alt="House of Design"
          width={448}
          height={196}
          priority
        />
      </div>
      <p className={styles.tagline}>
        Private Residential / Restaurants / Lounge / Beaches
      </p>
    </section>
  );
}
