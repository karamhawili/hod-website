import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import OutwardIcon from "@/components/icons/OutwardIcon";
import { getSiteSettings } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/types/sanity";
import styles from "./Footer.module.css";

// Rendered when siteSettings hasn't been populated yet — mirrors the content
// the site shipped with, so the footer is never empty.
const FALLBACK: SiteSettings = {
  brandLine: "House of Design by Suzy Habre",
  nav: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Studio", href: "/studio" },
    { label: "Join Us", href: "/join-us" },
  ],
  locations: [
    { label: "Beirut", address: "Achrafieh,\nBeirut, Lebanon" },
    { label: "Dubai", address: "Dubai Harbour,\nnext to Bebeach" },
  ],
  phone: "+961 1 234 567",
  email: "info@houseofdesign.lb",
  mapUrl: "https://share.google/T6E7xd9yVVf3A9qDH",
  socials: [
    {
      platform: "instagram",
      url: "https://www.instagram.com/hod.houseofdesign/",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/company/addmindhospitality/",
    },
  ],
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

interface FooterProps {
  // Kept for out-of-scope /project/[slug] + /join-us, which still pass it.
  // The redesign has no gradient, so it no longer affects rendering.
  showGradient?: boolean;
}

export default async function Footer({ showGradient }: FooterProps) {
  const settings = await getSiteSettings();

  const brandLine = settings?.brandLine ?? FALLBACK.brandLine;
  const nav = settings?.nav?.length ? settings.nav : FALLBACK.nav;
  const locations = settings?.locations?.length
    ? settings.locations
    : FALLBACK.locations;
  const phone = settings?.phone ?? FALLBACK.phone;
  const email = settings?.email ?? FALLBACK.email;
  const mapUrl = settings?.mapUrl ?? FALLBACK.mapUrl;
  const socials = settings?.socials?.length
    ? settings.socials
    : FALLBACK.socials;

  return (
    <footer
      className={styles.footer}
      data-legacy-gradient={showGradient ? "" : undefined}
    >
      <div className={styles.inner}>
        {/* Vertical hairline running the full height of the footer. */}
        <span className={styles.divider} aria-hidden="true" />

        <div className={styles.masthead}>
          <div className={styles.brand}>
            <Link
              href="/"
              className={styles.logoLink}
              aria-label="House of Design — home"
            >
              <Logo className={styles.logo} />
            </Link>
          </div>

          <div className={styles.cols}>
            {nav && nav.length > 0 && (
              <nav className={styles.col} aria-label="Footer">
                <h2 className={styles.colLabel}>Menu</h2>
                <ul className={styles.colList}>
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {locations && locations.length > 0 && (
              <div className={styles.col}>
                <h2 className={styles.colLabel}>Studios</h2>
                <ul className={`${styles.colList} ${styles.studioList}`}>
                  {locations.map((loc) => (
                    <li key={loc.label}>
                      <address className={styles.studio}>
                        <span className={styles.studioLabel}>{loc.label}</span>
                        {loc.address?.split("\n").map((line, i) => (
                          <span key={i} className={styles.studioLine}>
                            {line}
                          </span>
                        ))}
                      </address>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.col}>
              <h2 className={styles.colLabel}>Connect</h2>
              <ul className={styles.colList}>
                {email && (
                  <li>
                    <a href={`mailto:${email}`}>{email}</a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
                  </li>
                )}
                {socials?.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {SOCIAL_LABELS[social.platform] ?? social.platform}
                      <OutwardIcon className={styles.arrow} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className={styles.rule} />

        <div className={styles.meta}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} {brandLine}
          </span>
          {mapUrl && (
            <Link
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              View Map
              <OutwardIcon className={styles.arrow} />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
