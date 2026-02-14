import { Briefcase, Users, Star, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  totalJobs: number;
  totalApplicants: number;
  shortlisted: number;
  hired: number;
}

const StatsCards = ({ totalJobs, totalApplicants, shortlisted, hired }: StatsCardsProps) => {
  const stats = [
    { label: "Total Jobs", value: totalJobs, icon: Briefcase, color: "text-primary" },
    { label: "Applicants", value: totalApplicants, icon: Users, color: "text-accent" },
    { label: "Shortlisted", value: shortlisted, icon: Star, color: "text-warning" },
    { label: "Hired", value: hired, icon: CheckCircle, color: "text-success" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
