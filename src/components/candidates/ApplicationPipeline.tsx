import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STAGES = ["applied", "shortlisted", "interview", "hired", "rejected"] as const;

const stageColors: Record<string, string> = {
  applied: "bg-muted text-muted-foreground",
  shortlisted: "bg-warning/15 text-warning",
  interview: "bg-primary/15 text-primary",
  hired: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};

const stageLabels: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  hired: "Hired",
  rejected: "Rejected",
};

interface ApplicationPipelineProps {
  application: {
    id: string;
    stage: string;
    created_at: string;
    jobs: { id: string; title: string; status: string } | null;
  };
  onStageChange: (stage: string) => void;
}

const ApplicationPipeline = ({ application, onStageChange }: ApplicationPipelineProps) => {
  const currentIndex = STAGES.indexOf(application.stage as any);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-display">
            {application.jobs?.title || "Unknown Job"}
          </CardTitle>
          <Badge className={cn("capitalize", stageColors[application.stage])}>
            {stageLabels[application.stage]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          {STAGES.map((stage, i) => {
            const isActive = stage === application.stage;
            const isPast = i < currentIndex && application.stage !== "rejected";
            const isRejected = application.stage === "rejected";

            return (
              <button
                key={stage}
                onClick={() => onStageChange(stage)}
                className={cn(
                  "flex-1 py-2 px-1 text-xs font-medium rounded-md transition-all capitalize text-center",
                  "hover:ring-2 hover:ring-ring hover:ring-offset-1",
                  isActive && stageColors[stage],
                  isPast && "bg-primary/10 text-primary/70",
                  !isActive && !isPast && !isRejected && "bg-muted/50 text-muted-foreground/50",
                  isRejected && stage === "rejected" && stageColors.rejected,
                  isRejected && stage !== "rejected" && "bg-muted/50 text-muted-foreground/50"
                )}
              >
                {stageLabels[stage]}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationPipeline;
