// The VVD direction has no footer: pages simply end. Call sites keep rendering
// <Footer /> so this component stays the single place that decides "no footer".
//
// The old editorial footer's content model (siteSettings: brandLine, locations,
// phone, email, mapUrl, socials) is untouched in the CMS and awaits a new home
// in the Phase 8 Studio/Contact pass.
export default function Footer() {
  return null;
}
