import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Darker_Grotesque,
  Great_Vibes,
  Inter,
  Manrope,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
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

// Redesign fonts (warm neutral + brown, k-studio-style editorial).
// The three fonts above are kept for now because out-of-scope pages
// (/portfolio, /project) + the not-yet-rebuilt About still resolve
// --font-serif/--font-sans/--font-script through them.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "House of Design",
  description:
    "Leading design studio - Private Residential, Restaurants, Lounge, Beaches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${darkerGrotesque.variable} ${greatVibes.variable} ${manrope.variable} ${inter.variable}`}
    >
      <body>{children}</body>
      <Analytics />
      <SanityLive />
    </html>
  );
}
