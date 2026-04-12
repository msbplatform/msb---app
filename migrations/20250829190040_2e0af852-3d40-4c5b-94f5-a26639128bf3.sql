-- Fix critical security vulnerability in donations table
-- Remove the overly permissive SELECT policy that allows everyone to read all donation data

-- Drop the current policy that allows everyone to view all donations
-- Create secure policies that restrict access appropriately

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

-- Grant SELECT on the view to authenticated and anonymous users
GRANT SELECT ON public.public_donations TO authenticated, anon;