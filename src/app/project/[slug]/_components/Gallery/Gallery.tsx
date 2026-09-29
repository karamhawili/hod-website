import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { FALLBACK_BLUR } from "@/lib/blur";
import type { PROJECT_DETAIL_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./Gallery.module.css";

type GalleryBlock = NonNullable<
  NonNullable<PROJECT_DETAIL_QUERY_RESULT>["gallery"]
>[number];
type NestedImage = Extract<GalleryBlock, { _type: "imagePair" }>["images"][number];
type SingleImage = Extract<GalleryBlock, { _type: "image" }>;

interface GalleryProps {
  gallery: GalleryBlock[];
  /** Alt fallback when an image has none. */
  title: string;
}

// Fixed crops for the multi-image layouts (the reference's 2:3 portraits and
// 1:1 square). The URL builder's `fit("crop")` honours the editor's hotspot.
const CROP_WIDTH = 1200;
const PORTRAIT = { w: CROP_WIDTH, h: CROP_WIDTH * 1.5 };
const SQUARE = { w: CROP_WIDTH, h: CROP_WIDTH };

// Ordered gallery blocks as a plain vertical scroll: a plain image at its
// native ratio, a pair as two cropped portraits, a trio as the scattered
// two-column arrangement. Normal document scroll — no interception.
export default function Gallery({ gallery, title }: GalleryProps) {
  return (
    <section className={styles.gallery} aria-label="Project images">
      {gallery.map((block) => {
        switch (block._type) {
          case "image":
            return <NativeFigure key={block._key} image={block} title={title} />;
          case "imagePair":
            return <Pair key={block._key} images={block.images} title={title} />;
          case "imageTrio":
            return <Trio key={block._key} images={block.images} title={title} />;
          default:
            return null;
        }
      })}
    </section>
  );
}

function NativeFigure({ image, title }: { image: SingleImage; title: string }) {
  if (!image.asset) return null;
  return (
    <figure className={styles.figure}>
      <Image
        src={urlFor(image).width(2000).auto("format").url()}
        alt={image.alt ?? title}
        width={image.dimensions?.width ?? 2000}
        height={image.dimensions?.height ?? 1333}
        sizes="(max-width: 899px) 100vw, 62vw"
        className={styles.image}
        placeholder="blur"
        blurDataURL={image.lqip ?? FALLBACK_BLUR}
      />
    </figure>
  );
}

function Pair({ images, title }: { images: NestedImage[]; title: string }) {
  // Validation is Studio-side only — render whatever is actually there.
  const pair = images.slice(0, 2);
  if (pair.length === 0) return null;
  return (
    <div className={styles.pair}>
      {pair.map((image) => (
        <CroppedImage
          key={image._key}
          image={image}
          crop={PORTRAIT}
          sizes="(max-width: 899px) 100vw, 36vw"
          alt={image.alt ?? title}
        />
      ))}
    </div>
  );
}

function Trio({ images, title }: { images: NestedImage[]; title: string }) {
  const [left, right, square] = images;
  if (!left && !right && !square) return null;
  return (
    <div className={styles.trio}>
      <div className={styles.trioLeft}>
        {left && (
          <CroppedImage
            image={left}
            crop={PORTRAIT}
            sizes="(max-width: 899px) 75vw, 36vw"
            alt={left.alt ?? title}
            className={styles.trioPortraitLeft}
          />
        )}
        {square && (
          <CroppedImage
            image={square}
            crop={SQUARE}
            sizes="(max-width: 899px) 58vw, 27vw"
            alt={square.alt ?? title}
            className={styles.trioSquare}
          />
        )}
      </div>
      <div className={styles.trioRight}>
        {right && (
          <CroppedImage
            image={right}
            crop={PORTRAIT}
            sizes="(max-width: 899px) 75vw, 36vw"
            alt={right.alt ?? title}
            className={styles.trioPortraitRight}
          />
        )}
      </div>
    </div>
  );
}

function CroppedImage({
  image,
  crop,
  sizes,
  alt,
  className,
}: {
  image: NestedImage;
  crop: { w: number; h: number };
  sizes: string;
  alt: string;
  className?: string;
}) {
  return (
    <figure className={`${styles.figure} ${className ?? ""}`}>
      <Image
        src={urlFor(image)
          .width(crop.w)
          .height(crop.h)
          .fit("crop")
          .auto("format")
          .url()}
        alt={alt}
        width={crop.w}
        height={crop.h}
        sizes={sizes}
        className={styles.cropped}
        placeholder="blur"
        blurDataURL={image.lqip ?? FALLBACK_BLUR}
      />
    </figure>
  );
}
