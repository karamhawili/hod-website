"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import type { NavLink } from "@/types/sanity";
import styles from "./Navigation.module.css";

interface NavigationClientProps {
  nav: NavLink[];
  secondaryNav: NavLink[];
}

export default function NavigationClient({
  nav,
  secondaryNav,
}: NavigationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (href: string) =>
    pathname === href ? styles.active : undefined;

  const primaryLinks = (
    <>
      {nav.map((item) => (
        <Link key={item.href} href={item.href} className={linkClass(item.href)}>
          {item.label}
        </Link>
      ))}
    </>
  );

  const secondaryLinks = (
    <>
      {secondaryNav.map((item) => (
        <Link key={item.href} href={item.href} className={linkClass(item.href)}>
          {item.label}
        </Link>
      ))}
    </>
  );

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
          <nav className={styles.primary} aria-label="Primary">
            {primaryLinks}
          </nav>
        </div>

        <nav className={styles.secondary} aria-label="Secondary">
          {secondaryLinks}
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

        <div
          className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        >
          <div className={styles.drawerInner}>
            <nav className={styles.drawerPrimary} aria-label="Mobile primary">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass(item.href)}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav
              className={styles.drawerSecondary}
              aria-label="Mobile secondary"
            >
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass(item.href)}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
