import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  Cormorant_Garamond,
  Darker_Grotesque,
  EB_Garamond,
  Great_Vibes,
  Libre_Franklin,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import { SanityLive } from "@/sanity/lib/live";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-darker-grotesque",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

// Redesign fonts (VVD direction): EB Garamond stands in for Custodia Pro
// (old-style serif display), Libre Franklin for News Gothic Std (body sans).
// The three fonts above are kept for now because out-of-scope pages
// (/portfolio, /project) still resolve --font-serif/--font-sans/--font-script
// through them.
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

export const metadata: Metadata = {
  title: "House of Design",
  description:
    "Leading design studio - Private Residential, Restaurants, Lounge, Beaches",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The Studio (/admin) must not run the frontend's SanityLive or the splash
  // (see middleware.ts). Pathname comes from the middleware-set header.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isStudio = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${darkerGrotesque.variable} ${greatVibes.variable} ${ebGaramond.variable} ${libreFranklin.variable}`}
    >
      <body>
        {!isStudio && <SplashScreen />}
        {children}
      </body>
      <Analytics />
      {!isStudio && <SanityLive />}
    </html>
  );
}
