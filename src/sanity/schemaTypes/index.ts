import { type SchemaTypeDefinition } from "sanity";
import { category } from "./category";
import { centeredTextBlock } from "./blocks/centeredTextBlock";
import { compactLandscapeImageBlock } from "./blocks/compactLandscapeImageBlock";
import { fullLandscapeImageBlock } from "./blocks/fullLandscapeImageBlock";
import { halfSquareImageBlock } from "./blocks/halfSquareImageBlock";
import { heroBlock } from "./blocks/heroBlock";
import { imageDetailsBlock } from "./blocks/imageDetailsBlock";
import { imageDetailsLeftBlock } from "./blocks/imageDetailsLeftBlock";
import { offsetLandscapeSquareBlock } from "./blocks/offsetLandscapeSquareBlock";
import { twinImagesBlock } from "./blocks/twinImagesBlock";
import { pageBuilder } from "./pageBuilder";
import { project } from "./project";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    category,
    heroBlock,
    imageDetailsBlock,
    imageDetailsLeftBlock,
    offsetLandscapeSquareBlock,
    fullLandscapeImageBlock,
    compactLandscapeImageBlock,
    halfSquareImageBlock,
    centeredTextBlock,
    twinImagesBlock,
    pageBuilder,
    project,
  ],
};
