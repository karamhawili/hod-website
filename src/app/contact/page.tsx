import { Fragment } from "react";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { pageMetadata } from "@/lib/site";
import { getSiteSettings } from "@/sanity/lib/queries";
import styles from "./page.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Contact House of Design in Beirut and Dubai.",
  path: "/contact",
});

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  // Everything comes from Site Settings (Contact group); each line renders
  // only when set.
  const brandLine = settings?.brandLine;
  const locations = settings?.locations ?? [];
  const phone = settings?.phone;
  const email = settings?.email;
  const socials = settings?.socials ?? [];

  return (
    <>
      <Navigation />
      <main className={`theme-redesign rail-offset ${styles.main}`}>
        <div className={styles.contact}>
          <h1 className={styles.title}>Contact</h1>

          {brandLine && <p className={styles.brand}>{brandLine}</p>}

          {locations.length > 0 && (
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

          {(email || socials.length > 0) && (
            <div className={styles.inquiries}>
              {email && (
                <p className={styles.metaLine}>
                  <span className={styles.metaLabel}>Inquiries:</span>
                  <a href={`mailto:${email}`} className={styles.link}>
                    {email}
                  </a>
                </p>
              )}

              {socials.length > 0 && (
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
          )}
        </div>
      </main>
    </>
  );
}
