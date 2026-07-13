import { getSiteSettings } from "@/sanity/lib/queries";
import type { NavLink } from "@/types/sanity";
import NavigationClient from "./NavigationClient";

// Fallback links when siteSettings hasn't been populated yet. The logo links
// home, so "Home" is intentionally not a nav item. "Join Us" is provisional
// pending the open /join-us decision.
const DEFAULT_NAV: NavLink[] = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Studio", href: "/studio" },
  { label: "Join Us", href: "/join-us" },
];

interface NavigationProps {
  // Kept for out-of-scope /project/[slug], which sets theme="light" over its
  // dark hero. "light" = light content at the top of the page (over a photo).
  theme?: "default" | "light";
}

export default async function Navigation({
  theme = "default",
}: NavigationProps) {
  const settings = await getSiteSettings();
  const nav = settings?.nav?.length ? settings.nav : DEFAULT_NAV;

  return <NavigationClient theme={theme} nav={nav} />;
}
