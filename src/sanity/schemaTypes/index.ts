import { type SchemaTypeDefinition } from "sanity";
import { category } from "./category";
import { project } from "./project";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, project],
};
