import { defineArrayMember, defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

// Minimal VVD-style project model. The ordered `images` array is the single
// source of truth for BOTH the landing carousel and the detail-page scroll.
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used in the URL. Auto-generated from the title.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City and country, e.g. “Beirut, Lebanon”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      description: "A year or range, e.g. “2025” or “2024–2025”.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Shown in Archive captions exactly as written.",
      options: {
        list: [
          { title: "In progress", value: "In progress" },
          { title: "On hold", value: "On hold" },
          { title: "Completed", value: "Completed" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto"],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "string",
      description: "e.g. “Photos by Jane Doe”.",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description:
        "Ordered gallery — drives both the landing carousel and the project page, top to bottom.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description: "Describes the image for screen readers and SEO.",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).warning("Add at least one image."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      status: "status",
      media: "images.0",
    },
    prepare({ title, location, status, media }) {
      return {
        title,
        subtitle: [location, status].filter(Boolean).join(" • "),
        media: media || ImageIcon,
      };
    },
  },
});
