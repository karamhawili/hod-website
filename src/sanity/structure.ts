import type { StructureResolver } from "sanity/structure";
import { AddUserIcon, CogIcon, UsersIcon } from "@sanity/icons";

// Singleton document types — enforced here in the structure (there is no
// `singleton: true` schema option). Excluded from the generic list below so
// they don't appear twice / as creatable documents.
const SINGLETONS = ["siteSettings", "studioPage", "joinUsPage"];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
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
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings"),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ]);
