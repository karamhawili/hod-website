import Image, { type StaticImageData } from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import { FALLBACK_BLUR } from "@/lib/blur";

// Sanity image projected with native-ratio metadata (see IMAGE_META in
// queries.ts). Kept structural so any *_QUERY_RESULT image field satisfies it.
export interface SanityImageWithMeta {
  asset: unknown;
  hotspot?: unknown;
  crop?: unknown;
  lqip?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
}

interface NativeImageProps {
  image?: SanityImageWithMeta | null;
  fallback?: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

// Renders an image at its true aspect ratio (never cropped) via intrinsic
// width/height — from Sanity asset metadata, or from a static import's
// compile-time dimensions when the CMS field is empty. Renders nothing when
// neither source is present.
export default function NativeImage({
  image,
  fallback,
  alt,
  sizes,
  className,
  priority,
}: NativeImageProps) {
  if (image?.asset && image.dimensions) {
    return (
      <Image
        src={urlFor(image as SanityImageSource)
          .width(1600)
          .auto("format")
          .url()}
        alt={alt}
        width={image.dimensions.width}
        height={image.dimensions.height}
        sizes={sizes}
        className={className}
        placeholder="blur"
        blurDataURL={image.lqip ?? FALLBACK_BLUR}
        priority={priority}
      />
    );
  }

  if (fallback) {
    return (
      <Image
        src={fallback}
        alt={alt}
        sizes={sizes}
        className={className}
        placeholder="blur"
        priority={priority}
      />
    );
  }

  return null;
}
