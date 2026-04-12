
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface Donation {
  id: string;
  campaign_id: string;
  amount: number;
  message?: string;
  created_at: string;
  is_anonymous: boolean;
  display_name: string;
}

interface DonationsListProps {
  campaignId: string;
  onDonationUpdate?: (newTotal: number) => void;
}

const DonationsList = ({ campaignId, onDonationUpdate }: DonationsListProps) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
    setupRealtimeSubscription();
  }, [campaignId]);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_public_donations', { campaign_id_param: campaignId });

      if (error) {
        console.error('Error fetching donations:', error);
        return;
      }

      setDonations(data || []);
      
      // Calculate total and notify parent
      const total = (data || []).reduce((sum: number, donation: any) => sum + Number(donation.amount), 0);
      onDonationUpdate?.(total);
      
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('donations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'donations',
          filter: `campaign_id=eq.${campaignId}`
        },
        () => {
          fetchDonations(); // Refresh donations when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (donations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-lg">No donations yet — be the first to support this campaign!</p>
      </div>
    );
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const donationTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - donationTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - donationTime.getTime()) / (1000 * 60));
      return diffInMinutes === 0 ? "Just now" : `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">Recent Donations</h3>
        <p className="text-sm text-muted-foreground">{donations.length} donation{donations.length !== 1 ? 's' : ''}</p>
      </div>
      
      {donations.map((donation) => (
        <div key={donation.id} className="bg-card rounded-lg p-4 border border-border">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {donation.is_anonymous ? (
                  <span className="font-medium text-foreground">Anonymous</span>
                ) : (
                  <span className="font-medium text-foreground">
                    {donation.display_name || "Anonymous"}
                  </span>
                )}
                <span className="font-semibold text-primary">
                  £{Number(donation.amount).toFixed(2)}
                </span>
              </div>
              {donation.message && (
                <p className="text-muted-foreground text-sm mb-2 italic">"{donation.message}"</p>
              )}
            </div>
          </div>
          <div className="flex items-center text-muted-foreground text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {formatTimeAgo(donation.created_at)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DonationsList;
