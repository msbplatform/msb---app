import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Plus, Copy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { QRCodeSVG } from 'qrcode.react';
import EditProfileModal from "@/components/EditProfileModal";

const PrivateProfile = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadUserCampaigns();
  }, [user, navigate]);

  const loadUserCampaigns = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error: any) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-8">My Private Profile</h1>
            
            {/* Profile Avatar and Edit Button */}
            <div className="flex justify-center items-center mb-12 relative">
              <Avatar className="w-24 h-24 bg-primary">
                <AvatarImage src={profile?.avatar_url || ""} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {profile?.display_name?.charAt(0)?.toUpperCase() || '👤'}
                </AvatarFallback>
              </Avatar>
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute -right-20"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-8">
            {/* Private Account Section */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Private Account Details</h2>
              
              {/* Email */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              
              {/* Account Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{campaigns.length}</p>
                  <p className="text-sm text-muted-foreground">Campaigns Created</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    £{campaigns.reduce((total, campaign) => total + Number(campaign.total_raised || 0), 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Raised</p>
                </div>
              </div>
            </div>

            {/* Public Profile Information */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Public Profile Information</h2>
              
              {/* Privacy Settings */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">Profile Privacy</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={profile?.is_public ?? true}
                    onChange={async (e) => {
                      try {
                        const { error } = await supabase
                          .from('profiles')
                          .update({ is_public: e.target.checked })
                          .eq('user_id', user.id);
                        
                        if (error) throw error;
                        
                        
                        // Refresh the profile data
                        window.location.reload();
                      } catch (error: any) {
                        console.error('Error updating privacy:', error);
                      }
                    }}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="is_public" className="text-muted-foreground cursor-pointer">
                    Make my profile public (visible to everyone)
                  </label>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {profile?.is_public ?? true 
                    ? "Anyone can view your profile and campaigns" 
                    : "Only you can view your full profile. Others cannot access it."
                  }
                </p>
              </div>
              
              {/* Name */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">Name</h3>
                <p className="text-muted-foreground">{profile?.display_name || 'Not set'}</p>
              </div>

              {/* Username */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">Username</h3>
                <p className="text-muted-foreground">{profile?.username || 'Not set'}</p>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">Bio</h3>
                <p className="text-muted-foreground">{profile?.bio || 'No bio yet'}</p>
              </div>

              {/* Website */}
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">Website or social link</h3>
                {profile?.website_url ? (
                  <a 
                    href={profile.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline cursor-pointer"
                  >
                    {profile.website_url}
                  </a>
                ) : (
                  <p className="text-muted-foreground">Not set</p>
                )}
              </div>
            </div>

            {/* QR Code Section - Only show if profile is public */}
            {(profile?.is_public ?? true) && (
              <div className="text-center py-6 border border-border rounded-lg bg-card">
                <h3 className="font-semibold text-foreground mb-4">Share your public profile</h3>
                <div className="flex justify-center mb-4">
                  <QRCodeSVG
                    value={`${window.location.origin}/profile/${user.id}`}
                    size={160}
                    className="w-32 h-32 sm:w-40 sm:h-40"
                    level="M"
                  />
                </div>
                <p className="text-sm text-muted-foreground break-all px-4">
                  {`${window.location.origin}/profile/${user.id}`}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/profile/${user.id}`);
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            )}

            {/* Privacy Notice for Private Profiles */}
            {!(profile?.is_public ?? true) && (
              <div className="text-center py-6 border border-border rounded-lg bg-muted/50">
                <h3 className="font-semibold text-foreground mb-2">Private Profile</h3>
                <p className="text-muted-foreground text-sm">
                  Your profile is set to private. Enable public visibility above to share your profile link and QR code.
                </p>
              </div>
            )}

            {/* Campaigns Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-foreground">My Campaigns</h3>
                <Button 
                  onClick={() => navigate('/add-content')}
                  className="bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading campaigns...</p>
                </div>
              ) : campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:border-muted transition-colors bg-card">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center overflow-hidden">
                        {campaign.thumbnail_url ? (
                          <img
                            src={campaign.thumbnail_url}
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full bg-muted flex items-center justify-center ${campaign.thumbnail_url ? 'hidden fallback' : ''}`}>
                          <span className="text-muted-foreground text-xs">No image</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-xl mb-1">{campaign.title}</h4>
                        {campaign.description && (
                          <p className="text-muted-foreground text-sm mb-2">{campaign.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Goal: £{Number(campaign.donation_goal).toFixed(2)}</span>
                          <span>Raised: £{Number(campaign.total_raised || 0).toFixed(2)}</span>
                          <span className="capitalize">{campaign.status}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => navigate(`/campaigns/${campaign.id}`)}
                          variant="outline"
                          size="sm"
                        >
                          View Campaign
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-border rounded-lg bg-card">
                  <p className="text-muted-foreground mb-4">You haven't created any campaigns yet.</p>
                  <Button 
                    onClick={() => navigate('/add-content')}
                    className="bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={() => {
          refreshProfile();
          loadUserCampaigns();
        }}
      />

      <Footer />
    </div>
  );
};

export default PrivateProfile;
