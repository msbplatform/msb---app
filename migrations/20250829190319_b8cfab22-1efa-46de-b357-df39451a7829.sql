-- Fix function search path security warning
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
SECURITY INVOKER
STABLE
SET search_path = public
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