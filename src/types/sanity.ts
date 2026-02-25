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
  formattedTitle?: PortableTextBlock[];
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
  layout: "imageRight" | "imageLeft";
  imageFormat?: "square" | "portrait" | "landscape";
}

export interface ImageBlock {
  _key?: string;
  _type: "imageBlock";
  image: SanityImage;
  alt: string;
  variant: "fullLandscape" | "compactLandscape" | "halfSquare";
}

export interface CenteredTextBlock {
  _key?: string;
  _type: "centeredTextBlock";
  title?: string;
  description: string;
}

export interface ImagePairBlock {
  _key?: string;
  _type: "imagePairBlock";
  leftImage: SanityImage;
  leftAlt: string;
  rightImage: SanityImage;
  rightAlt: string;
}

export interface PortableTextSpan {
  _type: "span";
  text: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _type: "block";
  _key?: string;
  children?: PortableTextSpan[];
}

export type PageBuilderBlock =
  | HeroBlock
  | ImageDetailsBlock
  | ImageBlock
  | CenteredTextBlock
  | ImagePairBlock;
