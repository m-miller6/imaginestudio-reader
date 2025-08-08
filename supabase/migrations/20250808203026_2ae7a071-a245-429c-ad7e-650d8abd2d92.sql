-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, adventurer_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name', 
    NEW.raw_user_meta_data ->> 'adventurer_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Backfill existing profiles with email addresses from auth.users
UPDATE public.profiles 
SET email = auth_users.email 
FROM auth.users AS auth_users 
WHERE profiles.user_id = auth_users.id 
AND profiles.email IS NULL;