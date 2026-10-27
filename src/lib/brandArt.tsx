import { ImageResponse } from "next/og";
import {
  LOGO_PATHS,
  LOGO_VIEWBOX,
  MONOGRAM_BOUNDS,
} from "@/components/Logo/logoPaths";

// Generated brand images (favicon, Apple touch icon, Open Graph card). CSS
// custom properties don't exist inside ImageResponse, so the two tokens are
// mirrored here: --color-bg and --color-title from globals.css.
const BG = "#fffffa";
const INK = "#391812";

// The artwork goes in as an SVG data-URI <img> — the most reliably supported
// way to draw vector paths in ImageResponse.
function svgDataUri(paths: string[], viewBox: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${INK}">${paths
    .map((d) => `<path d="${d}"/>`)
    .join("")}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * The round monogram centred on a square off-white tile. `markRatio` is the
 * share of the tile's width the monogram spans (smaller = more padding);
 * `cornerRatio` rounds the tile's corners as a share of its side (0 = square,
 * corners outside the radius stay transparent).
 */
export function monogramIcon(
  size: number,
  markRatio: number,
  cornerRatio = 0,
) {
  const { x, y, width, height } = MONOGRAM_BOUNDS;
  // Square viewBox around the monogram's centre; the side is set so the
  // monogram's width fills `markRatio` of it.
  const side = width / markRatio;
  const viewBox = [
    x + width / 2 - side / 2,
    y + height / 2 - side / 2,
    side,
    side,
  ].join(" ");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: BG,
          borderRadius: Math.round(size * cornerRatio),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse, not the DOM */}
        <img
          src={svgDataUri([LOGO_PATHS[0]], viewBox)}
          width={size}
          height={size}
          alt=""
        />
      </div>
    ),
    { width: size, height: size },
  );
}

/** The full wordmark centred on an off-white card (Open Graph / link previews). */
export function wordmarkCard(
  { width, height }: { width: number; height: number },
  markWidth: number,
) {
  const [, , vbWidth, vbHeight] = LOGO_VIEWBOX.split(" ").map(Number);
  const markHeight = Math.round((markWidth * vbHeight) / vbWidth);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: BG,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse, not the DOM */}
        <img
          src={svgDataUri(LOGO_PATHS, LOGO_VIEWBOX)}
          width={markWidth}
          height={markHeight}
          alt=""
        />
      </div>
    ),
    { width, height },
  );
}
