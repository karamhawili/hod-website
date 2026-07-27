import { permanentRedirect } from "next/navigation";

// The about page was rebuilt as the Studio page (Phase 5 of the redesign).
// Keep the old URL working for bookmarks, search results, and stale CMS nav.
export default function About() {
  permanentRedirect("/studio");
}
