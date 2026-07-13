import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import { getStudioPage } from "@/sanity/lib/queries";
import StudioDisciplines from "./_components/StudioDisciplines/StudioDisciplines";
import StudioFounder from "./_components/StudioFounder/StudioFounder";
import StudioIntro from "./_components/StudioIntro/StudioIntro";
import StudioTeam from "./_components/StudioTeam/StudioTeam";

export const metadata: Metadata = {
  title: "Studio | House of Design",
};

export default async function StudioPage() {
  const studio = await getStudioPage();

  return (
    <>
      <Navigation />
      <main className="theme-redesign">
        <StudioIntro intro={studio?.intro} />
        <StudioTeam team={studio?.team} />
        <StudioDisciplines disciplines={studio?.disciplines} />
        <StudioFounder founder={studio?.founder} />
      </main>
      <Footer />
    </>
  );
}
