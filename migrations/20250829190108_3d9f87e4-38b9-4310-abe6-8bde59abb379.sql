-- Create a public view for donations without SECURITY DEFINER
-- This allows public display of donation information without exposing sensitive data

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

-- Grant SELECT permissions on the view
GRANT SELECT ON public.public_donations TO authenticated, anon;