import type { Metadata } from "next";
import { headers } from "next/headers";
import { EB_Garamond, Libre_Franklin } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
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
  // The Studio (/admin) must not run the frontend's SanityLive (see
  // middleware.ts). Pathname comes from the middleware-set header.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isStudio = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${libreFranklin.variable}`}
    >
      <body>{children}</body>
      <Analytics />
      {!isStudio && <SanityLive />}
    </html>
  );
}
