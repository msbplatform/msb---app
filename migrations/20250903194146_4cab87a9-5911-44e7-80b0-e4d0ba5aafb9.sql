-- Enhanced security for donations table  
-- Prevent unauthorized updates and deletions, keep existing SELECT policies secure

-- Add explicit policies to prevent unauthorized modifications
-- Only edge functions with service role can update donation status
DROP POLICY IF EXISTS "Prevent unauthorized updates" ON public.donations;
CREATE POLICY "Prevent unauthorized updates"
ON public.donations  
FOR UPDATE
USING (false);

-- Prevent any deletions - donations should never be deleted for audit trail
DROP POLICY IF EXISTS "Prevent unauthorized deletions" ON public.donations;
CREATE POLICY "Prevent unauthorized deletions"
ON public.donations
FOR DELETE  
USING (false);

-- Create a secure function for campaign creators to get donation summaries
-- This excludes sensitive Stripe session IDs while allowing campaign management
CREATE OR REPLACE FUNCTION public.get_campaign_donations_summary(campaign_id_param uuid)
RETURNS TABLE(
  id uuid,
  campaign_id uuid, 
  amount numeric,
  message text,
  is_anonymous boolean,
  created_at timestamp with time zone,
  status text,
  display_name text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow campaign creators to call this function
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
    END as display_name
  FROM public.donations d
  INNER JOIN public.campaigns c ON d.campaign_id = c.id
  WHERE d.campaign_id = campaign_id_param
  AND c.creator_id = auth.uid()
  ORDER BY d.created_at DESC;
$$;