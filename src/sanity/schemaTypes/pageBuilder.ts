import { defineArrayMember, defineType } from "sanity";

export const pageBuilder = defineType({
  name: "pageBuilder",
  title: "Page Builder",
  type: "array",
  of: [
    defineArrayMember({
      type: "heroBlock",
    }),
    defineArrayMember({
      type: "imageDetailsBlock",
    }),
    defineArrayMember({
      type: "imageDetailsLeftBlock",
    }),
    defineArrayMember({
      type: "fullLandscapeImageBlock",
    }),
    defineArrayMember({
      type: "compactLandscapeImageBlock",
    }),
    defineArrayMember({
      type: "halfSquareImageBlock",
    }),
    defineArrayMember({
      type: "centeredTextBlock",
    }),
    defineArrayMember({
      type: "twinImagesBlock",
    }),
    defineArrayMember({
      type: "offsetLandscapeSquareBlock",
    }),
  ],
});
