
-- Update jobs SELECT policies: allow any team member to view all jobs
DROP POLICY IF EXISTS "Recruiters can view own jobs" ON public.jobs;
CREATE POLICY "Team members can view all jobs"
ON public.jobs FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'recruiter'::app_role)
);

-- Update candidates SELECT policies: allow any team member to view all candidates
DROP POLICY IF EXISTS "Recruiters can view own candidates" ON public.candidates;
DROP POLICY IF EXISTS "Admins can view all candidates" ON public.candidates;
CREATE POLICY "Team members can view all candidates"
ON public.candidates FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'recruiter'::app_role)
);

-- Update applications SELECT policies: allow any team member to view all applications
DROP POLICY IF EXISTS "Recruiters can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;
CREATE POLICY "Team members can view all applications"
ON public.applications FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'recruiter'::app_role)
);

-- Also drop the now-redundant admin-only SELECT policy on jobs
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;

-- Allow all team members to view all AI scores
DROP POLICY IF EXISTS "Users can view ai scores they created" ON public.ai_scores;
CREATE POLICY "Team members can view all ai scores"
ON public.ai_scores FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'recruiter'::app_role)
);

-- Allow all team members to view all resume data
DROP POLICY IF EXISTS "Users can view resume data they created" ON public.resume_data;
CREATE POLICY "Team members can view all resume data"
ON public.resume_data FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'recruiter'::app_role)
);

-- Allow all team members to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Team members can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'recruiter'::app_role)
);

-- Allow all team members to view all roles (needed for team settings page)
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Team members can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'recruiter'::app_role)
);
