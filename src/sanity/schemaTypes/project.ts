import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
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
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "pageBuilder",
      description: "Build the project page by stacking content blocks.",
    }),
    defineField({
      name: "excerpt",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
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
      description:
        "Mark this project as featured to highlight it on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "overlayTextColor",
      title: "Overlay Text Color",
      type: "string",
      description: "Choose text color based on image brightness",
      options: {
        list: [
          { title: "White (for dark images)", value: "white" },
          { title: "Dark Brown (for light images)", value: "dark" },
        ],
      },
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
