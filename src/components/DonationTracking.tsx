
import { Button } from "@/components/ui/button";

const DonationTracking = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-primary rounded-3xl overflow-hidden h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&crop=center"
                alt="Donation tracking"
                className="absolute right-8 top-8 w-64 h-64 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-8 left-8 w-20 h-20 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">
              Transparency
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Track your donations
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We believe in complete transparency. Track exactly how your donations are being used 
                and see the real-time impact you're making in communities around the world.
              </p>
              <p>
                Our dashboard provides detailed insights into fund allocation, project progress, 
                and success stories from the people you're helping. Your generosity creates 
                measurable change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationTracking;
