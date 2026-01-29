"use client";

import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "./Section.module.css";

interface SectionProps {
  children: ReactNode;
  background?: "white" | "gradient";
  className?: string;
  animate?: boolean;
  shadow?: boolean;
}

export default function Section({
  children,
  background = "white",
  className = "",
  animate = true,
  shadow = false,
}: SectionProps) {
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <section
      ref={animate ? ref : null}
      className={`
        ${styles.section} 
        ${shadow ? styles.shadow : ""}
        ${background === "gradient" ? styles.gradient : ""} 
        ${animate ? (isVisible ? "visible" : "") : "visible"} 
        ${className}
      `.trim()}
    >
      <div className={styles.container}>{children}</div>
    </section>
  );
}
