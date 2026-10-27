import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  description:
    "Global content: the navigation rail's links, the home intro, and the studio's contact details (Contact page).",
  groups: [
    { name: "nav", title: "Navigation", default: true },
    { name: "home", title: "Home intro" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "introSlideshow",
      title: "Intro slideshow",
      type: "array",
      group: "home",
      description:
        "Full-screen images shown once per session when a visitor first lands on the home page. They cross-fade every ~6s until the visitor clicks to enter. Leave empty to disable the intro.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              description: "Describes the image for screen readers and SEO.",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "brandLine",
      title: "Brand Line",
      type: "string",
      group: "contact",
      description:
        "The bold name line at the top of the Contact page, e.g. “House of Design by Suzy Habre”.",
    }),
    // The former "nav" (primary links) field was retired: the top stack of
    // the rail now renders the project categories directly (landing filter).
    defineField({
      name: "secondaryNav",
      title: "Secondary Navigation",
      type: "array",
      group: "nav",
      description:
        "Links pinned to the bottom of the left rail — e.g. Archive, Studio, Join Us. (The top of the rail shows the project categories automatically.)",
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
      group: "contact",
      description: "Office locations shown on the Contact page.",
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
      group: "contact",
      description: "Shown under each location on the Contact page.",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      description:
        "Inquiries address on the Contact page; also used on Join Us when that page has no email of its own.",
    }),
    defineField({
      name: "mapUrl",
      title: "Map Link",
      type: "url",
      group: "contact",
      description: "Google Maps link. Not currently shown on the site.",
    }),
    defineField({
      name: "socials",
      title: "Social Links",
      type: "array",
      group: "contact",
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
