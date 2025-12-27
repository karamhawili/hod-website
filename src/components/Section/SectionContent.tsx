import { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionContentProps {
  children: ReactNode;
}

export default function SectionContent({ children }: SectionContentProps) {
  return <div className={styles.content}>{children}</div>;
}
