"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import type { NavLink } from "@/types/sanity";
import styles from "./Navigation.module.css";

interface NavigationClientProps {
  theme: "default" | "light";
  nav: NavLink[];
}

export default function NavigationClient({ theme, nav }: NavigationClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // At the top of the page, "light" theme shows warm-white content over a
  // dark/photo hero. Once scrolled onto the frosted bar, content is always dark.
  const isLight = theme === "light" && !scrolled;

  const headerClass = [
    styles.header,
    isLight ? styles.light : "",
    scrolled ? styles.scrolled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClass}>
        <Link href="/" className={styles.logoLink} aria-label="House of Design — home">
          <Logo className={styles.logo} />
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? styles.active : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <span className={styles.line} />
          <span className={styles.line} />
        </button>
      </header>

      <div className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        <nav className={styles.menuList} aria-label="Mobile">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
