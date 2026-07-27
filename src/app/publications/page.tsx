import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import Navigation from "@/components/Navigation/Navigation";
import NativeImage from "@/components/NativeImage/NativeImage";
import OutwardIcon from "@/components/icons/OutwardIcon";
import { splitParagraphs } from "@/lib/splitParagraphs";
import { getPublicationsPage } from "@/sanity/lib/queries";
import type { PUBLICATIONS_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import coverA from "../../../public/press.png";
import coverB from "../../../public/press-2.png";
import coverC from "../../../public/press-3.png";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Publications — House of Design",
};

type Publication = NonNullable<
  NonNullable<PUBLICATIONS_PAGE_QUERY_RESULT>["publications"]
>[number];

// Shown until the client fills the Publications Page singleton. Each carries a
// local cover for NativeImage's fallback.
const DEFAULTS: (Omit<Publication, "image"> & { fallback: StaticImageData })[] =
  [
    {
      _key: "d1",
      publication: "BUILD Magazine",
      date: "Design & Build, Q2 2020",
      description:
        "House of Design is featured for its refined, emotion-led approach to hospitality interiors across the region.",
      url: "https://www.build-review.com/issues/q2-2020/22/",
      linkLabel: null,
      fallback: coverA,
    },
    {
      _key: "d2",
      publication: "Hospitality News",
      date: "Eye for Design",
      description:
        "A look at the studio's work shaping restaurants, beaches and lounges into distinctive, atmospheric venues.",
      url: "https://issuu.com/hospitalityservices/docs/hospitality_news_131_low_res",
      linkLabel: null,
      fallback: coverB,
    },
    {
      _key: "d3",
      publication: "Noun Magazine",
      date: "Énergie et créativité",
      description:
        "An interview on the studio's founder, her influences, and the philosophy behind House of Design.",
      url: "https://www.scribd.com/doc/175579206/Suzy-Nasr-Noun-Magazine",
      linkLabel: null,
      fallback: coverC,
    },
  ];

export default async function PublicationsPage() {
  const data = await getPublicationsPage();
  const items = data?.publications ?? [];
  const usingDefaults = items.length === 0;

  const rows: (Publication & { fallback?: StaticImageData })[] = usingDefaults
    ? DEFAULTS.map((d) => ({ ...d, image: null }))
    : items;

  return (
    <>
      <Navigation />
      <main className="theme-redesign rail-offset">
        <div className={styles.page}>
          <h1 className={styles.title}>Publications</h1>

          <ul className={styles.list}>
            {rows.map((item) => {
              const label = item.linkLabel || "Full story here";
              const heading = [item.publication, item.date]
                .filter(Boolean)
                .join(", ");
              const paragraphs = item.description
                ? splitParagraphs(item.description)
                : [];

              return (
                <li key={item._key} className={styles.row}>
                  <figure className={styles.media}>
                    <NativeImage
                      image={item.image}
                      fallback={item.fallback}
                      alt={item.publication}
                      sizes="(max-width: 899px) 60vw, 12rem"
                      className={styles.img}
                    />
                  </figure>

                  <div className={styles.content}>
                    <p className={styles.heading}>{heading}</p>
                    {paragraphs.map((paragraph, i) => (
                      <p key={i} className={styles.body}>
                        {paragraph}
                      </p>
                    ))}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {label}
                        <OutwardIcon className={styles.arrow} />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </>
  );
}
