import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Share2, MessageCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles(display_name, username)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      console.error('Error loading campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Campaigns
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover meaningful campaigns making a real difference in communities worldwide. 
              Join thousands of supporters in creating positive change.
            </p>
          </div>
        </section>

        {/* Campaigns Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : campaigns.length > 0 ? (
                campaigns.map((campaign) => {
                  const progressPercentage = campaign.donation_goal > 0 
                    ? Math.min((Number(campaign.total_raised || 0) / Number(campaign.donation_goal)) * 100, 100) 
                    : 0;
                    
                  return (
                    <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                     onClick={() => navigate(`/campaign/${campaign.id}`)}>
                      <div className="relative w-full h-48">
                        {campaign.content_type === 'video' ? (
                          <div className="relative w-full h-full">
                            <video src={campaign.content_url} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        ) : (
                          <img src={campaign.content_url} alt={campaign.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">
                            {campaign.profiles?.username || campaign.profiles?.display_name || 'Anonymous'}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                        {campaign.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{campaign.description}</p>
                        )}
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>£{Number(campaign.total_raised || 0).toFixed(2)} raised</span>
                            <span>{progressPercentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${progressPercentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Goal: £{Number(campaign.donation_goal).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Heart className="w-5 h-5 text-gray-400" />
                            <MessageCircle className="w-5 h-5 text-gray-400" />
                            <Share2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/campaign/${campaign.id}`);
                            }}
                            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                            size="sm"
                          >
                            View Campaign
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                  <p className="text-gray-600 mb-6">Be the first to create a campaign and start fundraising!</p>
                  <Button 
                    onClick={() => navigate('/add-content')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  >
                    Create Campaign
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Campaigns;