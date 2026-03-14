import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KanbanBoard from "@/components/candidates/KanbanBoard";

const Pipeline = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedJobId, setSelectedJobId] = useState("all");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["pipeline-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, candidates:candidate_id(id, name, email), jobs:job_id(id, title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((a: any) => ({
        id: a.id,
        stage: a.stage,
        candidate_id: a.candidates?.id || "",
        job_id: a.jobs?.id || "",
        candidate_name: a.candidates?.name || "Unknown",
        candidate_email: a.candidates?.email || "",
        job_title: a.jobs?.title || "Unknown Job",
      }));
    },
  });

  const jobs = useMemo(() => {
    const map = new Map<string, string>();
    applications.forEach((a) => {
      if (a.job_id && !map.has(a.job_id)) map.set(a.job_id, a.job_title);
    });
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [applications]);

  const filtered = useMemo(
    () => selectedJobId === "all" ? applications : applications.filter((a) => a.job_id === selectedJobId),
    [applications, selectedJobId]
  );

  const updateStage = useMutation({
    mutationFn: async ({ appId, stage }: { appId: string; stage: string }) => {
      const { error } = await supabase
        .from("applications")
        .update({ stage: stage as any })
        .eq("id", appId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-applications"] });
      toast.success("Stage updated");
    },
    onError: () => toast.error("Failed to update stage"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop candidates between stages
          </p>
        </div>
        {jobs.length > 1 && (
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobs.map((j) => (
                <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading pipeline...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No applications yet. Add candidates and apply them to jobs first.
        </div>
      ) : (
        <KanbanBoard
          applications={filtered}
          onStageChange={(appId, stage) => updateStage.mutate({ appId, stage })}
        />
      )}
    </div>
  );
};

export default Pipeline;
