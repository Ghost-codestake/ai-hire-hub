import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    ).auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { application_id } = await req.json();
    if (!application_id) throw new Error("application_id is required");

    // Fetch application with job and candidate data
    const { data: app, error: appErr } = await supabase
      .from("applications")
      .select("*, jobs:job_id(*), candidates:candidate_id(*)")
      .eq("id", application_id)
      .single();
    if (appErr || !app) throw new Error("Application not found");

    // Fetch resume data if available
    const { data: resumeData } = await supabase
      .from("resume_data")
      .select("*")
      .eq("candidate_id", app.candidate_id)
      .maybeSingle();

    const candidateInfo = resumeData
      ? `Skills: ${resumeData.skills?.join(", ")}\nSummary: ${resumeData.summary}\nExperience: ${JSON.stringify(resumeData.experience)}\nEducation: ${JSON.stringify(resumeData.education)}`
      : `Name: ${app.candidates?.name}, Email: ${app.candidates?.email}`;

    const jobInfo = `Title: ${app.jobs?.title}\nDescription: ${app.jobs?.description || "N/A"}\nRequirements: ${app.jobs?.requirements || "N/A"}\nType: ${app.jobs?.job_type}\nLocation: ${app.jobs?.location || "N/A"}`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert recruiter AI. Analyze the candidate against the job posting and provide a match score, strengths, skill gaps, a recommendation, and 5 tailored interview questions (mix of behavioral and technical).`,
          },
          {
            role: "user",
            content: `## Job Posting\n${jobInfo}\n\n## Candidate Profile\n${candidateInfo}\n\nAnalyze this candidate for the job and return your assessment.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "score_candidate",
              description: "Return candidate assessment",
              parameters: {
                type: "object",
                properties: {
                  match_score: { type: "integer", minimum: 0, maximum: 100, description: "Match percentage 0-100" },
                  strengths: { type: "array", items: { type: "string" }, description: "Key strengths" },
                  skill_gaps: { type: "array", items: { type: "string" }, description: "Missing skills or gaps" },
                  recommendation: { type: "string", description: "2-3 sentence hiring recommendation" },
                  interview_questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        type: { type: "string", enum: ["behavioral", "technical", "situational"] },
                        rationale: { type: "string" },
                      },
                      required: ["question", "type", "rationale"],
                    },
                    description: "5 interview questions",
                  },
                },
                required: ["match_score", "strengths", "skill_gaps", "recommendation", "interview_questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "score_candidate" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call returned from AI");

    const scored = JSON.parse(toolCall.function.arguments);

    // Upsert ai_scores
    const { error: dbError } = await supabase.from("ai_scores").upsert(
      {
        application_id,
        match_score: scored.match_score,
        strengths: scored.strengths,
        skill_gaps: scored.skill_gaps,
        recommendation: scored.recommendation,
        interview_questions: scored.interview_questions,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "application_id" }
    );
    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true, data: scored }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("score-candidate error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
