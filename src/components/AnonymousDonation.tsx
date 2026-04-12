
import { Button } from "@/components/ui/button";

const AnonymousDonation = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">
              Privacy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Donate anonymously at
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We respect your privacy and understand that some prefer to give anonymously. 
                Our secure platform allows you to make meaningful contributions while maintaining 
                complete privacy.
              </p>
              <p>
                Whether you choose to share your story or remain anonymous, every donation makes 
                a difference. Your generosity helps us continue our mission of empowering creators 
                and enriching lives worldwide.
              </p>
            </div>
            <Button 
              className="bg-black text-white hover:bg-gray-800 transition-colors"
              onClick={() => window.location.href = '/add-content'}
            >
              Donate Anonymously
            </Button>
          </div>

          {/* Right Content - Image */}
          <div className="relative">
            <div className="bg-primary rounded-3xl overflow-hidden h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop&crop=center"
                alt="Anonymous donation"
                className="absolute left-8 top-8 w-64 h-64 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-8 right-8 w-24 h-24 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-16 h-16 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnonymousDonation;
