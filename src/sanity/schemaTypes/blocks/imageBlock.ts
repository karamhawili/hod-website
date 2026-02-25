import { defineField, defineType } from "sanity";

export const imageBlock = defineType({
  name: "imageBlock",
  title: "Image",
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
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Full 3:2", value: "fullLandscape" },
          { title: "Compact 16:9", value: "compactLandscape" },
          { title: "Half Square 1:1", value: "halfSquare" },
        ],
        layout: "radio",
      },
      initialValue: "compactLandscape",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "image",
      variant: "variant",
      alt: "alt",
    },
    prepare({ media, variant, alt }) {
      const variantLabel =
        variant === "fullLandscape"
          ? "Full 3:2"
          : variant === "halfSquare"
            ? "Half Square 1:1"
            : "Compact 16:9";

      const altSnippet =
        typeof alt === "string" && alt.length > 0
          ? alt.slice(0, 36) + (alt.length > 36 ? "..." : "")
          : "No alt text";

      return {
        media,
        title: "Image",
        subtitle: `${variantLabel} | ${altSnippet}`,
      };
    },
  },
});
