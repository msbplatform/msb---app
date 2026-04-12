-- Add privacy controls to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT true;

-- Add privacy preference for profile visibility
COMMENT ON COLUMN public.profiles.is_public IS 'Controls whether this profile is publicly visible to everyone or only to authenticated users';

-- Create security definer function to check if a profile should be visible
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT CASE
    -- Profile owner can always see their own profile
    WHEN profile_user_id = auth.uid() THEN true
    -- If not logged in, can only see public profiles
    WHEN auth.uid() IS NULL THEN (
      SELECT is_public FROM public.profiles WHERE user_id = profile_user_id
    )
    -- If logged in, can see all public profiles and potentially private ones
    ELSE (
      SELECT COALESCE(is_public, true) FROM public.profiles WHERE user_id = profile_user_id
    )
  END;
$$;

-- Update the RLS policy for profiles to use privacy controls
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view profiles based on privacy settings"
ON public.profiles 
FOR SELECT 
USING (public.can_view_profile(user_id));

-- Add policy for users to update their own privacy settings
CREATE POLICY "Users can update their own profile privacy"
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);