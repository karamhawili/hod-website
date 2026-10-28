import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import NativeImage from "@/components/NativeImage/NativeImage";
import OutwardIcon from "@/components/icons/OutwardIcon";
import { pageMetadata } from "@/lib/site";
import { splitParagraphs } from "@/lib/splitParagraphs";
import { getPublicationsPage } from "@/sanity/lib/queries";
import type { PUBLICATIONS_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Publications",
  description: "Press and publications featuring House of Design.",
  path: "/publications",
});

type Publication = NonNullable<
  NonNullable<PUBLICATIONS_PAGE_QUERY_RESULT>["publications"]
>[number];

export default async function PublicationsPage() {
  const data = await getPublicationsPage();
  // From the CMS only (publicationsPage); a row without a cover drops its
  // figure, and with no entries the page is just its title.
  const rows: Publication[] = data?.publications ?? [];

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
                  {item.image?.asset && (
                    <figure className={styles.media}>
                      <NativeImage
                        image={item.image}
                        alt={item.publication ?? ""}
                        sizes="(max-width: 899px) 60vw, 12rem"
                        className={styles.img}
                      />
                    </figure>
                  )}

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
