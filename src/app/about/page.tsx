import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import AboutHero from "./_components/AboutHero/AboutHero";
import AboutWorkWithUs from "./_components/AboutWorkWithUs/AboutWorkWithUs";
import AboutFounder from "./_components/AboutFounder/AboutFounder";
import AboutServices from "./_components/AboutServices/AboutServices";

export default function About() {
  return (
    <>
      <Navigation />
      <main>
        <AboutHero />
        <AboutWorkWithUs />
        <AboutFounder />
        <AboutServices />
      </main>
      <Footer showGradient={false} />
    </>
  );
}
