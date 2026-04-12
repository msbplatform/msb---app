import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle: string;
}

const DonationModal = ({ isOpen, onClose, campaignId, campaignTitle }: DonationModalProps) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const donationAmount = parseFloat(amount) || 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers with up to 2 decimal places
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleDonate = async () => {
    if (donationAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Minimum donation amount is £1.00",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to make a donation.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: {
          campaignId,
          amount: donationAmount,
          message: message.trim() || null,
          isAnonymous,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        onClose();
        
        toast({
          title: "Redirecting to Payment",
          description: "Please complete your donation in the new tab.",
        });
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error('Donation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Support "{campaignTitle}"
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Input Section */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Donation Amount (GBP)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                £
              </span>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
            <p className="text-xs text-gray-500">Minimum donation: £1.00</p>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Optional Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave an encouraging message..."
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous">Make this donation anonymous</Label>
          </div>

          {/* Summary Section */}
          {donationAmount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Donation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Donation amount</span>
                  <span>£{donationAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>£{donationAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={donationAmount < 1 || isProcessing || !user}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          >
            {isProcessing ? "Processing..." : user ? "Donate Now" : "Sign In Required"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
