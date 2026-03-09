
CREATE TABLE IF NOT EXISTS public.ai_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  skill_gaps TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  recommendation TEXT,
  interview_questions JSONB DEFAULT '[]',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(application_id)
);

ALTER TABLE public.ai_scores ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view ai scores they created' AND tablename = 'ai_scores') THEN
    CREATE POLICY "Users can view ai scores they created" ON public.ai_scores FOR SELECT TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert ai scores' AND tablename = 'ai_scores') THEN
    CREATE POLICY "Users can insert ai scores" ON public.ai_scores FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their ai scores' AND tablename = 'ai_scores') THEN
    CREATE POLICY "Users can update their ai scores" ON public.ai_scores FOR UPDATE TO authenticated USING (created_by = auth.uid());
  END IF;
END $$;
