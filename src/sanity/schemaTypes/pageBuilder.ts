import { defineArrayMember, defineType } from "sanity";

export const pageBuilder = defineType({
  name: "pageBuilder",
  title: "Page Builder",
  type: "array",
  of: [
    defineArrayMember({
      type: "heroBlock",
    }),
  ],
});
