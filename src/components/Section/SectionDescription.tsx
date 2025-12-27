import { ReactNode } from "react";
import styles from "./Section.module.css";

interface SectionDescriptionProps {
  children: ReactNode;
}

export default function SectionDescription({
  children,
}: SectionDescriptionProps) {
  return <p className={styles.description}>{children}</p>;
}
