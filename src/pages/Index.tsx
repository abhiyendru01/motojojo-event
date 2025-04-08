
import Navbar from "@/components/Navbar"
import CityStrip from "@/components/CityStrip"
import Hero from "@/components/Hero"
import ExperiencesSection from "@/components/ExperiencesSection"
import EventsSection from "@/components/EventsSection"
import ArtistsSection from "@/components/ArtistsSection"
import CategoriesSection from "@/components/CategoriesSection"
import GoogleReviews from "@/components/GoogleReviews"
import FAQSection from "@/components/FAQSection"
import PremiumAd from "@/components/PremiumAd"
import Footer from "@/components/Footer"
import { useEffect } from "react"
import { useCity } from "@/contexts/CityContext"
import { toast } from "sonner"

const Index = () => {
  const { selectedCity, isLoading } = useCity();

  useEffect(() => {
    if (!isLoading && selectedCity) {
      toast(`Showing events in ${selectedCity}`, {
        description: `We've detected your location as ${selectedCity}. You can change this in the city selector.`,
        duration: 5000,
      });
    }
  }, [selectedCity, isLoading]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <CityStrip />
      <Hero />
      <main className="flex-1">
        <ExperiencesSection />
        <EventsSection />
        <ArtistsSection />
        <CategoriesSection />
        <GoogleReviews />
        <FAQSection />
      </main>
      <Footer />
      <PremiumAd />
    </div>
  );
};

export default Index;
