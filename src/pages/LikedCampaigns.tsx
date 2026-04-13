import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LikedCampaign {
  id: string;
  title: string;
  description: string;
  content_url: string;
  content_type: string;
  donation_goal: number;
  total_raised: number;
  created_at: string;
  profiles?: {
    display_name?: string;
  } | null;
}

const LikedCampaigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<LikedCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadLikedCampaigns();
  }, [user, navigate]);

  const loadLikedCampaigns = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get campaign IDs that the user has liked
      const { data: likes, error: likesError } = await supabase
        .from('campaign_likes')
        .select('campaign_id')
        .eq('user_id', user.id);

      if (likesError) throw likesError;

      if (!likes || likes.length === 0) {
        setCampaigns([]);
        return;
      }

      const campaignIds = likes.map(like => like.campaign_id);

      // Get the actual campaign data
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles (
            display_name
          )
        `)
        .in('id', campaignIds)
        .eq('is_public', true);

      if (campaignsError) throw campaignsError;

      setCampaigns(campaignsData || []);
    } catch (error) {
      console.error('Error loading liked campaigns:', error);
      toast({
        title: "Error loading campaigns",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (campaignId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('campaign_likes')
        .delete()
        .eq('campaign_id', campaignId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Remove from local state
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));

      toast({
        title: "Removed from liked campaigns",
        description: "Campaign has been removed from your likes.",
      });
    } catch (error) {
      console.error('Error unliking campaign:', error);
      toast({
        title: "Error",
        description: "Failed to unlike campaign. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Heart className="w-8 h-8 fill-red-500 text-red-500" />
                Liked Campaigns
              </h1>
              <p className="text-muted-foreground mt-1">
                {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'} you've liked
              </p>
            </div>
          </div>

          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No liked campaigns yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start exploring campaigns and like the ones you want to support!
                </p>
                <Button onClick={() => navigate('/campaigns')}>
                  Browse Campaigns
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => {
                const progressPercentage = campaign.donation_goal > 0 
                  ? Math.min((campaign.total_raised / campaign.donation_goal) * 100, 100)
                  : 0;

                return (
                  <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div 
                      className="relative h-48 cursor-pointer"
                      onClick={() => navigate(`/campaign/${campaign.id}`)}
                    >
                      {campaign.content_type === 'video' ? (
                        <video 
                          className="w-full h-full object-cover"
                          src={campaign.content_url}
                        />
                      ) : (
                        <img 
                          src={campaign.content_url} 
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{campaign.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {campaign.profiles?.display_name || 'Anonymous'}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {campaign.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-foreground">
                            £{campaign.total_raised.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            of £{campaign.donation_goal.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => navigate(`/campaign/${campaign.id}`)}
                        >
                          View Campaign
                        </Button>
                        <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => handleUnlike(campaign.id)}
                        >
                          <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LikedCampaigns;