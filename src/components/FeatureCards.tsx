
import { Video, Users, Truck, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Share your story",
    description: "Upload a short video about what you need to benefit your mind, body or soul"
  },
  {
    icon: Users,
    title: "Get Support",
    description: "People watch your video and donate until your goal is met."
  },
  {
    icon: Truck,
    title: "We Deliver",
    description: "We use the donations to buy the essentials you asked for — safely and transparently."
  },
  {
    icon: MessageCircle,
    title: "Contact Creators",
    description: "If you have an idea on how to help a creator, contact them directly!"
  }
];

const FeatureCards = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 text-center group hover:scale-105 transform transition-transform"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
