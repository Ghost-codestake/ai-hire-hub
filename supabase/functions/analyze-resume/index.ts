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

    // Verify JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!
    ).auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { candidate_id, resume_text } = await req.json();
    if (!candidate_id || !resume_text) throw new Error("candidate_id and resume_text are required");

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
            content: `You are an expert HR analyst. Parse the resume text and extract structured data. Return using the provided tool.`,
          },
          {
            role: "user",
            content: `Parse this resume and extract structured information:\n\n${resume_text}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "parse_resume",
              description: "Return structured resume data",
              parameters: {
                type: "object",
                properties: {
                  summary: { type: "string", description: "2-3 sentence professional summary" },
                  skills: { type: "array", items: { type: "string" }, description: "List of skills" },
                  experience: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        company: { type: "string" },
                        duration: { type: "string" },
                        description: { type: "string" },
                      },
                      required: ["title", "company"],
                    },
                  },
                  education: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        degree: { type: "string" },
                        institution: { type: "string" },
                        year: { type: "string" },
                      },
                      required: ["degree", "institution"],
                    },
                  },
                },
                required: ["summary", "skills", "experience", "education"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "parse_resume" } },
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

    const parsed = JSON.parse(toolCall.function.arguments);

    // Upsert resume_data
    const { error: dbError } = await supabase.from("resume_data").upsert(
      {
        candidate_id,
        summary: parsed.summary,
        skills: parsed.skills,
        experience: parsed.experience,
        education: parsed.education,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "candidate_id" }
    );
    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
