import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, ExternalLink, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from 'qrcode.react';

interface PublicProfileData {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  website_url: string | null;
  avatar_url: string | null;
  user_id: string;
}

interface Campaign {
  id: string;
  title: string;
  description: string | null;
  content_url: string | null;
  thumbnail_url: string | null;
  content_type: string;
  donation_goal: number;
  total_raised: number;
  status: string;
  created_at: string;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    loadPublicProfile();
    loadPublicCampaigns();
  }, [userId, navigate]);

  const loadPublicProfile = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        navigate('/');
        return;
      }
      
      // Check if the profile should be visible based on privacy settings
      // The RLS policy will handle this, but we can provide better UX messaging
      setProfile(data);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      
      // Handle specific error cases
      if (error.message?.includes('row-level security')) {
      } else {
      }
      navigate('/');
    } finally {
      setProfileLoading(false);
    }
  };

  const loadPublicCampaigns = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('creator_id', userId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = () => {
    if (profile) {
      // For now, we'll create a placeholder modal or mailto link
      // You can replace this with a proper messaging system later
    }
  };

  const getDisplayName = () => {
    return profile?.display_name || profile?.username || 'Anonymous User';
  };

  const getAvatarFallback = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  const currentUrl = `${window.location.origin}/profile/${userId}`;

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Avatar className="w-32 h-32 bg-primary">
                <AvatarImage src={profile.avatar_url || ""} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {getDisplayName()}
            </h1>
            
            {profile.username && (
              <p className="text-xl text-muted-foreground mb-4">@{profile.username}</p>
            )}
            
            {profile.bio && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                {profile.bio}
              </p>
            )}
            
            <div className="flex justify-center gap-4 mb-8">
              <Button onClick={handleMessageClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Mail className="w-4 h-4 mr-2" />
                Message
              </Button>
              
              {profile.website_url && (
                <Button 
                  variant="outline" 
                  asChild
                  className="border-input"
                >
                  <a 
                    href={profile.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Website
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* QR Code Section */}
            <div className="text-center p-6 border border-border rounded-lg bg-card">
              <h3 className="font-semibold text-foreground mb-4">Scan to view profile & donate</h3>
              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  value={currentUrl}
                  size={200}
                  className="w-48 h-48"
                  level="M"
                />
              </div>
              <p className="text-sm text-muted-foreground break-all">
                {currentUrl}
              </p>
            </div>

            {/* Quick Donate Section */}
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="font-semibold text-foreground mb-4">Support {getDisplayName()}</h3>
              <p className="text-muted-foreground mb-6">
                Choose a campaign below to make a donation and support their cause.
              </p>
              <Button 
                onClick={() => navigate('/campaigns')} 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                View All Campaigns
              </Button>
            </div>
          </div>

          {/* Campaigns Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {getDisplayName()}'s Campaigns
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading campaigns...</p>
              </div>
            ) : campaigns.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border border-border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {campaign.content_url || campaign.thumbnail_url ? (
                        <img
                          src={campaign.content_url || campaign.thumbnail_url || ''}
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-foreground text-xl mb-2">{campaign.title}</h3>
                      
                      {campaign.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {campaign.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Goal:</span>
                          <span className="font-medium">£{Number(campaign.donation_goal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Raised:</span>
                          <span className="font-medium text-green-600">£{Number(campaign.total_raised || 0).toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((Number(campaign.total_raised) / Number(campaign.donation_goal)) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => navigate(`/donate-now?campaign=${campaign.id}`)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Donate Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-border rounded-lg bg-card">
                <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Campaigns Yet</h3>
                <p className="text-muted-foreground">
                  {getDisplayName()} hasn't created any public campaigns yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PublicProfile;
