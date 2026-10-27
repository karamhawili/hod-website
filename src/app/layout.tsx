import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { EB_Garamond, Libre_Franklin } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import {
  OPEN_GRAPH_DEFAULTS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import { SanityLive } from "@/sanity/lib/live";

// Fonts (VVD direction): EB Garamond stands in for Custodia Pro (old-style serif
// display), Libre Franklin for News Gothic Std (body sans).
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-libre-franklin",
  display: "swap",
});

// Pages set just their own name as `title`; the template adds the brand.
// The default Open Graph image is ./opengraph-image.tsx (project pages
// override it with their first gallery image).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: {
    ...OPEN_GRAPH_DEFAULTS,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

// Matches --color-bg so mobile browser chrome blends into the page.
export const viewport: Viewport = {
  themeColor: "#fffffa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The Studio (/admin) must not run the frontend's SanityLive (see
  // proxy.ts). Pathname comes from the proxy-set header.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isStudio = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${libreFranklin.variable}`}
    >
      <head>
        {/* Runs before first paint: if the home intro has already been seen
            this session, mark <html> so CSS hides the intro immediately —
            preventing a one-frame flash on an already-seen full reload (the
            server can't read sessionStorage, so it always renders the intro). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('hod-intro-seen'))document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
      <Analytics />
      {!isStudio && <SanityLive />}
    </html>
  );
}
