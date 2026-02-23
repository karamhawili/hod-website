import { defineField, defineType } from "sanity";

export const centeredTextBlock = defineType({
  name: "centeredTextBlock",
  title: "Centered Text",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Centered Text",
      };
    },
  },
});
