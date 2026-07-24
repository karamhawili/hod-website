import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import { getJoinUsPage, getSiteSettings } from "@/sanity/lib/queries";
import JoinUsHero from "./_components/JoinUsHero/JoinUsHero";

export const metadata: Metadata = {
  title: "Join Us | House of Design",
};

export default async function JoinUs() {
  const [joinUs, settings] = await Promise.all([
    getJoinUsPage(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navigation />
      <main className="theme-redesign rail-offset">
        <JoinUsHero joinUs={joinUs} fallbackEmail={settings?.email} />
      </main>
      <Footer />
    </>
  );
}
