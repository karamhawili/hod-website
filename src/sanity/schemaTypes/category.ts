import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";
import { createElement } from "react";

function ColorSwatch({ color }: { color: string }) {
  return createElement("span", {
    style: {
      display: "block",
      width: "100%",
      height: "100%",
      backgroundColor: color,
      border: "1px solid #e5e5e5",
    },
  });
}

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "color",
      options: {
        disableAlpha: true,
      },
      description: "Visual identifier for this category.",
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
  preview: {
    select: {
      title: "title",
      color: "color.hex",
    },
    prepare({ title, color }) {
      const hasValidColor = typeof color === "string" && color.length > 0;

      return {
        title,
        media: hasValidColor ? () => ColorSwatch({ color }) : TagIcon,
      };
    },
  },
});
