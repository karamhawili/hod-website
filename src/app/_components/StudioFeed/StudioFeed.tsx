import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal/Reveal";
import OutwardIcon from "@/components/icons/OutwardIcon";
import { urlForSized } from "@/sanity/lib/image";
import type { Mention, SanityImage, StudioCard } from "@/types/sanity";
import FeedCard from "../FeedCard/FeedCard";
import styles from "./StudioFeed.module.css";

const DEFAULTS = {
  label: "The Studio",
  heading: "Beauty and practicality, together",
  body: "Our designs bring beauty and practicality together, transforming your space into a reflection of your unique taste and lifestyle.",
  stickyImage: "/about/hero.jpg", // placeholder until set in the CMS
};

// Placeholder cards until the client curates them in the CMS.
const DEFAULT_CARDS: {
  src: string;
  label: string;
  title: string;
  description?: string;
  url: string;
}[] = [
  {
    src: "/about/grid-02.png",
    label: "Studio",
    title: "About House of Design",
    description:
      "The studio, the founder, and the way we shape spaces — from first sketch to final detail.",
    url: "/studio",
  },
  {
    src: "/about/wwu-bottom.jpg",
    label: "Careers",
    title: "Join Us",
    description:
      "We are always on the lookout for new members that will enrich the dynamic of our team.",
    url: "/join-us",
  },
];

// Placeholder mentions — the old landing page's press + magazine features.
const DEFAULT_MENTIONS: Mention[] = [
  {
    publication: "BUILD Magazine",
    title: "Design & Build Q2 2020",
    url: "https://www.build-review.com/issues/q2-2020/22/",
  },
  {
    publication: "BUILD Magazine",
    title: "Design & Build 2021",
    url: "https://www.build-review.com/issues/design-and-build-2021/37/",
  },
  {
    publication: "Hospitality News",
    title: "Eye for Design",
    url: "https://issuu.com/hospitalityservices/docs/hospitality_news_131_low_res",
  },
  {
    publication: "Caterer Middle East",
    title: "Hotel & Catering",
    url: "https://www.caterermiddleeast.com/outlets/addmind-group-invests-in-iris-dubai-with-retractable-roof-new-nightclub-and-pizza-bar",
  },
  {
    publication: "Noun Magazine",
    title: "Énergie et créativité",
    url: "https://www.scribd.com/doc/175579206/Suzy-Nasr-Noun-Magazine",
  },
  { publication: "Love That Design", title: "Online Design Directory" },
  { publication: "Architectural Digest", title: "International Edition" },
];

const ASPECTS = ["landscape", "portrait", "square"] as const;
const PLACEHOLDER_CARD_IMAGE = "/about/grid-01.png";

interface StudioFeedProps {
  label?: string;
  heading?: string;
  body?: string;
  image?: SanityImage;
  cards?: StudioCard[];
  mentions?: Mention[];
}

// Mirror of ProjectsFeed: scrolling cards left (About Us, Join Us …) with a
// text-only press index beneath them, sticky editorial text right.
export default function StudioFeed({
  label,
  heading,
  body,
  image,
  cards,
  mentions,
}: StudioFeedProps) {
  const stickyImageUrl = image
    ? urlForSized(image, 1000)
    : DEFAULTS.stickyImage;

  const feedCards = cards?.length
    ? cards.map((card) => ({
        src: card.image
          ? urlForSized(card.image, 2000)
          : PLACEHOLDER_CARD_IMAGE,
        alt: card.image?.alt ?? card.title ?? "House of Design",
        label: card.label,
        title: card.title,
        description: card.description,
        url: card.url,
      }))
    : DEFAULT_CARDS.map((card) => ({ ...card, alt: card.title }));

  const pressIndex = mentions?.length ? mentions : DEFAULT_MENTIONS;

  return (
    <section className={styles.section}>
      <div className={styles.feed}>
        {feedCards.map((card, index) => (
          <Reveal key={`${card.title}-${index}`} className={styles.card}>
            <FeedCard
              src={card.src}
              alt={card.alt}
              meta={card.label}
              title={card.title}
              description={card.description}
              href={card.url}
              aspect={ASPECTS[index % 3]}
            />
          </Reveal>
        ))}

        {pressIndex.length > 0 && (
          <Reveal className={styles.mentions}>
            <p className={styles.mentionsLabel}>Press &amp; Mentions</p>
            <ul className={styles.mentionsList}>
              {pressIndex.map((mention, index) => {
                const row = (
                  <>
                    <span className={styles.mentionPub}>
                      {mention.publication}
                    </span>
                    {mention.title && (
                      <span className={styles.mentionTitle}>
                        {mention.title}
                      </span>
                    )}
                    {mention.url && (
                      <OutwardIcon className={styles.mentionArrow} />
                    )}
                  </>
                );

                return (
                  <li key={`${mention.publication}-${index}`}>
                    {mention.url ? (
                      <a
                        href={mention.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.mentionRow}
                      >
                        {row}
                      </a>
                    ) : (
                      <div className={styles.mentionRow}>{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        )}
      </div>

      <div className={styles.stickyCol}>
        <div className={styles.stickyInner}>
          <div className={styles.stickyMedia}>
            <Image
              src={stickyImageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={styles.stickyImg}
            />
          </div>
          <p className={styles.label}>{label || DEFAULTS.label}</p>
          <h2 className={styles.heading}>{heading || DEFAULTS.heading}</h2>
          <p className={styles.body}>{body || DEFAULTS.body}</p>
          <Link href="/studio" className={styles.cta}>
            The Studio
          </Link>
        </div>
      </div>
    </section>
  );
}
