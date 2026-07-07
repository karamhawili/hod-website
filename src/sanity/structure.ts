import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons";

// Singleton document types — enforced here in the structure (there is no
// `singleton: true` schema option). Excluded from the generic list below so
// they don't appear twice / as creatable documents.
const SINGLETONS = ["siteSettings"];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
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
