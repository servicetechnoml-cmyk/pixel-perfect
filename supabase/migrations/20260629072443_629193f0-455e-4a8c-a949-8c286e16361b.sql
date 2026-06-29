
-- Enable RLS on assessment_results
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessment results"
  ON public.assessment_results FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own assessment results"
  ON public.assessment_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessment results"
  ON public.assessment_results FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete assessment results"
  ON public.assessment_results FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable RLS on internship_assessments
ALTER TABLE public.internship_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active assessments"
  ON public.internship_assessments FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage assessments"
  ON public.internship_assessments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Restrict admin_update_user_password: only admins should be able to call it.
-- The function already checks has_role(admin) internally, but revoking EXECUTE
-- from anon/authenticated prevents the function from being callable at all
-- by non-admins via the Data API.
REVOKE EXECUTE ON FUNCTION public.admin_update_user_password(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_password(uuid, text) TO service_role;
