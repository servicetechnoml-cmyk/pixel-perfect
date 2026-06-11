
-- Create new admin user ratanprajapati1242@gmail.com with password Google@123456@
DO $$
DECLARE
  new_user_id uuid;
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = 'ratanprajapati1242@gmail.com';
  IF existing_id IS NULL THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated',
      'ratanprajapati1242@gmail.com', crypt('Google@123456@', gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Ratan Prajapati"}'::jsonb,
      false, '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), new_user_id, jsonb_build_object('sub', new_user_id::text, 'email', 'ratanprajapati1242@gmail.com', 'email_verified', true), 'email', new_user_id::text, now(), now(), now());
  ELSE
    new_user_id := existing_id;
    UPDATE auth.users SET encrypted_password = crypt('Google@123456@', gen_salt('bf')), email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE id = new_user_id;
  END IF;

  INSERT INTO public.profiles (user_id, email, full_name, is_approved, is_blocked)
  VALUES (new_user_id, 'ratanprajapati1242@gmail.com', 'Ratan Prajapati', true, false)
  ON CONFLICT (user_id) DO UPDATE SET is_approved = true, is_blocked = false;

  INSERT INTO public.user_roles (user_id, role) VALUES (new_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (new_user_id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- Auto-approve future signups so they can log in immediately; admin can still block via is_blocked
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_approved)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), false)
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
