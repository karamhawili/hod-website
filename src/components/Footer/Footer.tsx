import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            src="/logo.svg"
            alt="House of Design"
            width={200}
            height={88}
          />
        </div>

        <h2 className={styles.title}>HOUSE OF DESIGN BY SUZY HABRE</h2>

        <address className={styles.address}>
          <p>Lebanon</p>
          <p>Achrafieh, Beirut</p>
        </address>

        <address className={styles.address}>
          <p>UAE</p>
          <p>Dubai Harbour,</p>
          <p>next to Bebeach</p>
        </address>

        <div className={styles.contact}>
          <a href="tel:+9611234567" className={styles.phone}>
            +961 1 234 567
          </a>
          <a href="mailto:info@houseofdesign.lb" className={styles.email}>
            info@houseofdesign.lb
          </a>
        </div>

        <Link
          href="https://share.google/T6E7xd9yVVf3A9qDH"
          className={styles.mapButton}
          target="_blank"
          rel="noopener noreferrer"
        >
          VIEW MAP
        </Link>

        <div className={styles.social}>
          <a
            href="https://www.instagram.com/hod.houseofdesign/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Image src="/instagram.svg" alt="" width={24} height={24} />
          </a>
          <a
            href="https://www.linkedin.com/company/addmindhospitality/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Image src="/linkedin.svg" alt="" width={24} height={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
