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
  locations?: SiteLocation[];
  phone?: string;
  email?: string;
  mapUrl?: string;
  socials?: SocialLink[];
}

