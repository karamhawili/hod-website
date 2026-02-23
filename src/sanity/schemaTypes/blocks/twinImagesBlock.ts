import { defineField, defineType } from "sanity";

export const twinImagesBlock = defineType({
  name: "twinImagesBlock",
  title: "Twin Images",
  type: "object",
  fields: [
    defineField({
      name: "leftImage",
      title: "Left Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "leftAlt",
      title: "Left Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rightImage",
      title: "Right Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rightAlt",
      title: "Right Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "leftImage",
    },
    prepare({ media }) {
      return {
        media,
        title: "Twin Images",
      };
    },
  },
});
