
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-white/10 rounded-3xl overflow-hidden h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&crop=center"
                alt="Contact us"
                className="absolute left-8 top-8 w-64 h-64 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-8 right-8 w-24 h-24 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-16 h-16 bg-white/30 rounded-full"></div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight">
              Get in Touch
            </h2>
            <div className="space-y-4 text-black/80">
              <p>
                Ready to make a difference? We'd love to hear from you. Whether you have questions about our programs, 
                want to get involved, or need support, we're here to help.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <span className="text-black">MSB.earth.help@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
