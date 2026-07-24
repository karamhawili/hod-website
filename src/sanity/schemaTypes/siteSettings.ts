import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  description:
    "Global content for the navigation rail — nav links, plus contact details awaiting a home in the Studio/Contact pass.",
  groups: [
    { name: "nav", title: "Navigation", default: true },
    { name: "footer", title: "Contact (not currently displayed)" },
  ],
  fields: [
    defineField({
      name: "brandLine",
      title: "Brand Line",
      type: "string",
      group: "footer",
      description: "The name shown in the footer, e.g. “HOUSE OF DESIGN BY SUZY HABRE”.",
    }),
    defineField({
      name: "nav",
      title: "Primary Navigation",
      type: "array",
      group: "nav",
      description:
        "Links in the top stack of the left rail, under the logo (the work section — e.g. Portfolio). The logo always links to the homepage.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              description: "A path like /portfolio or /about, or a full URL.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
    }),
    defineField({
      name: "secondaryNav",
      title: "Secondary Navigation",
      type: "array",
      group: "nav",
      description:
        "Links pinned to the bottom of the left rail (the studio/info section — e.g. Studio, Join Us).",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              description: "A path like /studio or /join-us, or a full URL.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      group: "footer",
      description: "Office locations shown in the footer.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. “Lebanon” or “UAE”.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "address",
              title: "Address",
              type: "text",
              rows: 3,
              description: "One line per row.",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "address" },
          },
        }),
      ],
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "mapUrl",
      title: "Map Link",
      type: "url",
      group: "footer",
      description: "Destination for the “VIEW MAP” button.",
    }),
    defineField({
      name: "socials",
      title: "Social Links",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "LinkedIn", value: "linkedin" },
                ],
                layout: "dropdown",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
