import { defineArrayMember, defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { orderRankField } from "@sanity/orderable-document-list";
import { galleryImageMember } from "./objects/galleryBlocks";

// Minimal VVD-style project model. The ordered `images` gallery is the single
// source of truth for BOTH the landing carousel and the detail-page scroll.
// Its members are plain images (native ratio on the page) plus two layout
// blocks — `imagePair` / `imageTrio` — whose nested images the landing viewer
// and archive read flattened, in page order (see FLAT_IMAGES in queries.ts).
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
      name: "showOnHome",
      title: "Show on home",
      type: "boolean",
      initialValue: false,
      description:
        "Feature this project in the home-page viewer. The Archive always lists every project regardless.",
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
      title: "Gallery",
      type: "array",
      description:
        "Ordered gallery — drives both the landing carousel and the project page, top to bottom. A plain image shows at its native ratio; “Two portraits” and “Scattered trio” are multi-image layouts.",
      of: [
        galleryImageMember(),
        defineArrayMember({ type: "imagePair" }),
        defineArrayMember({ type: "imageTrio" }),
      ],
      validation: (rule) => rule.min(1).warning("Add at least one image."),
    }),
    // Drag-to-reorder rank (managed from the Projects list in the desk); drives
    // the landing rotation + archive order.
    orderRankField({ type: "project" }),
  ],
  preview: {
    select: {
      title: "title",
      location: "location",
      status: "status",
      showOnHome: "showOnHome",
      media: "images.0.asset",
      // First block may be a pair/trio — fall back to its first image.
      nestedMedia: "images.0.images.0.asset",
    },
    prepare({ title, location, status, showOnHome, media, nestedMedia }) {
      return {
        // ★ marks projects featured on the home viewer, scannable in the list.
        title: showOnHome ? `★ ${title}` : title,
        subtitle: [location, status].filter(Boolean).join(" • "),
        media: media || nestedMedia || ImageIcon,
      };
    },
  },
});
