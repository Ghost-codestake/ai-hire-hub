import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Phone, FileText, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useState } from "react";
import ApplicationPipeline from "@/components/candidates/ApplicationPipeline";

const STAGES = ["applied", "shortlisted", "interview", "hired", "rejected"] as const;

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");

  const { data: candidate, isLoading } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: applications = [] } = useQuery({
    queryKey: ["applications", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, jobs:job_id(id, title, status)")
        .eq("candidate_id", id!);
      if (error) throw error;
      return data;
    },
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ appId, stage }: { appId: string; stage: string }) => {
      const { error } = await supabase
        .from("applications")
        .update({ stage: stage as any })
        .eq("id", appId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", id] });
      toast.success("Stage updated");
    },
    onError: () => toast.error("Failed to update stage"),
  });

  const applyToJob = useMutation({
    mutationFn: async (jobId: string) => {
      const { error } = await supabase.from("applications").insert({
        candidate_id: id!,
        job_id: jobId,
        created_by: user!.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", id] });
      toast.success("Application created");
      setApplyDialogOpen(false);
      setSelectedJobId("");
    },
    onError: (e) => toast.error(e.message),
  });

  const downloadResume = async () => {
    if (!candidate?.resume_url) return;
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(candidate.resume_url, 60);
    if (error) {
      toast.error("Failed to get resume link");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const appliedJobIds = new Set(applications.map((a: any) => a.job_id));
  const availableJobs = jobs.filter((j) => !appliedJobIds.has(j.id));

  if (isLoading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  if (!candidate) return <div className="text-center py-12 text-muted-foreground">Candidate not found</div>;

  const initials = candidate.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/dashboard/candidates")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Candidates
      </Button>

      <Card>
        <CardContent className="flex items-start gap-6 py-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-display">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold font-display">{candidate.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-4 w-4" />{candidate.email}</span>
              {candidate.phone && <span className="flex items-center gap-1"><Phone className="h-4 w-4" />{candidate.phone}</span>}
              <span>Added {format(new Date(candidate.created_at), "MMM d, yyyy")}</span>
            </div>
            {candidate.notes && <p className="text-sm text-muted-foreground mt-2">{candidate.notes}</p>}
          </div>
          <div className="flex gap-2">
            {candidate.resume_url && (
              <Button variant="outline" onClick={downloadResume} className="gap-2">
                <Download className="h-4 w-4" /> Resume
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-display">Applications</h2>
        <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={availableJobs.length === 0}>
              <Plus className="h-4 w-4 mr-1" /> Apply to Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-display">Apply to Job</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Job</Label>
                <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                  <SelectTrigger><SelectValue placeholder="Choose a job..." /></SelectTrigger>
                  <SelectContent>
                    {availableJobs.map((j) => (
                      <SelectItem key={j.id} value={j.id}>{j.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={() => applyToJob.mutate(selectedJobId)}
                  disabled={!selectedJobId || applyToJob.isPending}
                >
                  Apply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No applications yet. Apply this candidate to a job to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app: any) => (
            <ApplicationPipeline
              key={app.id}
              application={app}
              onStageChange={(stage) => updateStage.mutate({ appId: app.id, stage })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateProfile;
