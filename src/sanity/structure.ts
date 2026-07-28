import type { StructureResolver } from "sanity/structure";
import {
  AddUserIcon,
  CogIcon,
  DocumentsIcon,
  ImageIcon,
  TagIcon,
  UsersIcon,
} from "@sanity/icons";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

// Singleton document types — enforced here in the structure (there is no
// `singleton: true` schema option). Excluded from the generic list below so
// they don't appear twice / as creatable documents.
const SINGLETONS = [
  "siteSettings",
  "studioPage",
  "joinUsPage",
  "publicationsPage",
];

// Document types listed explicitly below (so they aren't duplicated by the
// generic fallback).
const EXPLICIT_TYPES = [...SINGLETONS, "project", "category"];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Studio Page")
        .icon(UsersIcon)
        .child(
          S.document()
            .schemaType("studioPage")
            .documentId("studioPage")
            .title("Studio Page"),
        ),

      S.listItem()
        .title("Join Us Page")
        .icon(AddUserIcon)
        .child(
          S.document()
            .schemaType("joinUsPage")
            .documentId("joinUsPage")
            .title("Join Us Page"),
        ),

      S.listItem()
        .title("Publications Page")
        .icon(DocumentsIcon)
        .child(
          S.document()
            .schemaType("publicationsPage")
            .documentId("publicationsPage")
            .title("Publications Page"),
        ),

      S.listItem()
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),

      S.divider(),

      // Drag-to-reorder projects — the order drives the landing rotation +
      // archive.
      orderableDocumentListDeskItem({
        type: "project",
        title: "Projects",
        icon: ImageIcon,
        S,
        context,
      }),

      S.documentTypeListItem("category").title("Categories").icon(TagIcon),

      // Any other (future) non-singleton, non-explicit types.
      ...S.documentTypeListItems().filter(
        (listItem) => !EXPLICIT_TYPES.includes(listItem.getId() as string),
      ),
    ]);
