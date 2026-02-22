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
  color: SanityColor;
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
  _type: "heroBlock";
  image: SanityImage;
  alt: string;
}

export type PageBuilderBlock = HeroBlock;

export interface SanityColor {
  _type: "color";
  hex: string;
}
