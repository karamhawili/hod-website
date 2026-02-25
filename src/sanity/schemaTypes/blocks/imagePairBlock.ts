import { defineField, defineType } from "sanity";

export const imagePairBlock = defineType({
  name: "imagePairBlock",
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
      leftAlt: "leftAlt",
      rightAlt: "rightAlt",
    },
    prepare({ media, leftAlt, rightAlt }) {
      const leftSnippet =
        typeof leftAlt === "string" && leftAlt.length > 0
          ? leftAlt.slice(0, 24) + (leftAlt.length > 24 ? "..." : "")
          : "No left alt";
      const rightSnippet =
        typeof rightAlt === "string" && rightAlt.length > 0
          ? rightAlt.slice(0, 24) + (rightAlt.length > 24 ? "..." : "")
          : "No right alt";

      return {
        media,
        title: "Twin Images",
        subtitle: `2 images | L: ${leftSnippet} | R: ${rightSnippet}`,
      };
    },
  },
});
