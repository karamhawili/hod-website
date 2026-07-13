import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const studioPage = defineType({
  name: "studioPage",
  title: "Studio Page",
  type: "document",
  icon: UsersIcon,
  description: "Content for the Studio page sections, top to bottom.",
  groups: [
    { name: "intro", title: "Intro", default: true },
    { name: "team", title: "Team" },
    { name: "disciplines", title: "Sectors & Services" },
    { name: "founder", title: "Founder" },
    { name: "publications", title: "Publications" },
  ],
  fields: [
    defineField({
      name: "intro",
      title: "Intro",
      type: "object",
      group: "intro",
      description:
        "The opening of the page: statement and text on the left, a tall image on the right, then a second image with a short line beside it.",
      fields: [
        defineField({
          name: "heading",
          title: "Statement",
          type: "string",
          description:
            "The opening statement, e.g. “House of Design is an interior design studio rooted in Beirut”.",
        }),
        defineField({
          name: "body",
          title: "Text",
          type: "text",
          rows: 8,
          description:
            "The paragraphs under the statement. Separate paragraphs with an empty line.",
        }),
        defineField({
          name: "image",
          title: "Main Image",
          type: "image",
          options: { hotspot: true },
          description: "The tall image on the right of the opening text.",
        }),
        defineField({
          name: "secondaryImage",
          title: "Second Image",
          type: "image",
          options: { hotspot: true },
          description: "The wide image below the opening, on the left.",
        }),
        defineField({
          name: "secondaryBody",
          title: "Second Text",
          type: "text",
          rows: 4,
          description: "The short paragraph shown beside the second image.",
        }),
      ],
    }),
    defineField({
      name: "team",
      title: "Team",
      type: "object",
      group: "team",
      description:
        "A wide photo of the team or studio, with a statement and text below it. The “Join Us” button under the text is fixed and always links to the Join Us page.",
      fields: [
        defineField({
          name: "image",
          title: "Photo",
          type: "image",
          options: { hotspot: true },
          description: "The wide photo — ideally the team or the studio space.",
        }),
        defineField({
          name: "heading",
          title: "Statement",
          type: "string",
          description:
            "e.g. “We are a team of designers shaping spaces with character”.",
        }),
        defineField({
          name: "body",
          title: "Text",
          type: "text",
          rows: 5,
          description:
            "The paragraphs under the statement. Separate paragraphs with an empty line.",
        }),
      ],
    }),
    defineField({
      name: "disciplines",
      title: "Sectors & Services",
      type: "object",
      group: "disciplines",
      description:
        "A contained section: a wide image with a small upright image beside it, then a short text and the two lists — the sectors we work in and the services we offer.",
      fields: [
        defineField({
          name: "image",
          title: "Wide Image",
          type: "image",
          options: { hotspot: true },
          description: "The wide image at the top of the section.",
        }),
        defineField({
          name: "secondaryImage",
          title: "Small Upright Image",
          type: "image",
          options: { hotspot: true },
          description: "The smaller upright image to the right of the wide one.",
        }),
        defineField({
          name: "body",
          title: "Text",
          type: "text",
          rows: 4,
          description: "A short paragraph introducing the two lists.",
        }),
        defineField({
          name: "sectors",
          title: "Sectors",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "One entry per sector, e.g. “Private Residential”, “Restaurants”.",
        }),
        defineField({
          name: "services",
          title: "Services",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          description: "One entry per service, e.g. “Architecture”, “Interior Design”.",
        }),
      ],
    }),
    defineField({
      name: "founder",
      title: "Founder",
      type: "object",
      group: "founder",
      description: "The founder section: portrait on the left, name and bio on the right.",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
          description: "e.g. “Suzy Habre”.",
        }),
        defineField({
          name: "role",
          title: "Role",
          type: "string",
          description: "e.g. “Founder & CEO, House of Design”.",
        }),
        defineField({
          name: "image",
          title: "Portrait",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "bio",
          title: "Bio",
          type: "text",
          rows: 8,
          description:
            "The founder’s bio. Separate paragraphs with an empty line.",
        }),
        defineField({
          name: "linkLabel",
          title: "Link Label",
          type: "string",
          description: "Text of the link under the bio, e.g. “Read the interview with BUILD”.",
        }),
        defineField({
          name: "linkUrl",
          title: "Link (optional)",
          type: "url",
          description: "Where the link goes — e.g. an interview or feature.",
        }),
      ],
    }),
    defineField({
      name: "publications",
      title: "Publications",
      type: "object",
      group: "publications",
      description:
        "Press and publications list, with an image beside it that stays in place while the list scrolls.",
      fields: [
        defineField({
          name: "label",
          title: "Small Label",
          type: "string",
          description: "Small all-caps label above the list, e.g. “Publications”.",
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          description: "Shown beside the list — e.g. a photo of printed features.",
        }),
        defineField({
          name: "items",
          title: "Publications",
          type: "array",
          description:
            "One entry per publication or press feature, in the order shown.",
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
                    "Shown after the publication name, e.g. “Design & Build Q2 2020”.",
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
  ],
});
