ALTER TABLE public.internship_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assess_select" ON public.internship_assessments FOR SELECT USING (true);
CREATE POLICY "assess_admin" ON public.internship_assessments FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "results_select" ON public.assessment_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "results_insert" ON public.assessment_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "results_update" ON public.assessment_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "results_admin_select" ON public.assessment_results FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "tickets_insert" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tickets_select" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tickets_admin_select" ON public.support_tickets FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

NOTIFY pgrst, 'reload schema';
