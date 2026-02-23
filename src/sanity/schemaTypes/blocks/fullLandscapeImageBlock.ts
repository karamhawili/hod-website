import { defineField, defineType } from "sanity";

export const fullLandscapeImageBlock = defineType({
  name: "fullLandscapeImageBlock",
  title: "Image Full 3:2",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "image",
    },
    prepare({ media }) {
      return {
        media,
        title: "Image Full 3:2",
      };
    },
  },
});
