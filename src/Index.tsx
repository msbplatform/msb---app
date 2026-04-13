
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import ImpactSection from "@/components/ImpactSection";
import DonationTracking from "@/components/DonationTracking";
import AnonymousDonation from "@/components/AnonymousDonation";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeatureCards />
      <ImpactSection />
      <DonationTracking />
      <AnonymousDonation />
      <GetInvolvedSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
