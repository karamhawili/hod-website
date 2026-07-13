import type { StructureResolver } from "sanity/structure";
import { CogIcon, HomeIcon } from "@sanity/icons";

// Singleton document types — enforced here in the structure (there is no
// `singleton: true` schema option). Excluded from the generic list below so
// they don't appear twice / as creatable documents.
const SINGLETONS = ["siteSettings", "homePage"];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home Page")
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Home Page"),
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
