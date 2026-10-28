import ResilientImage from "@/components/ResilientImage/ResilientImage";
import { FALLBACK_BLUR } from "@/lib/blur";
import { splitParagraphs } from "@/lib/splitParagraphs";
import { urlFor } from "@/sanity/lib/image";
import type { JOIN_US_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import type { SanityImageSource } from "@sanity/image-url";
import styles from "./JoinUsHero.module.css";

interface JoinUsHeroProps {
  joinUs: JOIN_US_PAGE_QUERY_RESULT;
  // siteSettings email — used when the Join Us page has no resume email of
  // its own (joinUsPage.email → siteSettings.email → no email block).
  fallbackEmail?: string;
}

// The whole page: looping video left, careers pitch + resume CTA right. All
// content comes from the CMS (joinUsPage): with no video the image stands in;
// with neither, the media column is dropped and the pitch stands alone.
export default function JoinUsHero({ joinUs, fallbackEmail }: JoinUsHeroProps) {
  const videoUrl = joinUs?.videoUrl;
  const image = joinUs?.image?.asset ? joinUs.image : null;
  const posterUrl = image
    ? urlFor(image as SanityImageSource)
        .width(1400)
        .fit("max")
        .auto("format")
        .url()
    : undefined;
  const hasMedia = Boolean(videoUrl || image);

  const paragraphs = joinUs?.body ? splitParagraphs(joinUs.body) : [];
  const email = joinUs?.email || fallbackEmail;

  return (
    <section
      className={`${styles.section} ${hasMedia ? "" : styles.textOnly}`}
    >
      {hasMedia && (
        <div className={styles.media}>
          {videoUrl ? (
            <video
              className={styles.video}
              src={videoUrl}
              poster={posterUrl}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            image &&
            posterUrl && (
              <ResilientImage
                src={posterUrl}
                alt=""
                fill
                sizes="(max-width: 899px) 100vw, 40vw"
                className={styles.video}
                placeholder="blur"
                blurDataURL={image.lqip ?? FALLBACK_BLUR}
              />
            )
          )}
        </div>
      )}

      {/* The "Careers" label only introduces real content — never alone. */}
      {(joinUs?.heading || paragraphs.length > 0) && (
        <div className={styles.text}>
          <p className={styles.label}>Careers</p>
          {joinUs?.heading && (
            <h1 className={styles.heading}>{joinUs.heading}</h1>
          )}
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.body}>
              {paragraph}
            </p>
          ))}
          {email && (
            <>
              <p className={styles.emailLead}>Send your resume to</p>
              <a href={`mailto:${email}`} className={styles.cta}>
                {email}
              </a>
            </>
          )}
        </div>
      )}
    </section>
  );
}
