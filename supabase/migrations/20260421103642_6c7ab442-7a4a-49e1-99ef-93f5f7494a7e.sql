-- Add is_approved flag to profiles for admin approval workflow
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved boolean NOT NULL DEFAULT false;

-- Auto-approve any users created by an admin (and existing users)
UPDATE public.profiles SET is_approved = true WHERE user_id IN (SELECT user_id FROM public.user_roles WHERE role = 'admin');

-- Update handle_new_user trigger to set is_approved=false by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_approved)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), false);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

-- Allow admins to update profiles (for approval / blocking)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Admins can update any profile'
  ) THEN
    CREATE POLICY "Admins can update any profile" ON public.profiles
      FOR UPDATE TO authenticated
      USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;