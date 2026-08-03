import { at, defineMigration, set } from "sanity/migrate";

// One-off backfill: mark every EXISTING project as shown on the home viewer, so
// today's behaviour (everything showed) is preserved. New projects default to
// `false` (see the `showOnHome` field's initialValue) to keep the home reel
// curated. Idempotent — only patches projects that don't yet have the field.
//
// Runs with your `sanity login` auth (no token needed). Preview first, then
// apply, against the intended dataset:
//   npx sanity migration run backfill-show-on-home --dataset production
//   npx sanity migration run backfill-show-on-home --dataset production --no-dry-run
export default defineMigration({
  title: "Backfill showOnHome=true on existing projects",
  documentTypes: ["project"],
  migrate: {
    document(doc) {
      if ((doc as { showOnHome?: boolean }).showOnHome === undefined) {
        return at("showOnHome", set(true));
      }
    },
  },
});
