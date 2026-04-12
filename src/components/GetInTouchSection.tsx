
import { Button } from "@/components/ui/button";

const GetInTouchSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative">
            <div className="bg-primary rounded-3xl overflow-hidden h-[400px] relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center"
                alt="Team meeting"
                className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover rounded-2xl filter sepia"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Get in Touch
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                All of this text is editable. Simply click anywhere in the paragraph or heading 
                text and start typing. You can copy and paste your own content in to see what 
                it looks like with these font combinations. All of this text is editable. Simply 
                click anywhere in the paragraph or heading text and start typing.
              </p>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 transition-colors">
              Contact
            </Button>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 pt-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black font-bold">T</span>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black font-bold">F</span>
              </div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black font-bold">L</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;
