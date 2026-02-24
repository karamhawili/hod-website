import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Darker_Grotesque,
  Great_Vibes,
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
      className={`${cormorant.variable} ${darkerGrotesque.variable} ${greatVibes.variable}`}
    >
      <body>{children}</body>
      <Analytics />
      <SanityLive />
    </html>
  );
}
