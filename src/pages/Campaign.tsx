import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Share2, Calendar, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DonationModal from "@/components/DonationModal";
import DonationsList from "@/components/DonationsList";
import CampaignComments from "@/components/CampaignComments";

interface Campaign {
  id: string;
  title: string;
  description: string;
  content_url: string;
  content_type: string;
  thumbnail_url: string;
  donation_goal: number;
  total_raised: number;
  is_public: boolean;
  created_at: string;
  creator_id: string;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
    username?: string;
  } | null;
}

const Campaign = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrivateAccess, setIsPrivateAccess] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId, user]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-donation', {
        body: { sessionId },
      });

      if (error) throw error;

      if (data?.success) {
        // Reload campaign data to reflect updated totals
        await loadCampaign();
      }
    } catch (error) {
      console.error('Payment verification error:', error);
    } finally {
      // Clean up URL parameters
      if (campaignId) {
        window.history.replaceState({}, '', `/campaign/${campaignId}`);
      }
    }
  };

  useEffect(() => {
    // Check for success message from payment redirect
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      verifyPayment(sessionId);
    }
  }, [searchParams, campaignId]);

  const loadCampaign = async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url,
            username
          )
        `)
        .eq('id', campaignId)
        .single();

      if (error) {
        console.error('Error loading campaign:', error);
        setCampaign(null);
        return;
      }

      if (!data) {
        setCampaign(null);
        return;
      }

      // Check if campaign is private and user access
      if (!data.is_public) {
        if (!user || user.id !== data.creator_id) {
          setIsPrivateAccess(true);
          setCampaign(null);
          return;
        }
      }

      setCampaign(data as any);
      
      // Load likes data
      await loadLikesData(campaignId);
    } catch (error) {
      console.error('Error loading campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLikesData = async (campaignId: string) => {
    try {
      // Get total likes count
      const { count } = await supabase
        .from('campaign_likes')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaignId);
      
      setLikesCount(count || 0);

      // Check if current user has liked
      if (user) {
        const { data } = await supabase
          .from('campaign_likes')
          .select('id')
          .eq('campaign_id', campaignId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setIsLiked(!!data);
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  const handleLikeToggle = async () => {
    if (!user) {
      return;
    }

    if (!campaignId) return;

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('campaign_likes')
          .delete()
          .eq('campaign_id', campaignId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setIsLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        // Like
        const { error } = await supabase
          .from('campaign_likes')
          .insert({
            campaign_id: campaignId,
            user_id: user.id
          });

        if (error) throw error;
        
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDonateClick = () => {
    setIsModalOpen(true);
  };

  const handleDonationUpdate = (newTotal: number) => {
    if (campaign) {
      setCampaign(prev => prev ? { ...prev, total_raised: newTotal } : null);
    }
  };

  const handleShareClick = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
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

  if (isPrivateAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card rounded-lg p-8 shadow-sm">
              <EyeOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Private Campaign</h1>
              <p className="text-muted-foreground mb-6">
                This campaign is private and not publicly available.
              </p>
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-card rounded-lg p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-foreground mb-2">Campaign Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The campaign you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </div>
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Campaign Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Media Content */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative rounded-lg overflow-hidden">
                    {campaign.content_type === 'video' ? (
                      <video 
                        controls 
                        className="w-full aspect-video object-cover"
                        poster={campaign.thumbnail_url || undefined}
                      >
                        <source src={campaign.content_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img 
                        src={campaign.content_url} 
                        alt={campaign.title}
                        className="w-full aspect-video object-cover"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Info */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-foreground">{campaign.title}</h1>
                  {!campaign.is_public && user?.id === campaign.creator_id && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Private
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {campaign.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Created on {formatDate(campaign.created_at)}</span>
                </div>
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleLikeToggle}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={handleShareClick}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </Button>
              </div>

              <Separator />

              {/* Creator Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={campaign.profiles?.avatar_url || ''} alt={campaign.profiles?.display_name || 'User'} />
                    <AvatarFallback>
                      {campaign.profiles?.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{campaign.profiles?.display_name || 'Anonymous'}</h3>
                    <p className="text-sm text-muted-foreground">Campaign Creator</p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <a href={`/profile/${campaign.creator_id}`}>
                    View Profile
                  </a>
                </Button>
              </div>

              <Separator />

              {/* Comments Section */}
              <CampaignComments campaignId={campaign.id} />
            </div>

            {/* Donation Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-foreground">
                        £{campaign.total_raised.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        of £{campaign.donation_goal.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {progressPercentage.toFixed(1)}% of goal reached
                    </p>
                  </div>

                  <Button 
                    onClick={handleDonateClick}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    Donate Now
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Donations */}
              <DonationsList 
                campaignId={campaign.id} 
                onDonationUpdate={handleDonationUpdate}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {isModalOpen && (
        <DonationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          campaignId={campaign.id}
          campaignTitle={campaign.title}
        />
      )}
    </div>
  );
};

export default Campaign;
