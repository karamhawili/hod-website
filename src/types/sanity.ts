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
  width?: "full" | "twoThirds" | "half";
}

export interface ImagePairBlock {
  _key?: string;
  _type: "imagePairBlock";
  leftImage: SanityImage;
  leftAlt: string;
  rightImage: SanityImage;
  rightAlt: string;
}

export interface MixedImagePairBlock {
  _key?: string;
  _type: "mixedImagePairBlock";
  landscapeImage: SanityImage;
  landscapeAlt: string;
  nonLandscapeImage: SanityImage;
  nonLandscapeAlt: string;
  nonLandscapeFormat?: "square" | "portrait";
  landscapePosition?: "left" | "right";
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

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteLocation {
  label: string;
  address?: string;
}

export interface SocialLink {
  platform: "instagram" | "linkedin";
  url: string;
}

export interface SiteSettings {
  brandLine?: string;
  nav?: NavLink[];
  locations?: SiteLocation[];
  phone?: string;
  email?: string;
  mapUrl?: string;
  socials?: SocialLink[];
}

// Minimal project projection used by homepage cards (flattened slug).
export interface ProjectCard {
  _id: string;
  title: string;
  formattedTitle?: PortableTextBlock[];
  slug: string;
  coverImage: SanityImage;
  excerpt?: string;
  location: string;
  year: number;
}

export interface StudioCard {
  image?: SanityImage & { alt?: string };
  label?: string;
  title?: string;
  description?: string;
  url?: string;
}

export interface Mention {
  publication?: string;
  title?: string;
  url?: string;
}

export interface HomePage {
  heroImage?: SanityImage;
  heroVideoUrl?: string;
  introStatement?: string;
  projectsSection?: {
    label?: string;
    heading?: string;
    body?: string;
    image?: SanityImage;
    projects?: ProjectCard[];
  };
  studioSection?: {
    label?: string;
    heading?: string;
    body?: string;
    image?: SanityImage;
    cards?: StudioCard[];
    mentions?: Mention[];
  };
  showcase?: {
    project?: ProjectCard | null;
    image?: SanityImage;
  };
}

export interface PublicationItem extends Mention {
  _key?: string;
}

export interface StudioPage {
  intro?: {
    heading?: string;
    body?: string;
    image?: SanityImage;
    secondaryImage?: SanityImage;
    secondaryBody?: string;
  };
  team?: {
    image?: SanityImage;
    heading?: string;
    body?: string;
  };
  disciplines?: {
    heading?: string;
    body?: string;
    sectors?: string[];
    services?: string[];
  };
  founder?: {
    name?: string;
    role?: string;
    image?: SanityImage;
    bio?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
  publications?: {
    label?: string;
    image?: SanityImage;
    items?: PublicationItem[];
  };
}

export type PageBuilderBlock =
  | HeroBlock
  | ImageDetailsBlock
  | ImageBlock
  | CenteredTextBlock
  | ImagePairBlock
  | MixedImagePairBlock;
