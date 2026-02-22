import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "content", title: "Page Content" },
    { name: "metadata", title: "Metadata" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      description: "Used in the URL. Auto-generated from the title.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      group: "overview",
      description: "Main image used in listings and preview cards.",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "pageBuilder",
      group: "content",
      description: "Build the project page by stacking content blocks.",
    }),
    defineField({
      name: "excerpt",
      title: "Short Description",
      type: "text",
      group: "overview",
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "metadata",
      options: {
        list: [
          { title: "Beirut", value: "Beirut" },
          { title: "Dubai", value: "Dubai" },
          { title: "Abu Dhabi", value: "Abu Dhabi" },
          { title: "Cairo", value: "Cairo" },
          { title: "Doha", value: "Doha" },
          { title: "Riyadh", value: "Riyadh" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "metadata",
      of: [
        {
          type: "reference",
          to: [{ type: "category" }],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "year",
      title: "Year Completed",
      type: "number",
      group: "metadata",
      validation: (rule) =>
        rule
          .required()
          .min(2000)
          .max(new Date().getFullYear())
          .integer()
          .error("Please enter a valid year between 2000 and current year"),
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      group: "metadata",
      description:
        "Mark this project as featured to highlight it on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "overlayTextColor",
      title: "Overlay Text Color",
      type: "string",
      group: "metadata",
      description: "Choose text color based on image brightness",
      options: {
        list: [
          { title: "White (for dark images)", value: "white" },
          { title: "Dark Brown (for light images)", value: "dark" },
        ],
      },
      hidden: ({ document }) => !document?.featured,
      initialValue: "white",
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      media: "coverImage",
    },
    prepare({ title, slug, media }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : "No slug",
        media: media || ImageIcon,
      };
    },
  },
});
