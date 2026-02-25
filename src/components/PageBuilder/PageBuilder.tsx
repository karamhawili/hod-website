import { Project } from "@/types/sanity";
import CenteredText from "./blocks/CenteredText";
import Hero from "./blocks/Hero";
import ImageBlock from "./blocks/ImageBlock";
import ImageDetails from "./blocks/ImageDetails";
import ImagePairBlock from "./blocks/ImagePairBlock";
import MixedImagePairBlock from "./blocks/MixedImagePairBlock";

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
          case "imageDetailsBlock":
            return <ImageDetails key={key} {...block} />;
          case "imageBlock":
            return <ImageBlock key={key} {...block} />;
          case "centeredTextBlock":
            return <CenteredText key={key} {...block} />;
          case "imagePairBlock":
            return <ImagePairBlock key={key} {...block} />;
          case "mixedImagePairBlock":
            return <MixedImagePairBlock key={key} {...block} />;
          default:
            return <div key={key}>Block not found.</div>;
        }
      })}
    </main>
  );
}
