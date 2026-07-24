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

// Old card shape kept only for the out-of-scope LatestProjects/ProjectsGrid
// consumers; dies with them in the Phase 7 archive rebuild.
export interface Project {
  _id: string;
  title: string;
  formattedTitle?: PortableTextBlock[];
  slug: { current: string };
  coverImage: SanityImage;
  excerpt: string;
  location: string;
  categories: Category[];
  year: number;
  featured?: boolean;
  overlayTextColor?: "white" | "dark";
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
  secondaryNav?: NavLink[];
  locations?: SiteLocation[];
  phone?: string;
  email?: string;
  mapUrl?: string;
  socials?: SocialLink[];
}

export interface PublicationItem {
  _key?: string;
  publication?: string;
  title?: string;
  url?: string;
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
    image?: SanityImage;
    secondaryImage?: SanityImage;
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

export interface JoinUsPage {
  videoUrl?: string;
  image?: SanityImage;
  heading?: string;
  body?: string;
  email?: string;
}

