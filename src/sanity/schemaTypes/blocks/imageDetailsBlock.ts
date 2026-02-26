import { defineField, defineType } from "sanity";

export const imageDetailsBlock = defineType({
  name: "imageDetailsBlock",
  title: "Image Details",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageAlt",
      title: "Image Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
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
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Image Right", value: "imageRight" },
          { title: "Image Left", value: "imageLeft" },
        ],
        layout: "radio",
      },
      initialValue: "imageRight",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageFormat",
      title: "Image Format",
      type: "string",
      options: {
        list: [
          { title: "Square 1:1", value: "square" },
          { title: "Portrait 3:4", value: "portrait" },
          { title: "Landscape 16:9", value: "landscape" },
        ],
        layout: "radio",
      },
      initialValue: "portrait",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "image",
      layout: "layout",
      imageFormat: "imageFormat",
      title: "title",
      description: "description",
    },
    prepare({ media, layout, imageFormat, title, description }) {
      const layoutLabel = layout === "imageLeft" ? "Image Left" : "Image Right";
      const formatLabel =
        imageFormat === "landscape"
          ? "Landscape 16:9"
          : imageFormat === "square"
            ? "Square 1:1"
            : "Portrait 3:4";
      const textSource =
        typeof title === "string" && title.length > 0 ? title : description;
      const textSnippet =
        typeof textSource === "string" && textSource.length > 0
          ? textSource.slice(0, 42) + (textSource.length > 42 ? "..." : "")
          : "No text";

      return {
        media,
        title: "Image Details",
        subtitle: `${layoutLabel} | ${formatLabel} | ${textSnippet}`,
      };
    },
  },
});
