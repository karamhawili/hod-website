import { wordmarkCard } from "@/lib/brandArt";

// Default link-preview card for every route. Project pages override it with
// their first gallery image (see project/[slug]/page.tsx generateMetadata).
export const alt = "House of Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return wordmarkCard(size, 520);
}
