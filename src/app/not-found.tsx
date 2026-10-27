import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import StatusMessage from "./_components/StatusMessage/StatusMessage";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
};

// Unknown URLs and unknown project slugs (notFound() in project/[slug]).
export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className={`theme-redesign rail-offset ${styles.main}`}>
        <StatusMessage
          title="Page not found"
          body="This page doesn’t exist, or the project has moved."
        >
          <Link href="/">Back to projects</Link>
          <Link href="/archive">Browse the archive</Link>
        </StatusMessage>
      </main>
    </>
  );
}
