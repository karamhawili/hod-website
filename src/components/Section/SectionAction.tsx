import { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionActionProps {
  children: ReactNode;
}

export default function SectionAction({ children }: SectionActionProps) {
  return <div className={styles.action}>{children}</div>;
}
