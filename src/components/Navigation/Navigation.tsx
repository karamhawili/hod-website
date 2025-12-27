"use client";

import { useState } from "react";
import styles from "./Navigation.module.css";
import Link from "next/link";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.line}></span>
          <span className={styles.line}></span>
          <span className={styles.line}></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}
        onClick={() => setIsOpen(false)}
      >
        <div className={styles.menuContent}>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            ✕
          </button>
          <ul className={styles.menuList}>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/projects"}>Projects</Link>
            </li>
            <li>
              <Link href={"/about"}>About</Link>
            </li>
            <li>
              <Link href={"/contact"}>Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
