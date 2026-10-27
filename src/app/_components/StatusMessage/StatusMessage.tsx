import type { ReactNode } from "react";
import styles from "./StatusMessage.module.css";

interface StatusMessageProps {
  title: string;
  body: string;
  /** Quiet text actions under the body (links or buttons). */
  children: ReactNode;
}

// Shared content block for the 404 (not-found.tsx) and error (error.tsx)
// pages — the Contact page's quiet left-aligned column: serif title, one line
// of body copy, then muted actions.
export default function StatusMessage({
  title,
  body,
  children,
}: StatusMessageProps) {
  return (
    <div className={styles.status}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.body}>{body}</p>
      <div className={styles.actions}>{children}</div>
    </div>
  );
}
