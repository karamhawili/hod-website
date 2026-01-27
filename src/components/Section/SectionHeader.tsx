import { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionHeaderProps {
  children: ReactNode;
  align?: "left" | "center" | "right";
  limitWidth?: boolean;
}

export default function SectionHeader({
  children,
  align = "center",
  limitWidth = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`${styles.header} ${styles[`align-${align}`]} ${limitWidth ? styles.limitWidth : ""}`}
    >
      {children}
    </div>
  );
}
