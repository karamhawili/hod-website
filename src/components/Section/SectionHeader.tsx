import { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionHeaderProps {
  children: ReactNode;
  align?: "left" | "center" | "right";
}

export default function SectionHeader({
  children,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${styles[`align-${align}`]}`}>
      {children}
    </div>
  );
}
