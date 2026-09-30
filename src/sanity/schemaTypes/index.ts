import { type SchemaTypeDefinition } from "sanity";
import { awardsPage } from "./awardsPage";
import { category } from "./category";
import { joinUsPage } from "./joinUsPage";
import { imagePair, imageTrio } from "./objects/galleryBlocks";
import { project } from "./project";
import { publicationsPage } from "./publicationsPage";
import { siteSettings } from "./siteSettings";
import { studioPage } from "./studioPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    category,
    project,
    imagePair,
    imageTrio,
    studioPage,
    joinUsPage,
    publicationsPage,
    awardsPage,
    siteSettings,
  ],
};
