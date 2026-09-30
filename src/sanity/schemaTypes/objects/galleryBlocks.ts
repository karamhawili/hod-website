import { defineArrayMember, defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

// One image-with-alt member, shared by the project gallery's top-level array
// and by the pair/trio blocks so all three stay identical (hotspot on, alt).
export const galleryImageMember = () =>
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
  });

// Two portraits side by side. Both are cropped to 2:3 on the page — set the
// hotspot on each image to control what the crop keeps.
export const imagePair = defineType({
  name: "imagePair",
  title: "Two portraits",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description:
        "Exactly two images, shown side by side and cropped to portrait (2:3). Use the hotspot to choose the crop.",
      of: [galleryImageMember()],
      validation: (rule) => rule.required().length(2),
    }),
  ],
  preview: {
    select: { media: "images.0.asset", count: "images" },
    prepare({ media, count }) {
      const n = Array.isArray(count) ? count.length : 0;
      return {
        title: "Two portraits",
        subtitle: `${n} of 2 images`,
        media,
      };
    },
  },
});

// Scattered trio: portrait top-left, portrait on the right sitting lower, a
// smaller square tucked under the left portrait. Portraits crop to 2:3, the
// square to 1:1.
export const imageTrio = defineType({
  name: "imageTrio",
  title: "Scattered trio",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description:
        "Exactly three images, in this order: left portrait, right portrait, small square. Portraits crop to 2:3, the square to 1:1 — use the hotspot to choose each crop.",
      of: [galleryImageMember()],
      validation: (rule) => rule.required().length(3),
    }),
  ],
  preview: {
    select: { media: "images.0.asset", count: "images" },
    prepare({ media, count }) {
      const n = Array.isArray(count) ? count.length : 0;
      return {
        title: "Scattered trio",
        subtitle: `${n} of 3 images`,
        media,
      };
    },
  },
});
