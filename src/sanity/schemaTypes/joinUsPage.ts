import { defineField, defineType } from "sanity";
import { AddUserIcon } from "@sanity/icons";

export const joinUsPage = defineType({
  name: "joinUsPage",
  title: "Join Us Page",
  type: "document",
  icon: AddUserIcon,
  description: "Content for the Join Us page: video on the left, text on the right.",
  fields: [
    defineField({
      name: "video",
      title: "Video (optional)",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description:
        "A short looping video, shown on the left. It plays automatically, without sound. Leave empty to keep the built-in studio video.",
    }),
    defineField({
      name: "image",
      title: "Image (optional)",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown while the video loads, and used on its own when there is no video.",
    }),
    defineField({
      name: "heading",
      title: "Statement",
      type: "string",
      description:
        "The statement beside the video, e.g. “Grow as a professional on our side”.",
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "text",
      rows: 6,
      description:
        "The paragraphs under the statement. Separate paragraphs with an empty line.",
    }),
    defineField({
      name: "email",
      title: "Resume Email",
      type: "string",
      description:
        "Where applicants send their resume. Leave empty to use the general email from Site Settings.",
    }),
  ],
});
