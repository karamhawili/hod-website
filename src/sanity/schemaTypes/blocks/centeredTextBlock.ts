import { defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons";

export const centeredTextBlock = defineType({
  name: "centeredTextBlock",
  title: "Centered Text",
  type: "object",
  icon: TextIcon,
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
    defineField({
      name: "width",
      title: "Text Width",
      type: "string",
      options: {
        list: [
          { title: "Full", value: "full" },
          { title: "Two Thirds (2/3)", value: "twoThirds" },
          { title: "Half (50%)", value: "half" },
        ],
        layout: "radio",
      },
      initialValue: "full",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      description: "description",
      width: "width",
    },
    prepare({ description, width }) {
      const snippet =
        typeof description === "string" && description.length > 0
          ? description.slice(0, 60) + (description.length > 60 ? "..." : "")
          : "No text";

      const widthLabel =
        width === "twoThirds"
          ? "2/3"
          : width === "half"
            ? "1/2"
            : "Full";

      return {
        title: "Centered Text",
        subtitle: `${widthLabel} - ${snippet}`,
        media: TextIcon,
      };
    },
  },
});
