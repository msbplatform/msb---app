
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users } from "lucide-react";

const campaigns = [
  {
    id: 1,
    title: "Help the local community",
    description: "Supporting families in need with essential resources and education opportunities",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop&crop=center",
    raised: "$1,245",
    goal: "$2,000",
    supporters: 24
  },
  {
    id: 2,
    title: "Educational Programs",
    description: "Providing quality education and learning materials to underserved communities",
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=300&h=200&fit=crop&crop=center",
    raised: "$3,890",
    goal: "$5,000",
    supporters: 67
  },
  {
    id: 3,
    title: "Health Initiative",
    description: "Bringing healthcare access and medical supplies to remote areas",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop&crop=center",
    raised: "$2,156",
    goal: "$3,500",
    supporters: 43
  }
];

const CampaignsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-sm text-gray-500 font-medium tracking-wide uppercase mb-4">
            Campaigns
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Campaigns
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our current initiatives and join thousands of supporters making a real difference 
            in communities around the world.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">{campaign.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center text-gray-500">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {campaign.raised} raised
                    </span>
                    <span className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {campaign.supporters} supporters
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(parseInt(campaign.raised.replace('$', '').replace(',', '')) / parseInt(campaign.goal.replace('$', '').replace(',', ''))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Goal: {campaign.goal}</span>
                    <Button size="sm" className="bg-black text-white hover:bg-gray-800" asChild>
                      <a href={`/campaign/${campaign.id}`}>
                        View Campaign
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            View All Campaigns
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CampaignsSection;
