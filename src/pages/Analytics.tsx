import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HiringFunnelChart from "@/components/analytics/HiringFunnelChart";
import TimeToHireChart from "@/components/analytics/TimeToHireChart";
import StageBreakdownChart from "@/components/analytics/StageBreakdownChart";
import AnalyticsStatsCards from "@/components/analytics/AnalyticsStatsCards";

const Analytics = () => {
  const { data: applications = [] } = useQuery({
    queryKey: ["applications-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, jobs:job_id(id, title), candidates:candidate_id(id, name)");
      if (error) throw error;
      return data;
    },
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("candidates").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Compute metrics
  const stageCounts = {
    applied: applications.filter((a) => a.stage === "applied").length,
    shortlisted: applications.filter((a) => a.stage === "shortlisted").length,
    interview: applications.filter((a) => a.stage === "interview").length,
    hired: applications.filter((a) => a.stage === "hired").length,
    rejected: applications.filter((a) => a.stage === "rejected").length,
  };

  const conversionRate = applications.length > 0
    ? Math.round((stageCounts.hired / applications.length) * 100)
    : 0;

  // Time-to-hire: difference between created_at and updated_at for hired applications
  const hiredApps = applications.filter((a) => a.stage === "hired");
  const avgTimeToHire = hiredApps.length > 0
    ? Math.round(
        hiredApps.reduce((sum, a) => {
          const days = (new Date(a.updated_at).getTime() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24);
          return sum + Math.max(days, 0);
        }, 0) / hiredApps.length
      )
    : 0;

  // Applications per job for source tracking
  const appsByJob = jobs.map((j) => ({
    name: j.title.length > 20 ? j.title.slice(0, 20) + "…" : j.title,
    applications: applications.filter((a: any) => a.job_id === j.id).length,
    hired: applications.filter((a: any) => a.job_id === j.id && a.stage === "hired").length,
  })).filter((j) => j.applications > 0);

  // Monthly application trend
  const monthlyData = applications.reduce((acc: Record<string, number>, app) => {
    const month = new Date(app.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const trendData = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Analytics</h1>
        <p className="text-muted-foreground mt-1">Hiring metrics and pipeline insights</p>
      </div>

      <AnalyticsStatsCards
        totalApplications={applications.length}
        conversionRate={conversionRate}
        avgTimeToHire={avgTimeToHire}
        openPositions={jobs.filter((j) => j.status === "open").length}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <HiringFunnelChart stageCounts={stageCounts} />
        <StageBreakdownChart stageCounts={stageCounts} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TimeToHireChart appsByJob={appsByJob} />
        {trendData.length > 0 && (
          <div className="contents">
            {/* Trend chart inline */}
            <TrendChart data={trendData} />
          </div>
        )}
      </div>
    </div>
  );
};

// Small inline trend chart component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TrendChart = ({ data }: { data: { month: string; count: number }[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="font-display text-base">Application Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              color: "hsl(var(--foreground))",
            }}
          />
          <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default Analytics;
