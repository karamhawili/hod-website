import { Project } from "@/types/sanity";
import CenteredText from "./blocks/CenteredText";
import CompactLandscapeImage from "./blocks/CompactLandscapeImage";
import FullLandscapeImage from "./blocks/FullLandscapeImage";
import HalfSquareImage from "./blocks/HalfSquareImage";
import Hero from "./blocks/Hero";
import ImageDetails from "./blocks/ImageDetails";
import ImageDetailsLeft from "./blocks/ImageDetailsLeft";
import OffsetLandscapeSquare from "./blocks/OffsetLandscapeSquare";
import TwinImages from "./blocks/TwinImages";

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
          case "imageDetailsLeftBlock":
            return <ImageDetailsLeft key={key} {...block} />;
          case "fullLandscapeImageBlock":
            return <FullLandscapeImage key={key} {...block} />;
          case "compactLandscapeImageBlock":
            return <CompactLandscapeImage key={key} {...block} />;
          case "halfSquareImageBlock":
            return <HalfSquareImage key={key} {...block} />;
          case "centeredTextBlock":
            return <CenteredText key={key} {...block} />;
          case "twinImagesBlock":
            return <TwinImages key={key} {...block} />;
          case "offsetLandscapeSquareBlock":
            return <OffsetLandscapeSquare key={key} {...block} />;
          default:
            return <div key={key}>Block not found.</div>;
        }
      })}
    </main>
  );
}
