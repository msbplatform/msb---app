
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonationModal from "@/components/DonationModal";
import DonationsList from "@/components/DonationsList";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MessageCircle, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DonateNow = () => {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  // Get campaign ID from URL params (defaulting to a demo campaign)
  const campaignId = searchParams.get('campaign') || 'demo-campaign';

  useEffect(() => {
    loadCampaignData();
    
    // Check for successful payment
    const sessionId = searchParams.get('session_id');
    const success = searchParams.get('success');
    
    if (sessionId && success === 'true') {
      verifyPayment(sessionId);
    }
  }, [campaignId, searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-donation', {
        body: { sessionId },
      });

      if (error) throw error;

      if (data?.success) {
        
        // Reload campaign data to show updated totals
        loadCampaignData();
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
    }
  };

  const loadCampaignData = async () => {
    try {
      // Load campaign details
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles!campaigns_creator_id_fkey(display_name, username)
        `)
        .eq('id', campaignId)
        .single();

      if (campaignError && campaignError.code !== 'PGRST116') {
        // Use demo data if no campaign found
        setCampaign({
          id: 'demo-campaign',
          title: 'Street dance performance',
          description: 'Jordan performs his favourite dance for a crowd of 10',
          content_url: '/msb-uploads/7b61ebf1-1b3c-4753-a109-9bade3a744e9.png',
          content_type: 'image',
          donation_goal: 200,
          total_raised: 55,
          profiles: { display_name: 'Jordan Lester', username: 'jordanlester123' }
        });
      } else {
        setCampaign(campaignData);
      }

      // Load donations for this campaign using the secure function
      const { data: donationsData, error: donationsError } = await supabase
        .rpc('get_public_donations', { campaign_id_param: campaignId });

      if (!donationsError) {
        const formattedDonations = donationsData.map(donation => ({
          id: donation.id,
          donorName: donation.display_name,
          amount: Number(donation.amount),
          message: donation.message,
          timestamp: donation.created_at,
          isAnonymous: donation.is_anonymous
        }));
        setDonations(formattedDonations);
      } else {
        // Use demo donations if none found
        setDonations([
          {
            id: "1",
            donorName: "Sarah Mitchell",
            amount: 15.00,
            message: "Amazing performance! Keep dancing! 🕺",
            timestamp: "2024-06-26T10:30:00Z",
            isAnonymous: false
          },
          {
            id: "2",
            donorName: "Anonymous",
            amount: 5.00,
            message: "Love your energy!",
            timestamp: "2024-06-26T08:15:00Z",
            isAnonymous: true
          },
          {
            id: "3",
            donorName: "Mike Johnson",
            amount: 25.00,
            message: "",
            timestamp: "2024-06-25T16:45:00Z",
            isAnonymous: false
          },
          {
            id: "4",
            donorName: "Anonymous",
            amount: 10.00,
            message: "Inspiring stuff! 💪",
            timestamp: "2024-06-25T14:20:00Z",
            isAnonymous: true
          }
        ]);
      }
    } catch (error: any) {
      console.error('Error loading campaign data:', error);
      
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading campaign...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h1>
            <p className="text-gray-600">The campaign you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progressPercentage = campaign.donation_goal > 0 
    ? Math.min((campaign.total_raised / campaign.donation_goal) * 100, 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Campaign Details Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 max-w-2xl">
            {/* User Info */}
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <span className="text-gray-700 font-medium">
                {campaign.profiles?.username || campaign.profiles?.display_name || 'Anonymous'}
              </span>
            </div>

            {/* Campaign Content */}
            <div className="relative mb-6">
              {campaign.content_type === 'video' ? (
                <div className="relative">
                  <video
                    src={campaign.content_url}
                    className="w-full h-96 object-cover rounded-lg"
                    controls
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={campaign.content_url}
                    alt={campaign.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {campaign.content_type === 'video' && (
                    <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                      <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-gray-800 ml-1" />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Campaign Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
            {campaign.description && (
              <p className="text-gray-600 mb-6">{campaign.description}</p>
            )}

            {/* Interaction Icons */}
            <div className="flex items-center space-x-6 mb-6">
              <button className="flex items-center space-x-1 text-gray-600">
                <Heart className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-1 text-gray-600">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="flex items-center space-x-1 text-gray-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Donation Progress */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">£0.00</span>
                <span className="text-gray-500">£{campaign.total_raised?.toFixed(2) || '0.00'}</span>
                <span className="font-semibold">£{campaign.donation_goal?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                {progressPercentage.toFixed(1)}% funded
              </div>
            </div>

            {/* Donate Button */}
            <Button 
              onClick={() => setIsDonationModalOpen(true)}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 text-lg rounded-lg mb-8"
            >
              Donate
            </Button>

            {/* Donations List Section */}
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Donations</h2>
              <DonationsList campaignId={campaign?.id || ''} />
            </div>
          </div>
        </section>

        {/* Get in Touch Section */}
        <section className="py-16 bg-yellow-400">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Image */}
              <div className="lg:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=400&fit=crop&crop=center"
                  alt="Team meeting"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>

              {/* Content */}
              <div className="lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  All of this text is editable. Simply click anywhere in the paragraph or heading 
                  text and start typing. You can copy and paste your own content in to see what 
                  it looks like with these font combinations. All of this text is editable. Simply
                </p>
                
                <Button className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-medium">
                  Contact
                </Button>

                {/* Social Icons */}
                <div className="flex space-x-4 mt-8">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">T</span>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">f</span>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">in</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
      />
    </div>
  );
};

export default DonateNow;
