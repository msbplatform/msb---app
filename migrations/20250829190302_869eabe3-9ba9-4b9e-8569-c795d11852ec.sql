-- Fix security issue with public_donations view
-- Enable RLS on the view and ensure it respects the underlying table's policies

-- First, enable RLS on the public_donations view
ALTER VIEW public.public_donations SET (security_barrier = true);

-- Alternative approach: Drop the view and create a more secure function instead
DROP VIEW IF EXISTS public.public_donations;

-- Create a security definer function that respects RLS policies
CREATE OR REPLACE FUNCTION public.get_public_donations(campaign_id_param uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  campaign_id uuid,
  amount numeric,
  message text,
  is_anonymous boolean,
  created_at timestamp with time zone,
  display_name text
)
LANGUAGE sql
SECURITY INVOKER  -- This ensures RLS policies are respected
STABLE
AS $$
  SELECT 
    d.id,
    d.campaign_id,
    d.amount,
    d.message,
    d.is_anonymous,
    d.created_at,
    CASE 
      WHEN d.is_anonymous = true THEN 'Anonymous'
      ELSE d.donor_name
    END as display_name
  FROM public.donations d
  WHERE d.status = 'completed'
  AND (campaign_id_param IS NULL OR d.campaign_id = campaign_id_param)
  ORDER BY d.created_at DESC;
$$;

-- Grant execute permissions on the function
GRANT EXECUTE ON FUNCTION public.get_public_donations(uuid) TO authenticated, anon;