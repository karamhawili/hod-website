import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { pageMetadata } from "@/lib/site";
import { getAwardsPage } from "@/sanity/lib/queries";
import type { AWARDS_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Awards",
  description: "Awards and recognition for House of Design projects.",
  path: "/awards",
});

type Recognition = NonNullable<
  NonNullable<AWARDS_PAGE_QUERY_RESULT>["recognition"]
>[number];

export default async function AwardsPage() {
  const data = await getAwardsPage();
  // From the CMS only (awardsPage). Each section — and the hairline between
  // them — renders only when it has entries.
  const recognition: Recognition[] = data?.recognition ?? [];
  const studioAwards = data?.studioAwards ?? [];

  return (
    <>
      <Navigation />
      <main className="theme-redesign rail-offset">
        <div className={styles.page}>
          <h1 className={styles.title}>Awards</h1>

          {recognition.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Awards &amp; Recognition</h2>
              <ul className={styles.ledger}>
                {recognition.map((entry, i) => (
                  <li key={i} className={styles.row}>
                    <p className={styles.project}>{entry.project}</p>
                    <ul className={styles.awards}>
                      {(entry.awards ?? []).map((award, j) => (
                        <li key={j} className={styles.award}>
                          {award}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {recognition.length > 0 && studioAwards.length > 0 && (
            <hr className={styles.separator} />
          )}

          {studioAwards.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Studio Awards</h2>
              <ul className={styles.studioList}>
                {studioAwards.map((award, i) => (
                  <li key={i} className={styles.award}>
                    {award}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
