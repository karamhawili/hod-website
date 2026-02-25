import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const mixedImagePairBlock = defineType({
  name: "mixedImagePairBlock",
  title: "Mixed Images",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "landscapeImage",
      title: "Landscape Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "landscapeAlt",
      title: "Landscape Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nonLandscapeImage",
      title: "Second Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nonLandscapeAlt",
      title: "Second Image Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "nonLandscapeFormat",
      title: "Second Image Format",
      type: "string",
      options: {
        list: [
          { title: "Square 1:1", value: "square" },
          { title: "Portrait 3:4", value: "portrait" },
        ],
        layout: "radio",
      },
      initialValue: "square",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "landscapePosition",
      title: "Landscape Position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      media: "landscapeImage",
      nonLandscapeFormat: "nonLandscapeFormat",
      landscapePosition: "landscapePosition",
      landscapeAlt: "landscapeAlt",
      nonLandscapeAlt: "nonLandscapeAlt",
    },
    prepare({
      media,
      nonLandscapeFormat,
      landscapePosition,
      landscapeAlt,
      nonLandscapeAlt,
    }) {
      const formatLabel =
        nonLandscapeFormat === "portrait" ? "Portrait 3:4" : "Square 1:1";
      const positionLabel = landscapePosition === "right" ? "Landscape Right" : "Landscape Left";
      const landscapeSnippet =
        typeof landscapeAlt === "string" && landscapeAlt.length > 0
          ? landscapeAlt.slice(0, 20) + (landscapeAlt.length > 20 ? "..." : "")
          : "No landscape alt";
      const secondSnippet =
        typeof nonLandscapeAlt === "string" && nonLandscapeAlt.length > 0
          ? nonLandscapeAlt.slice(0, 20) + (nonLandscapeAlt.length > 20 ? "..." : "")
          : "No second alt";

      return {
        media,
        title: "Mixed Images",
        subtitle: `${positionLabel} | ${formatLabel} | L: ${landscapeSnippet} | S: ${secondSnippet}`,
      };
    },
  },
});
