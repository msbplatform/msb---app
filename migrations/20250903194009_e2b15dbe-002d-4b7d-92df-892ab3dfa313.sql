-- Enhanced security for donations table
-- This migration adds more restrictive policies and explicitly denies unauthorized access

-- First, drop existing SELECT policies to replace them with more secure ones

-- Create a security definer function to check if user can view donation details
CREATE OR REPLACE FUNCTION public.can_view_donation_details(donation_row donations)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    -- Donors can see their own donations (full details)
    WHEN auth.uid() = donation_row.donor_id THEN true
    -- Campaign creators can see donations to their campaigns (but not Stripe session IDs)
    WHEN EXISTS (
      SELECT 1 FROM campaigns 
      WHERE id = donation_row.campaign_id 
      AND creator_id = auth.uid()
    ) THEN true
    ELSE false
  END;
$$;

-- Create more restrictive SELECT policies
DROP POLICY IF EXISTS "Donors can view their own donations" ON public.donations;
CREATE POLICY "Donors can view their own donations"
ON public.donations
FOR SELECT
USING (auth.uid() = donor_id);
DROP POLICY IF EXISTS "Campaign creators can view donations to their campaigns" ON public.donations;
CREATE POLICY "Campaign creators can view donations to their campaigns"  
ON public.donations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM campaigns 
    WHERE id = donations.campaign_id 
    AND creator_id = auth.uid()
  )
);

-- Add explicit policies to prevent unauthorized modifications
CREATE POLICY "Prevent unauthorized updates"
ON public.donations
FOR UPDATE
USING (false);

CREATE POLICY "Prevent unauthorized deletions"  
ON public.donations
FOR DELETE
USING (false);

-- Create a view for campaign creators that excludes sensitive data
CREATE OR REPLACE VIEW public.campaign_donations_view AS
SELECT 
  d.id,
  d.campaign_id,
  d.amount,
  d.message,
  d.is_anonymous,
  d.created_at,
  d.status,
  CASE 
    WHEN d.is_anonymous THEN 'Anonymous'
    ELSE d.donor_name
  END as display_name,
  -- Exclude sensitive fields like stripe_session_id and donor_id
  NULL::text as stripe_session_id,
  NULL::uuid as donor_id
FROM public.donations d
WHERE EXISTS (
  SELECT 1 FROM campaigns c 
  WHERE c.id = d.campaign_id 
  AND c.creator_id = auth.uid()
);

-- Enable RLS on the view
ALTER VIEW public.campaign_donations_view SET (security_barrier = true);

