import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export const publicationsPage = defineType({
  name: "publicationsPage",
  title: "Publications Page",
  type: "document",
  icon: DocumentsIcon,
  description: "Press features, in the order shown — one per row.",
  fields: [
    defineField({
      name: "publications",
      title: "Publications",
      type: "array",
      description: "One entry per press feature, top to bottom.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Cover",
              type: "image",
              options: { hotspot: true },
              description: "The magazine cover or feature image (shown left).",
            }),
            defineField({
              name: "publication",
              title: "Publication",
              type: "string",
              description: "e.g. “Elle Decor USA”.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "date",
              title: "Date / Issue",
              type: "string",
              description: "Shown after the publication name, e.g. “9 July 2026”.",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              description:
                "A short paragraph. Separate paragraphs with an empty line.",
            }),
            defineField({
              name: "url",
              title: "Link",
              type: "url",
              description: "The article or full story.",
            }),
            defineField({
              name: "linkLabel",
              title: "Link Label",
              type: "string",
              description: "Defaults to “Full story here” if left empty.",
            }),
          ],
          preview: {
            select: {
              title: "publication",
              subtitle: "date",
              media: "image",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Publications Page" };
    },
  },
});
