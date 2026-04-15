
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import DonationTracking from "@/components/DonationTracking";
import AnonymousDonation from "@/components/AnonymousDonation";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import ContactSection from "@/components/GetInTouchSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeatureCards /> 
      <DonationTracking />
      <AnonymousDonation />
      <GetInvolvedSection />
      <ContactSection />
      <Footer />
    </div>
  );
};
export default Index;
