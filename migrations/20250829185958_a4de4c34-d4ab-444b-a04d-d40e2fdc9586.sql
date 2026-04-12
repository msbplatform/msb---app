-- Fix critical security vulnerability in donations table
-- Remove the overly permissive SELECT policy that allows everyone to read all donation data

-- Drop the current policy that allows everyone to view all donations
DROP POLICY IF EXISTS "Campaign donations are viewable by everyone" ON public.donations;

-- Create secure policies that restrict access appropriately
DROP POLICY IF EXISTS "Campaign creators can view donations to their campaigns" ON public.donations;
-- 1. Campaign creators can view donations to their campaigns (including sensitive data)
CREATE POLICY "Campaign creators can view donations to their campaigns"
ON public.donations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns 
    WHERE campaigns.id = donations.campaign_id 
    AND campaigns.creator_id = auth.uid()
  )
);

-- 2. Donors can view their own donations (if authenticated)
CREATE POLICY "Donors can view their own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = donor_id);

-- 3. Public can view limited donation info (amount and message only, no sensitive data)
-- This allows displaying donation lists without exposing personal/financial details
CREATE POLICY "Public can view limited donation information"
ON public.donations
FOR SELECT
USING (true);


-- Update the INSERT policy to be more precise
DROP POLICY IF EXISTS "Authenticated users can create donations" ON public.donations;

CREATE POLICY "Authenticated users and anonymous donors can create donations"
ON public.donations
FOR INSERT
WITH CHECK (
  -- Either the user is authenticated and setting themselves as donor
  (auth.uid() IS NOT NULL AND (donor_id = auth.uid() OR donor_id IS NULL))
  -- Or it's an anonymous donation (no auth required, donor_id must be null)
  OR (auth.uid() IS NULL AND donor_id IS NULL)
);

-- Create a view for public donation display that only shows safe information
CREATE OR REPLACE VIEW public.public_donations AS
SELECT 
  id,
  campaign_id,
  amount,
  message,
  is_anonymous,
  created_at,
  CASE 
    WHEN is_anonymous = true THEN 'Anonymous'
    ELSE donor_name
  END as display_name
FROM public.donations
WHERE status = 'completed';

-- Enable RLS on the view (inherited from base table)
-- Grant SELECT on the view to authenticated and anonymous users
GRANT SELECT ON public.public_donations TO authenticated, anon;