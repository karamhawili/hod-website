import { type SchemaTypeDefinition } from "sanity";
import { category } from "./category";
import { centeredTextBlock } from "./blocks/centeredTextBlock";
import { heroBlock } from "./blocks/heroBlock";
import { imageBlock } from "./blocks/imageBlock";
import { imageDetailsBlock } from "./blocks/imageDetailsBlock";
import { imagePairBlock } from "./blocks/imagePairBlock";
import { mixedImagePairBlock } from "./blocks/mixedImagePairBlock";
import { homePage } from "./homePage";
import { pageBuilder } from "./pageBuilder";
import { project } from "./project";
import { siteSettings } from "./siteSettings";
import { studioPage } from "./studioPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    category,
    heroBlock,
    imageDetailsBlock,
    imageBlock,
    imagePairBlock,
    mixedImagePairBlock,
    centeredTextBlock,
    pageBuilder,
    project,
    homePage,
    studioPage,
    siteSettings,
  ],
};
