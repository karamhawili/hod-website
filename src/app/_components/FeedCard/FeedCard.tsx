import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import styles from "./FeedCard.module.css";

interface FeedCardProps {
  src: string;
  alt: string;
  title: ReactNode;
  meta?: string;
  description?: string;
  href?: string;
  aspect?: "landscape" | "portrait" | "square";
  sizes?: string;
}

// The shared scrolling-feed card (projects feed + studio feed): media with
// hover zoom, small tracked meta, bold title, optional description.
// Internal hrefs use next/link; external ones open in a new tab; no href
// renders a plain card. Pass a source image ≥2× the rendered width — cards
// render ~40vw on desktop, and quality 90 avoids visible re-compression.
export default function FeedCard({
  src,
  alt,
  title,
  meta,
  description,
  href,
  aspect = "landscape",
  sizes = "(max-width: 768px) 100vw, 40vw",
}: FeedCardProps) {
  const content = (
    <>
      <div className={`${styles.media} ${styles[aspect]}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          className={styles.img}
        />
      </div>
      {meta && <p className={styles.meta}>{meta}</p>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </>
  );

  if (!href) {
    return <div className={styles.card}>{content}</div>;
  }

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.card}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={styles.card}>
      {content}
    </Link>
  );
}
