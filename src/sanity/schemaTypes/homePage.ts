import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  description: "Content for the homepage sections, top to bottom.",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Intro" },
    { name: "projects", title: "Projects Section" },
    { name: "studio", title: "Studio Section" },
    { name: "showcase", title: "Showcase" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "Hero Media",
      type: "object",
      group: "hero",
      description: "The full-screen media at the very top of the homepage.",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          description:
            "Always required — shown while the video loads, and used on its own when there is no video.",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "video",
          title: "Video (optional)",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
          description:
            "A short looping video. It plays automatically, without sound.",
        }),
      ],
    }),
    defineField({
      name: "introStatement",
      title: "Intro Statement",
      type: "text",
      rows: 2,
      group: "intro",
      description:
        "The single centered line shown right after the hero, e.g. “House of Design is a leading design studio …”.",
    }),
    defineField({
      name: "projectsSection",
      title: "Projects Section",
      type: "object",
      group: "projects",
      description:
        "Sticky text on the left, scrolling project cards on the right.",
      fields: [
        defineField({
          name: "label",
          title: "Small Label",
          type: "string",
          description: "Small all-caps label above the heading, e.g. “Selected Work”.",
        }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Text", type: "text", rows: 4 }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          description:
            "Shown at the bottom of the sticky text column, under the link.",
        }),
        defineField({
          name: "projects",
          title: "Projects",
          type: "array",
          of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
          description:
            "Pick and order the projects shown on the homepage. Leave empty to automatically show the latest projects.",
        }),
      ],
    }),
    defineField({
      name: "studioSection",
      title: "Studio Section",
      type: "object",
      group: "studio",
      description:
        "Sticky studio text on the right, scrolling cards on the left — press mentions, About Us, Join Us, and similar.",
      fields: [
        defineField({
          name: "label",
          title: "Small Label",
          type: "string",
          description: "Small all-caps label above the heading, e.g. “The Studio”.",
        }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Text", type: "text", rows: 4 }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          description:
            "Shown at the bottom of the sticky text column, under the link.",
        }),
        defineField({
          name: "cards",
          title: "Cards",
          type: "array",
          description:
            "The scrolling image cards, in order — e.g. About Us, Join Us. Text-only press mentions go in “Press & Mentions” below instead.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "image",
                  title: "Image",
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: "alt",
                      title: "Alternative text",
                      type: "string",
                      description:
                        "Short description of the image, for accessibility and search engines.",
                    }),
                  ],
                }),
                defineField({
                  name: "label",
                  title: "Small Label",
                  type: "string",
                  description: "Small all-caps label above the title, e.g. “Press”.",
                }),
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 2,
                  description: "Short line shown under the title.",
                }),
                defineField({
                  name: "url",
                  title: "Link",
                  type: "string",
                  description:
                    "Where the card leads — a page like /about or /join-us, or a full external URL.",
                }),
              ],
              preview: {
                select: { title: "title", subtitle: "label", media: "image" },
              },
            }),
          ],
        }),
        defineField({
          name: "mentions",
          title: "Press & Mentions",
          type: "array",
          description:
            "Text-only press mentions, listed under the cards — publication name, a short line, and an optional link.",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "publication",
                  title: "Publication",
                  type: "string",
                  description: "e.g. “Architectural Digest”.",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "title",
                  title: "Line",
                  type: "string",
                  description:
                    "Shown after the publication name, e.g. “Online Design Directory”.",
                }),
                defineField({
                  name: "url",
                  title: "Link (optional)",
                  type: "url",
                }),
              ],
              preview: {
                select: { title: "publication", subtitle: "title" },
              },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "showcase",
      title: "Showcase",
      type: "object",
      group: "showcase",
      description: "The large featured-project card near the end of the page.",
      fields: [
        defineField({
          name: "project",
          title: "Project",
          type: "reference",
          to: [{ type: "project" }],
          description: "The project this card links to.",
        }),
        defineField({
          name: "image",
          title: "Image override (optional)",
          type: "image",
          options: { hotspot: true },
          description: "Use a different image than the project’s cover image.",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
