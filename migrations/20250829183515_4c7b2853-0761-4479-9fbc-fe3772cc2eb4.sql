-- Fix security warnings by adding proper search_path to functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Anonymous User'));
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_campaign_total()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Update the campaign's total_raised when a donation is completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.campaigns 
    SET total_raised = total_raised + NEW.amount
    WHERE id = NEW.campaign_id;
  END IF;
  
  -- If a donation is cancelled/failed, subtract from total
  IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
    UPDATE public.campaigns 
    SET total_raised = total_raised - OLD.amount
    WHERE id = NEW.campaign_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;