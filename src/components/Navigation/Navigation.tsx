import { getSiteSettings } from "@/sanity/lib/queries";
import type { NavLink } from "@/types/sanity";
import NavigationClient from "./NavigationClient";

// Fallbacks when siteSettings hasn't been populated yet. The logo links home,
// so "Home" is intentionally not a nav item. Primary = the work section
// (top stack of the rail); secondary = studio/info (pinned bottom-left).
// "Portfolio" becomes "Archive" in Phase 7; "Join Us" is provisional.
const DEFAULT_NAV: NavLink[] = [{ label: "Portfolio", href: "/portfolio" }];

const DEFAULT_SECONDARY_NAV: NavLink[] = [
  { label: "Studio", href: "/studio" },
  { label: "Join Us", href: "/join-us" },
];

export default async function Navigation() {
  const settings = await getSiteSettings();
  const nav = settings?.nav?.length ? settings.nav : DEFAULT_NAV;
  const secondaryNav = settings?.secondaryNav?.length
    ? settings.secondaryNav
    : DEFAULT_SECONDARY_NAV;

  return <NavigationClient nav={nav} secondaryNav={secondaryNav} />;
}
