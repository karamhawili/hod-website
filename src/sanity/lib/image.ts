import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

// Preferred helper for new components: caps the source width and lets the
// CDN pick the best format, instead of shipping full-res originals.
export const urlForSized = (source: SanityImageSource, width: number) => {
  return urlFor(source).width(width).auto("format").url();
};
