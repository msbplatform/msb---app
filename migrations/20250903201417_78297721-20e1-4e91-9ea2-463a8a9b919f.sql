-- Ensure profiles.user_id is unique so it can be referenced by foreign keys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass
      AND conname = 'profiles_user_id_unique'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Add a foreign key from campaigns.creator_id to profiles.user_id
-- Using NOT VALID to avoid failing if legacy rows are missing profiles; it will still
-- enforce the FK for new/updated rows and allows PostgREST to discover the relationship.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.campaigns'::regclass
      AND conname = 'campaigns_creator_id_fkey_profiles_user_id'
  ) THEN
    ALTER TABLE public.campaigns
    ADD CONSTRAINT campaigns_creator_id_fkey_profiles_user_id
    FOREIGN KEY (creator_id)
    REFERENCES public.profiles(user_id)
    ON DELETE RESTRICT
    NOT VALID;
  END IF;
END $$;
