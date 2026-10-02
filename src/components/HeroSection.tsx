
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Helping minds, bodies & souls.     
              One donation at a time.  
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Post a campaign that benefits your mind, body or soul. When a campaign is funded, MSB purchases the campaigners goal for them.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-black text-white hover:bg-gray-800 transition-colors px-8 py-3"
                onClick={() => window.location.href = user ? '/profile' : '/auth'}
              >
                Post/Donate
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="bg-primary rounded-3xl overflow-hidden h-[500px] relative">
              <img
                src="/MSB.HERO.png"
                alt="MSB support for mind, soul and body"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-80 h-80 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-8 left-8 w-32 h-32 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
