import { Fragment } from "react";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { getSiteSettings } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/types/sanity";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact — House of Design",
};

// Fallbacks mirror the old footer so the page is never empty pre-CMS.
const FALLBACK: SiteSettings = {
  brandLine: "House of Design by Suzy Habre",
  locations: [
    { label: "Beirut", address: "Achrafieh,\nBeirut, Lebanon" },
    { label: "Dubai", address: "Dubai Harbour,\nnext to Bebeach" },
  ],
  phone: "+961 1 234 567",
  email: "info@houseofdesign.lb",
  mapUrl: "https://share.google/T6E7xd9yVVf3A9qDH",
  socials: [
    { platform: "instagram", url: "https://www.instagram.com/hod.houseofdesign/" },
    { platform: "linkedin", url: "https://www.linkedin.com/company/addmindhospitality/" },
  ],
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const brandLine = settings?.brandLine ?? FALLBACK.brandLine;
  const locations = settings?.locations?.length
    ? settings.locations
    : FALLBACK.locations;
  const phone = settings?.phone ?? FALLBACK.phone;
  const email = settings?.email ?? FALLBACK.email;
  const socials = settings?.socials?.length
    ? settings.socials
    : FALLBACK.socials;

  return (
    <>
      <Navigation />
      <main className={`theme-redesign rail-offset ${styles.main}`}>
        <div className={styles.contact}>
          <h1 className={styles.title}>Contact</h1>

          {brandLine && <p className={styles.brand}>{brandLine}</p>}

          {locations && locations.length > 0 && (
            <div className={styles.locations}>
              {locations.map((loc) => (
                <address key={loc.label} className={styles.location}>
                  <span className={styles.locationLabel}>{loc.label}</span>
                  {loc.address?.split("\n").map((line, i) => (
                    <span key={i} className={styles.line}>
                      {line}
                    </span>
                  ))}
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className={styles.phone}
                    >
                      T: {phone}
                    </a>
                  )}
                </address>
              ))}
            </div>
          )}

          <div className={styles.inquiries}>
            {email && (
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Inquiries:</span>
                <a href={`mailto:${email}`} className={styles.link}>
                  {email}
                </a>
              </p>
            )}

            {socials && socials.length > 0 && (
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Socials:</span>
                <span className={styles.socials}>
                  {socials.map((social, i) => (
                    <Fragment key={social.platform}>
                      {i > 0 && (
                        <span className={styles.dot} aria-hidden="true">
                          ·
                        </span>
                      )}
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {SOCIAL_LABELS[social.platform] ?? social.platform}
                      </a>
                    </Fragment>
                  ))}
                </span>
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
