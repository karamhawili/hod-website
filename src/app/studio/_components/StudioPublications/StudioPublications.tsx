import Image from "next/image";
import Reveal from "@/components/Reveal/Reveal";
import OutwardIcon from "@/components/icons/OutwardIcon";
import { urlForSized } from "@/sanity/lib/image";
import type { PublicationItem, StudioPage } from "@/types/sanity";
import styles from "./StudioPublications.module.css";

// Placeholder press list until the client fills the studioPage singleton —
// same set as the landing's Press & Mentions. Entries without a url render
// as plain rows (not links) until real links are added in the CMS.
const DEFAULT_ITEMS: PublicationItem[] = [
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

const DEFAULTS = {
  label: "Publications",
  image: "/about/grid-02.png",
};

interface StudioPublicationsProps {
  publications?: StudioPage["publications"];
}

// Press & publications index: scrolling rows left, sticky image right —
// the landing's mention-row language with the k-studio publications layout.
export default function StudioPublications({
  publications,
}: StudioPublicationsProps) {
  const items = publications?.items?.length
    ? publications.items
    : DEFAULT_ITEMS;

  const imageUrl = publications?.image
    ? urlForSized(publications.image, 1400)
    : DEFAULTS.image;

  return (
    <section className={styles.section}>
      <Reveal className={styles.listCol}>
        <p className={styles.label}>{publications?.label || DEFAULTS.label}</p>
        <ul className={styles.list}>
          {items.map((item, index) => {
            const row = (
              <>
                <span className={styles.pub}>{item.publication}</span>
                {item.title && (
                  <span className={styles.line}>{item.title}</span>
                )}
                {item.url && <OutwardIcon className={styles.arrow} />}
              </>
            );

            return (
              <li key={item._key ?? `${item.publication}-${index}`}>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.row}
                  >
                    {row}
                  </a>
                ) : (
                  <div className={styles.row}>{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Reveal>

      <div className={styles.stickyCol}>
        <Reveal className={styles.stickyInner}>
          <div className={styles.media}>
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              quality={90}
              className={styles.img}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
