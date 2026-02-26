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
      title: "title",
      description: "description",
      width: "width",
    },
    prepare({ title, description, width }) {
      const snippet =
        typeof title === "string" && title.length > 0
          ? title.slice(0, 50) + (title.length > 50 ? "..." : "")
          : typeof description === "string" && description.length > 0
            ? description.slice(0, 50) + (description.length > 50 ? "..." : "")
          : "No text";

      const widthLabel =
        width === "twoThirds"
          ? "2/3 Width"
          : width === "half"
            ? "1/2 Width"
            : "Full Width";

      return {
        title: "Centered Text",
        subtitle: `${widthLabel} | ${snippet}`,
        media: TextIcon,
      };
    },
  },
});
