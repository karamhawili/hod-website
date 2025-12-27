"use client";

import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "./Section.module.css";

interface SectionProps {
  children: ReactNode;
  background?: "white" | "gradient";
  className?: string;
}

export default function Section({
  children,
  background = "white",
  className = "",
}: SectionProps) {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section
      ref={ref}
      className={`
        ${styles.section} 
        ${background === "gradient" ? styles.gradient : ""} 
        ${isVisible ? "visible" : ""}
        ${className}
      `.trim()}
    >
      <div className={styles.container}>{children}</div>
    </section>
  );
}
