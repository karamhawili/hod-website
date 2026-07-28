import { getCategories } from "@/sanity/lib/queries";
import NavigationClient, { type SecondaryItem } from "./NavigationClient";

// The rail's top stack is the project-category filter list (data-driven from
// category documents). The bottom (secondary) stack is a fixed structure of
// app routes; "Press" is a toggle grouping that expands to Publications +
// Awards (not a route itself).
const SECONDARY_NAV: SecondaryItem[] = [
  { label: "Archive", href: "/archive" },
  { label: "Studio", href: "/studio" },
  {
    label: "Press",
    children: [
      { label: "Publications", href: "/publications" },
      { label: "Awards", href: "/awards" },
    ],
  },
  { label: "Contact", href: "/contact" },
  { label: "Join Us", href: "/join-us" },
];

interface NavigationProps {
  // Set by the landing page (from its ?category= search param) so the rail
  // can highlight the active filter without reading search params itself.
  activeCategory?: string;
}

export default async function Navigation({ activeCategory }: NavigationProps) {
  const categories = await getCategories();

  return (
    <NavigationClient
      categories={categories}
      secondary={SECONDARY_NAV}
      activeCategory={activeCategory}
    />
  );
}
