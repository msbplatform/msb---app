-- Fix security warning: Add proper search path to function
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
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