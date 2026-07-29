"use client";

import { useRouter } from "next/navigation";
import styles from "./CloseButton.module.css";

// The detail page renders no nav (per the reference — just a close ✕).
// Close returns to the `from` URL the opener passed (e.g. the archive with its
// search preserved); otherwise the landing viewer. `document.referrer` is
// unreliable for client-side navigation, so we rely on the explicit `from`.
export default function CloseButton() {
  const router = useRouter();

  const onClose = () => {
    const from = new URLSearchParams(window.location.search).get("from");
    router.push(from || "/");
  };

  return (
    <button
      className={styles.close}
      onClick={onClose}
      aria-label="Close project"
    >
      ✕
    </button>
  );
}
