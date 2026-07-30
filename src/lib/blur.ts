// Neutral warm-gray placeholder so no image ever flashes white while loading.
// Real per-image LQIP (from Sanity asset metadata) is preferred; this is the
// fallback used whenever an image has no lqip.
//
// MUST be a raster (JPEG) data URI, not SVG: next/image embeds blurDataURL as
// an <image href> inside its own blur SVG, and a nested SVG href doesn't
// render in browsers (→ white flash). This 8×8 JPEG (generated via sharp)
// renders correctly.
export const FALLBACK_BLUR =
  "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAIAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCoASX/2Q==";
