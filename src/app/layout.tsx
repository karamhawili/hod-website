import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Darker_Grotesque,
  Alex_Brush,
} from "next/font/google";
import "./globals.css";

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

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alex-brush",
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
      className={`${cormorant.variable} ${darkerGrotesque.variable} ${alexBrush.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
