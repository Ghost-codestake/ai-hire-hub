import { TrendingUp, Clock, Target, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  totalApplications: number;
  conversionRate: number;
  avgTimeToHire: number;
  openPositions: number;
}

const AnalyticsStatsCards = ({ totalApplications, conversionRate, avgTimeToHire, openPositions }: Props) => {
  const stats = [
    { label: "Total Applications", value: totalApplications, icon: TrendingUp, color: "text-primary" },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: Target, color: "text-accent" },
    { label: "Avg. Time to Hire", value: avgTimeToHire > 0 ? `${avgTimeToHire}d` : "—", icon: Clock, color: "text-warning" },
    { label: "Open Positions", value: openPositions, icon: Briefcase, color: "text-success" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
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

export default AnalyticsStatsCards;
