-- Create campaign_likes table
CREATE TABLE public.campaign_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- Enable RLS
ALTER TABLE public.campaign_likes ENABLE ROW LEVEL SECURITY;

-- Users can view all likes
CREATE POLICY "Anyone can view likes"
ON public.campaign_likes
FOR SELECT
USING (true);

-- Users can like campaigns
CREATE POLICY "Users can create their own likes"
ON public.campaign_likes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can unlike campaigns
CREATE POLICY "Users can delete their own likes"
ON public.campaign_likes
FOR DELETE
USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_campaign_likes_campaign_id ON public.campaign_likes(campaign_id);
CREATE INDEX idx_campaign_likes_user_id ON public.campaign_likes(user_id);