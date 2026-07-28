import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Awards — House of Design",
};

// Placeholder until the Awards content model + data are provided (Phase 9
// sub-task 7). Keeps /awards resolving so the Press → Awards nav link works.
export default function AwardsPage() {
  return (
    <>
      <Navigation />
      <main className="theme-redesign rail-offset">
        <div className={styles.page}>
          <h1 className={styles.title}>Awards</h1>
          <p className={styles.note}>Coming soon.</p>
        </div>
      </main>
    </>
  );
}
