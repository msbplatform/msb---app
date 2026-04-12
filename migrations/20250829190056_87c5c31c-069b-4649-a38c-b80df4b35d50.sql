-- Fix critical security vulnerability in donations table
-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Campaign donations are viewable by everyone" ON public.donations;
DROP POLICY IF EXISTS "Campaign creators can view donations to their campaigns" ON public.donations;
DROP POLICY IF EXISTS "Donors can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Authenticated users can create donations" ON public.donations;
DROP POLICY IF EXISTS "Authenticated users and anonymous donors can create donations" ON public.donations;

-- Create secure policies that restrict access appropriately
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

-- 3. Create INSERT policy for donations
CREATE POLICY "Authenticated users and anonymous donors can create donations"
ON public.donations
FOR INSERT
WITH CHECK (
  -- Either the user is authenticated and setting themselves as donor
  (auth.uid() IS NOT NULL AND (donor_id = auth.uid() OR donor_id IS NULL))
  -- Or it's an anonymous donation (no auth required, donor_id must be null)
  OR (auth.uid() IS NULL AND donor_id IS NULL)
);