-- 1. Create assessments table
CREATE TABLE IF NOT EXISTS public.internship_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id UUID NOT NULL REFERENCES public.internship_domains(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g. 'Multiple Choice', 'Coding Task', 'Project Review'
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    questions_count INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create assessment results table
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.internship_assessments(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    score TEXT, -- e.g. "18/20"
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, assessment_id)
);

-- Enable RLS
ALTER TABLE public.internship_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS for internship_assessments
-- Everyone can read active assessments for their domains (handled in app logic, but generally readable)
CREATE POLICY "Assessments are viewable by everyone" 
ON public.internship_assessments FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert/update/delete assessments" 
ON public.internship_assessments FOR ALL 
USING (public.has_role('admin', auth.uid()));

-- RLS for assessment_results
-- Users can see their own results
CREATE POLICY "Users can view their own assessment results" 
ON public.assessment_results FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own results when starting an assessment
CREATE POLICY "Users can create their own assessment results" 
ON public.assessment_results FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own results (e.g. completing it)
CREATE POLICY "Users can update their own assessment results" 
ON public.assessment_results FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can view and manage all assessment results
CREATE POLICY "Admins can view all assessment results" 
ON public.assessment_results FOR SELECT 
USING (public.has_role('admin', auth.uid()));

CREATE POLICY "Admins can manage all assessment results" 
ON public.assessment_results FOR UPDATE 
USING (public.has_role('admin', auth.uid()));
