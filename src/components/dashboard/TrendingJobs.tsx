import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from "lucide-react";

interface Job {
  id: string;
  title: string;
  status: string;
  location?: string;
  job_type: string;
}

interface TrendingJobsProps {
  jobs: Job[];
}

const TrendingJobs = ({ jobs }: TrendingJobsProps) => {
  const openJobs = jobs.filter((j) => j.status === "open").slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          Active Job Postings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {openJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No active jobs. Create one to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {openJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{job.title}</p>
                  {job.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </p>
                  )}
                </div>
                <Badge variant="outline" className="shrink-0 capitalize text-xs">
                  {job.job_type}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingJobs;
