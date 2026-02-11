import { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionContentProps {
  children: ReactNode;
  hasMaxWidth?: boolean; // Optional prop to control max width of content
}

export default function SectionContent({
  hasMaxWidth = true,
  children,
}: SectionContentProps) {
  return (
    <div
      className={`${styles.content} ${hasMaxWidth ? styles.maxWidth : ""}`.trim()}
    >
      {children}
    </div>
  );
}
