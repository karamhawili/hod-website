"use client";

import Image, { type ImageProps, type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

// Drop-in for next/image (with placeholder="blur") that never shows a broken
// image. On a load error next/image deliberately strips its blur background
// and reveals the alt text — on a bad connection that meant a broken-image
// glyph + the project title. Instead this keeps the blur on screen and quietly
// retries the real image: after a short backoff, and immediately when the
// browser reports it's back online. Each retry remounts only this image.

// Delays (ms) before the 1st, 2nd, 3rd retry. After that, only the `online`
// event retries — a dead connection shouldn't be polled forever.
const RETRY_DELAYS = [2000, 5000, 15000];

// Transparent 1×1 GIF: the fallback <img> loads this (instantly, never
// fails) so the blur set as its background shows through, with the same box.
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// Port of next/image's own blur placeholder (next/dist/shared/lib/
// image-blur-svg.js, not a public export) so the failed state is pixel-
// identical to the loading state.
function blurSvg({
  width,
  height,
  blurWidth,
  blurHeight,
  blurDataURL,
  objectFit,
}: {
  width?: number;
  height?: number;
  blurWidth?: number;
  blurHeight?: number;
  blurDataURL: string;
  objectFit?: string;
}) {
  const std = 20;
  const svgWidth = blurWidth ? blurWidth * 40 : width;
  const svgHeight = blurHeight ? blurHeight * 40 : height;
  const viewBox =
    svgWidth && svgHeight ? `viewBox='0 0 ${svgWidth} ${svgHeight}'` : "";
  const preserveAspectRatio = viewBox
    ? "none"
    : objectFit === "contain"
      ? "xMidYMid"
      : objectFit === "cover"
        ? "xMidYMid slice"
        : "none";
  return `%3Csvg xmlns='http://www.w3.org/2000/svg' ${viewBox}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='${std}'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${preserveAspectRatio}' style='filter: url(%23b);' href='${blurDataURL}'/%3E%3C/svg%3E`;
}

function isStaticImage(src: ImageProps["src"]): src is StaticImageData {
  return typeof src === "object" && "src" in src;
}

function toNumber(value: ImageProps["width"]) {
  return typeof value === "number" ? value : value ? Number(value) : undefined;
}

export default function ResilientImage({
  alt,
  onError,
  ...props
}: ImageProps) {
  // `attempt` keys the real <Image>; bumping it remounts it, which makes the
  // browser request the image again.
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!failed) return;

    const retry = () => {
      setFailed(false);
      setAttempt((n) => n + 1);
    };
    const delay = RETRY_DELAYS[attempt];
    const timer = delay === undefined ? undefined : setTimeout(retry, delay);
    window.addEventListener("online", retry);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("online", retry);
    };
  }, [failed, attempt]);

  if (failed) {
    const staticSrc = isStaticImage(props.src) ? props.src : undefined;
    const blurDataURL = props.blurDataURL ?? staticSrc?.blurDataURL ?? "";
    const objectFit = props.style?.objectFit;
    const width = toNumber(props.width) ?? staticSrc?.width;
    const height = toNumber(props.height) ?? staticSrc?.height;
    const svg = blurSvg({
      width,
      height,
      blurWidth: staticSrc?.blurWidth,
      blurHeight: staticSrc?.blurHeight,
      blurDataURL,
      objectFit,
    });

    // Same element, box and classes as the real image — only the pixels
    // differ. Mirrors next/image's placeholder background styles.
    return (
      <Image
        {...props}
        alt={alt}
        src={TRANSPARENT_PIXEL}
        width={props.fill ? undefined : width}
        height={props.fill ? undefined : height}
        loader={undefined}
        unoptimized
        placeholder="empty"
        blurDataURL={undefined}
        style={{
          // The 1×1 pixel's own (square) ratio would override the width/height
          // attributes under `height: auto` — pin the real image's ratio.
          ...(!props.fill && width && height
            ? { aspectRatio: `${width} / ${height}` }
            : {}),
          ...props.style,
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,${svg}")`,
          backgroundSize:
            objectFit && objectFit !== "fill" ? objectFit : "cover",
          backgroundPosition: props.style?.objectPosition ?? "50% 50%",
          backgroundRepeat: "no-repeat",
        }}
      />
    );
  }

  return (
    <Image
      key={attempt}
      {...props}
      alt={alt}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
