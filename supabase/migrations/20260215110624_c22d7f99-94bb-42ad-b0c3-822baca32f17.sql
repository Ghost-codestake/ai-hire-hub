
-- Create application stage enum
CREATE TYPE public.application_stage AS ENUM ('applied', 'shortlisted', 'interview', 'hired', 'rejected');

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own candidates"
ON public.candidates FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all candidates"
ON public.candidates FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters can create candidates"
ON public.candidates FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Recruiters can update own candidates"
ON public.candidates FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Recruiters can delete own candidates"
ON public.candidates FOR DELETE
USING (auth.uid() = created_by);

CREATE TRIGGER update_candidates_updated_at
BEFORE UPDATE ON public.candidates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create applications table (links candidates to jobs with stage tracking)
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  stage application_stage NOT NULL DEFAULT 'applied',
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(candidate_id, job_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can view own applications"
ON public.applications FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all applications"
ON public.applications FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Recruiters can create applications"
ON public.applications FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Recruiters can update own applications"
ON public.applications FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Recruiters can delete own applications"
ON public.applications FOR DELETE
USING (auth.uid() = created_by);

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create resume storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policies for resumes
CREATE POLICY "Users can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
