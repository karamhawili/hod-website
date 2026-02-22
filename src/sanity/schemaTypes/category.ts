import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";
import { createElement } from "react";

const CATEGORY_COLORS = [
  "#C8B59C", // Sand
  "#B86D4B", // Terracotta
  "#7A7E58", // Olive
  "#5C6B73", // Slate
  "#3A3A3A", // Charcoal
  "#E9E3D5", // Ivory
];
const CATEGORY_COLORS_NORMALIZED = CATEGORY_COLORS.map((color) =>
  color.toLowerCase(),
);

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
        colorList: CATEGORY_COLORS,
      },
      initialValue: {
        _type: "color",
        hex: CATEGORY_COLORS[0],
      },
      description: "Choose one of the predefined brand colors.",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true;

          if (typeof value !== "object" || !("hex" in value)) {
            return "Please choose one of the predefined colors";
          }

          return CATEGORY_COLORS_NORMALIZED.includes(
            String(value.hex).toLowerCase(),
          )
            ? true
            : "Please choose one of the predefined colors";
        }),
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
