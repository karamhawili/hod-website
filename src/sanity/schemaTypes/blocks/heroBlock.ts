import { defineField, defineType } from "sanity";

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
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
      alt: "alt",
    },
    prepare({ media, alt }) {
      const altSnippet =
        typeof alt === "string" && alt.length > 0
          ? alt.slice(0, 40) + (alt.length > 40 ? "..." : "")
          : "No alt text";

      return {
        media,
        title: "Hero",
        subtitle: `Image block | ${altSnippet}`,
      };
    },
  },
});
