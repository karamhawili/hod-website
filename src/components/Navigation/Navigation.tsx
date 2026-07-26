import { getCategories, getSiteSettings } from "@/sanity/lib/queries";
import type { NavLink } from "@/types/sanity";
import NavigationClient from "./NavigationClient";

// The rail's top stack is the project-category filter list (data-driven from
// category documents — empty categories are excluded query-side). The bottom
// stack is CMS-managed; this fallback covers an unpopulated siteSettings.
const DEFAULT_SECONDARY_NAV: NavLink[] = [
  { label: "Archive", href: "/archive" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
  { label: "Join Us", href: "/join-us" },
];

interface NavigationProps {
  // Set by the landing page (from its ?category= search param) so the rail
  // can highlight the active filter without reading search params itself.
  activeCategory?: string;
}

export default async function Navigation({ activeCategory }: NavigationProps) {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);
  const secondaryNav = settings?.secondaryNav?.length
    ? settings.secondaryNav
    : DEFAULT_SECONDARY_NAV;

  return (
    <NavigationClient
      categories={categories}
      secondaryNav={secondaryNav}
      activeCategory={activeCategory}
    />
  );
}
