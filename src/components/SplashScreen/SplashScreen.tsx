"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo/Logo";
import styles from "./SplashScreen.module.css";

// Timings mirror the CSS: logo fades/scales in, holds, then the overlay fades
// out and the layer unmounts.
const LOGO_IN = 2400;
const HOLD = 500;
const FADE_OUT = 700;

// Brand intro on site entry: near-white screen, logo scales 0.5 → 1 as it
// fades in, then the whole overlay fades away. Lives in the root layout, so it
// plays once per hard load — its state persists across client navigation.
export default function SplashScreen() {
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const toLeave = setTimeout(() => setLeaving(true), LOGO_IN + HOLD);
    const toDone = setTimeout(
      () => setDone(true),
      LOGO_IN + HOLD + FADE_OUT,
    );
    return () => {
      clearTimeout(toLeave);
      clearTimeout(toDone);
    };
  }, []);

  if (done) return null;

  return (
    <div
      className={`${styles.overlay} ${leaving ? styles.leaving : ""}`}
      aria-hidden="true"
    >
      <Logo className={styles.logo} />
    </div>
  );
}
