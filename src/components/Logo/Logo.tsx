import { LOGO_PATHS, LOGO_VIEWBOX } from "./logoPaths";

// Inline House of Design wordmark. The source logo.svg has no fill attributes
// (renders black) and lives inside a 1080x1080 canvas with heavy whitespace, so
// an <img> can't be recolored or sized well. Inlining it lets the mark follow
// CSS `color` (fill: currentColor). The viewBox is the computed union bbox of
// all paths (145.4,403.4 → 934.6,676.7) plus 6 units of padding — at small
// render sizes (~30px header) tighter padding rounds to <0.5px and the
// bottom edge antialiasing gets clipped. Don't eyeball-crop; regenerate with
// svg-path-bounds if the art changes.

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox={LOGO_VIEWBOX}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {LOGO_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
