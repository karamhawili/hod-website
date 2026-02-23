import Section from "@/components/Section";
import { Project } from "@/types/sanity";
import styles from "./CenteredText.module.css";

type CenteredTextProps = Extract<
  NonNullable<Project["content"]>[number],
  { _type: "centeredTextBlock" }
>;

export default function CenteredText({ title, description }: CenteredTextProps) {
  return (
    <Section animate={false} height="auto">
      <Section.Content>
        <div className={styles.wrapper}>
          <div className={styles.inner}>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </Section.Content>
    </Section>
  );
}
