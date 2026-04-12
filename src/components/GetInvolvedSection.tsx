
import { Button } from "@/components/ui/button";

const GetInvolvedSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-gray-100 rounded-3xl overflow-hidden h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop&crop=center"
                alt="Get involved"
                className="absolute right-8 bottom-8 w-64 h-64 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-8 left-8 w-32 h-32 bg-white/50 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-20 h-20 bg-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="text-sm text-gray-500 font-medium tracking-wide uppercase">
              Get Involved
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Want to help? Here's how
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                There are many ways to get involved and make a difference. Whether you want to volunteer, 
                donate, or spread awareness, every action counts toward creating positive change.
              </p>
              <p>
                Join our community of changemakers and discover how you can contribute your unique skills 
                and passion to help us achieve our mission of empowering creators and enriching lives.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-black text-white hover:bg-gray-800 transition-colors"
                onClick={() => window.location.href = '/campaigns'}
              >
                Start Helping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
