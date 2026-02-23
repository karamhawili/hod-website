import { defineField, defineType } from "sanity";

export const offsetLandscapeSquareBlock = defineType({
  name: "offsetLandscapeSquareBlock",
  title: "Offset Landscape + Square",
  type: "object",
  fields: [
    defineField({
      name: "leftImage",
      title: "Left Landscape Image",
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
      title: "Right Square Image",
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
        title: "Offset Landscape + Square",
      };
    },
  },
});
