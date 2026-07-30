import { defineArrayMember, defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const awardsPage = defineType({
  name: "awardsPage",
  title: "Awards Page",
  type: "document",
  icon: StarIcon,
  description: "Awards & recognition — grouped by project, plus studio awards.",
  fields: [
    defineField({
      name: "recognition",
      title: "Awards & Recognition",
      type: "array",
      description:
        "One entry per project/venue, in the order shown. Each can list one or several awards.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "project",
              title: "Project / Venue",
              type: "string",
              description: "e.g. “White Dubai”.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "awards",
              title: "Awards",
              type: "array",
              of: [{ type: "string" }],
              description:
                "One line per award, e.g. “Best New Club, Time Out Beirut Awards 2012”.",
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: { title: "project", awards: "awards" },
            prepare({ title, awards }) {
              const count = Array.isArray(awards) ? awards.length : 0;
              return {
                title,
                subtitle: `${count} award${count === 1 ? "" : "s"}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "studioAwards",
      title: "General / Studio Awards",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Studio-level awards not tied to a single project — one line each.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Awards Page" };
    },
  },
});
