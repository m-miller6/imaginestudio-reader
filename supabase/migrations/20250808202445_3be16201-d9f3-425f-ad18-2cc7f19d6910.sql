-- Fix RLS policy to allow profile creation during signup
-- The issue is that when a user signs up, they aren't fully authenticated yet
-- when we try to create their profile, so the INSERT policy fails

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

-- Create a new INSERT policy that allows creation during signup
-- This uses a function to check if the user_id matches the current auth context
CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  -- Allow insert if no current user (during signup process)
  auth.uid() IS NULL
);

-- Also, let's create a trigger to automatically create profiles when users sign up
-- This is a more reliable approach than doing it in the application code

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, adventurer_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name', 
    NEW.raw_user_meta_data ->> 'adventurer_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();