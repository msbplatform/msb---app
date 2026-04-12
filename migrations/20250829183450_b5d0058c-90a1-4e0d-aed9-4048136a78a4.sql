-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  website_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create campaigns table for content campaigns
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'image')),
  content_url TEXT,
  thumbnail_url TEXT,
  donation_goal DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_raised DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_name TEXT,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  stripe_session_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Campaigns policies
CREATE POLICY "Public campaigns are viewable by everyone" 
ON public.campaigns FOR SELECT 
USING (is_public = true OR auth.uid() = creator_id);

CREATE POLICY "Users can create their own campaigns" 
ON public.campaigns FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own campaigns" 
ON public.campaigns FOR UPDATE 
USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own campaigns" 
ON public.campaigns FOR DELETE 
USING (auth.uid() = creator_id);

-- Donations policies
CREATE POLICY "Campaign donations are viewable by everyone" 
ON public.donations FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create donations" 
ON public.donations FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL OR donor_id IS NULL);

-- Create storage buckets for campaign content
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('campaign-content', 'campaign-content', true),
  ('profile-avatars', 'profile-avatars', true);

-- Storage policies for campaign content
CREATE POLICY "Anyone can view campaign content" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'campaign-content');

CREATE POLICY "Authenticated users can upload campaign content" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'campaign-content' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own campaign content" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'campaign-content' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own campaign content" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'campaign-content' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for profile avatars
CREATE POLICY "Anyone can view profile avatars" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-avatars');

CREATE POLICY "Authenticated users can upload profile avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile avatar" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update campaign total when donations are added
CREATE OR REPLACE FUNCTION public.update_campaign_total()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the campaign's total_raised when a donation is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.campaigns 
    SET total_raised = total_raised + NEW.amount
    WHERE id = NEW.campaign_id;
  END IF;
  
  -- If a donation is cancelled/failed, subtract from total
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE public.campaigns 
    SET total_raised = total_raised - OLD.amount
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update campaign totals
CREATE TRIGGER update_campaign_total_trigger
  AFTER INSERT OR UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_campaign_total();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();