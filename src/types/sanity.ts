export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  color: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  coverImage: SanityImage;
  content?: PageBuilderBlock[];
  excerpt: string;
  location: string;
  categories: Category[];
  year: number;
  featured?: boolean;
  overlayTextColor?: "white" | "dark";
}

export interface HeroBlock {
  _key?: string;
  _type: "heroBlock";
  image: SanityImage;
  alt: string;
}

export interface ImageDetailsBlock {
  _key?: string;
  _type: "imageDetailsBlock";
  image: SanityImage;
  imageAlt: string;
  title?: string;
  subtitle?: string;
  description: string;
}

export interface ImageDetailsLeftBlock {
  _key?: string;
  _type: "imageDetailsLeftBlock";
  image: SanityImage;
  imageAlt: string;
  title?: string;
  subtitle?: string;
  description: string;
}

export interface FullLandscapeImageBlock {
  _key?: string;
  _type: "fullLandscapeImageBlock";
  image: SanityImage;
  alt: string;
}

export interface CompactLandscapeImageBlock {
  _key?: string;
  _type: "compactLandscapeImageBlock";
  image: SanityImage;
  alt: string;
}

export interface HalfSquareImageBlock {
  _key?: string;
  _type: "halfSquareImageBlock";
  image: SanityImage;
  alt: string;
}

export interface CenteredTextBlock {
  _key?: string;
  _type: "centeredTextBlock";
  title?: string;
  description: string;
}

export interface TwinImagesBlock {
  _key?: string;
  _type: "twinImagesBlock";
  leftImage: SanityImage;
  leftAlt: string;
  rightImage: SanityImage;
  rightAlt: string;
}

export interface OffsetLandscapeSquareBlock {
  _key?: string;
  _type: "offsetLandscapeSquareBlock";
  leftImage: SanityImage;
  leftAlt: string;
  rightImage: SanityImage;
  rightAlt: string;
}

export type PageBuilderBlock =
  | HeroBlock
  | ImageDetailsBlock
  | ImageDetailsLeftBlock
  | FullLandscapeImageBlock
  | CompactLandscapeImageBlock
  | HalfSquareImageBlock
  | CenteredTextBlock
  | TwinImagesBlock
  | OffsetLandscapeSquareBlock;
