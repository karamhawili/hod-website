import { defineField, defineType } from "sanity";

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
      name: "excerpt",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "category",
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
  ],
});
