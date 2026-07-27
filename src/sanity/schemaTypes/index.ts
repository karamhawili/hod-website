import { type SchemaTypeDefinition } from "sanity";
import { category } from "./category";
import { joinUsPage } from "./joinUsPage";
import { project } from "./project";
import { publicationsPage } from "./publicationsPage";
import { siteSettings } from "./siteSettings";
import { studioPage } from "./studioPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    category,
    project,
    studioPage,
    joinUsPage,
    publicationsPage,
    siteSettings,
  ],
};
