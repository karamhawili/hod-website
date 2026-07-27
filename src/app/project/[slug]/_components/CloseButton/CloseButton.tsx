"use client";

import { useRouter } from "next/navigation";
import styles from "./CloseButton.module.css";

// The detail page renders no nav (per the reference — just a close ✕).
// Close returns to where the visitor came from when that was on-site,
// otherwise to the landing viewer.
export default function CloseButton() {
  const router = useRouter();

  const onClose = () => {
    const cameFromSite =
      typeof document !== "undefined" &&
      document.referrer.startsWith(window.location.origin);
    if (cameFromSite && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
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
