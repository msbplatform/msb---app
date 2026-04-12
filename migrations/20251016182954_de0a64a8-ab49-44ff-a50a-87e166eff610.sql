-- Create campaign_comments table
CREATE TABLE public.campaign_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaign_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view comments"
  ON public.campaign_comments
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.campaign_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.campaign_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON public.campaign_comments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_campaign_comments_campaign_id ON public.campaign_comments(campaign_id);
CREATE INDEX idx_campaign_comments_user_id ON public.campaign_comments(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_campaign_comments_updated_at
  BEFORE UPDATE ON public.campaign_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();