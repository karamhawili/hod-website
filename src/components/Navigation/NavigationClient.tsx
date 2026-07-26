"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import type { CATEGORIES_QUERY_RESULT } from "@/sanity/sanity.types";
import type { NavLink } from "@/types/sanity";
import styles from "./Navigation.module.css";

interface NavigationClientProps {
  categories: CATEGORIES_QUERY_RESULT;
  secondaryNav: NavLink[];
  activeCategory?: string;
}

export default function NavigationClient({
  categories,
  secondaryNav,
  activeCategory,
}: NavigationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
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
          onClick={closeMenu ? () => setIsOpen(false) : undefined}
        >
          {category.title}
        </Link>
      );
    });

  const renderSecondary = (closeMenu?: boolean) =>
    secondaryNav.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={pathname === item.href ? styles.active : undefined}
        onClick={closeMenu ? () => setIsOpen(false) : undefined}
      >
        {item.label}
      </Link>
    ));

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
