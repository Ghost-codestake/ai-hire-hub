import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, UserPlus, CheckCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
  location?: string;
}

interface RecentActivityProps {
  jobs: Job[];
}

const activityFromJobs = (jobs: Job[]) => {
  return jobs.slice(0, 6).map((job) => ({
    id: job.id,
    icon: job.status === "closed" ? CheckCircle : job.status === "draft" ? Clock : Briefcase,
    iconColor:
      job.status === "closed"
        ? "text-success"
        : job.status === "draft"
        ? "text-muted-foreground"
        : "text-primary",
    label:
      job.status === "closed"
        ? `Closed "${job.title}"`
        : job.status === "draft"
        ? `Drafted "${job.title}"`
        : `Posted "${job.title}"`,
    time: formatDistanceToNow(new Date(job.created_at), { addSuffix: true }),
  }));
};

const RecentActivity = ({ jobs }: RecentActivityProps) => {
  const activities = activityFromJobs(jobs);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No recent activity yet.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`mt-0.5 ${a.iconColor}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
