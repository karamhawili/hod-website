import { monogramIcon } from "@/lib/brandArt";

// Browser-tab favicon: the round monogram on an off-white tile (an opaque tile
// so the brown-black mark survives dark tab bars). 48px is Google's minimum
// for search-result favicons; browsers downscale it for the tab.
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return monogramIcon(size.width, 0.88);
}
