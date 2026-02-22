import { type SchemaTypeDefinition } from "sanity";
import { category } from "./category";
import { heroBlock } from "./blocks/heroBlock";
import { imageDetailsBlock } from "./blocks/imageDetailsBlock";
import { pageBuilder } from "./pageBuilder";
import { project } from "./project";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, heroBlock, imageDetailsBlock, pageBuilder, project],
};
