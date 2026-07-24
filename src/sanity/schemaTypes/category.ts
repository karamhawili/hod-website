import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

// Simple taxonomy for the Archive filter: Residential / Restaurants /
// Beach Clubs / Lounges & Bars / Other (documents created in Studio).
export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
