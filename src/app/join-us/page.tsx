import type { Metadata } from "next";
import Navigation from "@/components/Navigation/Navigation";
import { pageMetadata } from "@/lib/site";
import { getJoinUsPage, getSiteSettings } from "@/sanity/lib/queries";
import JoinUsHero from "./_components/JoinUsHero/JoinUsHero";

export const metadata: Metadata = pageMetadata({
  title: "Join Us",
  description: "Careers at House of Design.",
  path: "/join-us",
});

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
    </>
  );
}
