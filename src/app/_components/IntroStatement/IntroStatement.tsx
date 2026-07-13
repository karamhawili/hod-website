import Reveal from "@/components/Reveal/Reveal";
import styles from "./IntroStatement.module.css";

const FALLBACK =
  "House of Design is a leading design studio — shaping some of the world’s most exceptional and stylish environments.";

interface IntroStatementProps {
  text?: string;
}

export default function IntroStatement({ text }: IntroStatementProps) {
  return (
    <section className={styles.section}>
      <Reveal>
        <p className={styles.statement}>{text || FALLBACK}</p>
      </Reveal>
    </section>
  );
}
