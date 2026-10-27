"use client";

import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import StatusMessage from "./_components/StatusMessage/StatusMessage";
import styles from "./error.module.css";

// Runtime error boundary for every route. Deliberately renders no
// <Navigation />: it fetches from Sanity, the likeliest thing to have failed.
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className={`theme-redesign rail-offset ${styles.main}`}>
      <Link
        href="/"
        className={styles.logoLink}
        aria-label="House of Design — home"
      >
        <Logo className={styles.logo} />
      </Link>
      <StatusMessage
        title="Something went wrong"
        body="The page couldn’t be loaded. Please try again."
      >
        <button type="button" onClick={reset}>
          Try again
        </button>
        <Link href="/">Back to projects</Link>
      </StatusMessage>
    </main>
  );
}
