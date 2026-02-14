
-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  location TEXT,
  job_type TEXT NOT NULL DEFAULT 'full-time',
  status TEXT NOT NULL DEFAULT 'open',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Recruiters can view their own jobs
CREATE POLICY "Recruiters can view own jobs"
ON public.jobs FOR SELECT
USING (auth.uid() = created_by);

-- Admins can view all jobs
CREATE POLICY "Admins can view all jobs"
ON public.jobs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Recruiters can create jobs
CREATE POLICY "Recruiters can create jobs"
ON public.jobs FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Recruiters can update own jobs
CREATE POLICY "Recruiters can update own jobs"
ON public.jobs FOR UPDATE
USING (auth.uid() = created_by);

-- Recruiters can delete own jobs
CREATE POLICY "Recruiters can delete own jobs"
ON public.jobs FOR DELETE
USING (auth.uid() = created_by);

-- Trigger for updated_at
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
