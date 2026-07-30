"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import type { CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import styles from "./Navigation.module.css";

// A secondary-rail item is either a plain link or a toggle grouping with
// children (e.g. Press → Publications, Awards).
export type SecondaryItem =
  | { label: string; href: string; children?: never }
  | { label: string; href?: never; children: { label: string; href: string }[] };

interface NavigationClientProps {
  categories: CATEGORIES_QUERY_RESULT;
  secondary: SecondaryItem[];
  activeCategory?: string;
}

export default function NavigationClient({
  categories,
  secondary,
  activeCategory,
}: NavigationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Press submenu: null = follow the route (auto-open on a press page);
  // true/false once the user has toggled it.
  const [pressOpen, setPressOpen] = useState<boolean | null>(null);
  const pathname = usePathname();

  // Primary stack = the landing filter (VVD's model: the taxonomy IS the
  // primary nav). Clicking the active category clears the filter.
  const renderPrimary = (closeMenu?: boolean) =>
    categories.map((category) => {
      const isActive = category.slug === activeCategory;
      return (
        <Link
          key={category._id}
          href={isActive ? "/" : `/?category=${category.slug}`}
          className={isActive ? styles.active : undefined}
          aria-label={isActive ? `Clear ${category.title} filter` : undefined}
          onClick={closeMenu ? () => setIsOpen(false) : undefined}
        >
          {category.title}
          {isActive && (
            <span className={styles.clear} aria-hidden="true">
              ✕
            </span>
          )}
        </Link>
      );
    });

  const renderSecondary = (closeMenu?: boolean) =>
    secondary.map((item) => {
      if (item.children) {
        const childActive = item.children.some((c) => c.href === pathname);
        const expanded = pressOpen ?? childActive;
        return (
          <div key={item.label} className={styles.secondaryGroup}>
            <button
              type="button"
              className={`${styles.groupToggle} ${childActive ? styles.active : ""}`}
              aria-expanded={expanded}
              onClick={() => setPressOpen(!expanded)}
            >
              {item.label}
            </button>
            {expanded && (
              <span className={styles.subList}>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={pathname === child.href ? styles.active : undefined}
                    onClick={closeMenu ? () => setIsOpen(false) : undefined}
                  >
                    {child.label}
                  </Link>
                ))}
              </span>
            )}
          </div>
        );
      }
      return (
        <Link
          key={item.href}
          href={item.href}
          className={pathname === item.href ? styles.active : undefined}
          onClick={closeMenu ? () => setIsOpen(false) : undefined}
        >
          {item.label}
        </Link>
      );
    });

  return (
    <>
      {/* Desktop: fixed full-height left rail. */}
      <header className={styles.rail}>
        <div className={styles.railTop}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="House of Design — home"
          >
            <Logo className={styles.logo} />
          </Link>
          <nav className={styles.primary} aria-label="Project categories">
            {renderPrimary()}
          </nav>
        </div>

        <nav className={styles.secondary} aria-label="Secondary">
          {renderSecondary()}
        </nav>
      </header>

      {/* Mobile: in-flow header + drawer that slides open beneath it and
          pushes the page content down (per mobile-menu-expanded.png). */}
      <div className={styles.mobileHeader}>
        <div className={styles.bar}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="House of Design — home"
          >
            <Logo className={styles.logo} />
          </Link>
          <button
            className={styles.hamburger}
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <span className={styles.closeGlyph}>✕</span>
            ) : (
              <>
                <span className={styles.line} />
                <span className={styles.line} />
              </>
            )}
          </button>
        </div>

        <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
          <div className={styles.drawerInner}>
            <nav
              className={styles.drawerPrimary}
              aria-label="Project categories"
            >
              {renderPrimary(true)}
            </nav>
            <nav
              className={styles.drawerSecondary}
              aria-label="Mobile secondary"
            >
              {renderSecondary(true)}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
