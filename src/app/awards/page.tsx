import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { getAwardsPage } from "@/sanity/lib/queries";
import type { AWARDS_PAGE_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Awards — House of Design",
};

type Recognition = NonNullable<
  NonNullable<AWARDS_PAGE_QUERY_RESULT>["recognition"]
>[number];

// Shown until the client fills the Awards Page singleton — also serves as the
// ready-to-edit template for the content in /admin.
const DEFAULT_RECOGNITION: Recognition[] = [
  {
    project: "Mad Beirut",
    awards: ["Best New Club, Time Out Beirut Awards 2012"],
  },
  {
    project: "White Beirut",
    awards: ["Best Outdoor Venue, Time Out Beirut Awards 2012"],
  },
  {
    project: "Iris Beirut",
    awards: [
      "Best Lounge Bar, Time Out Beirut Awards 2012",
      "Shortlisted for Best Bar/Club Lounge, Global Design 2019",
    ],
  },
  {
    project: "Iris Yas Island",
    awards: ["Best Bar, What's On Awards 2015"],
  },
  {
    project: "White Dubai",
    awards: [
      "World's Finest Club",
      "Finest Club Award 2015",
      "Best Club, Time Out Dubai Awards 2015",
      "Best Nightclub, Ahlan! Awards 2015",
      "Ranked #49 in DJ Mag's Top 100 Clubs in the World",
    ],
  },
  {
    project: "Matto Beirut",
    awards: ["Shortlisted for Best Restaurant, Africa & MENA Design 2019"],
  },
  {
    project: "Indie Dubai",
    awards: ["Shortlisted in the Top 10 for Best Bar, Ahlan! Awards"],
  },
];

const DEFAULT_STUDIO: string[] = [
  "Lebanon Web Awards 2012",
  "Pan Arab Awards 2013",
  "Finest Clubs Award 2015",
  "Honorary award from the Lebanese Restaurant & Bar Syndicate for innovation in F&B design — 2015",
  "Finalist, Restaurant & Bar Design Award (2016 and 2017) and International Hotel & Property Awards (2019)",
  "Winner, International Design Award (SBID) — 2019",
  "Most Innovative Design Practice in Beirut, BUILD 2020 Design & Build Awards",
];

export default async function AwardsPage() {
  const data = await getAwardsPage();
  const recognition = data?.recognition?.length
    ? data.recognition
    : DEFAULT_RECOGNITION;
  const studioAwards = data?.studioAwards?.length
    ? data.studioAwards
    : DEFAULT_STUDIO;

  return (
    <>
      <Navigation />
      <main className="theme-redesign rail-offset">
        <div className={styles.page}>
          <h1 className={styles.title}>Awards</h1>

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

          <hr className={styles.separator} />

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
        </div>
      </main>
    </>
  );
}
