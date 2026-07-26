import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

// Field order mirrors the page top-to-bottom: founder → firm description →
// sectors & services. (Publications and Contact live on their own pages.)
export const studioPage = defineType({
  name: "studioPage",
  title: "Studio Page",
  type: "document",
  icon: UsersIcon,
  description: "Content for the Studio page sections, top to bottom.",
  groups: [
    { name: "founder", title: "Founder", default: true },
    { name: "intro", title: "About / Firm" },
    { name: "disciplines", title: "Sectors & Services" },
  ],
  fields: [
    defineField({
      name: "founder",
      title: "Founder",
      type: "object",
      group: "founder",
      description: "The page opening: founder portrait, name, role and bio.",
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
      name: "intro",
      title: "About / Firm",
      type: "object",
      group: "intro",
      description:
        "The firm description: a statement and the paragraphs beneath it. Text only.",
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
      ],
    }),
    defineField({
      name: "disciplines",
      title: "Sectors & Services",
      type: "object",
      group: "disciplines",
      description:
        "A title and short intro line, then the two lists — the sectors we work in and the services we offer.",
      fields: [
        defineField({
          name: "heading",
          title: "Title",
          type: "string",
          description: "The section title, e.g. “What we do”.",
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
  ],
});
