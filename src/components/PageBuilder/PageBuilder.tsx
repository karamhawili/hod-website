import { Project } from "@/types/sanity";
import Hero from "./blocks/Hero";

type PageBuilderProps = {
  content: NonNullable<Project["content"]>;
};

export default function PageBuilder({ content }: PageBuilderProps) {
  if (!Array.isArray(content)) {
    return null;
  }

  return (
    <main>
      {content.map((block, index) => {
        const key = block._key ?? `${block._type}-${index}`;

        switch (block._type) {
          case "heroBlock":
            return <Hero key={key} {...block} />;
          default:
            return (
              <div key={key}>
                Block not found: {block._type}
              </div>
            );
        }
      })}
    </main>
  );
}
