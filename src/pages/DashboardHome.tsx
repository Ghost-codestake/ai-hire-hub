import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StatsCards from "@/components/dashboard/StatsCards";
import HiringPipelineChart from "@/components/dashboard/HiringPipelineChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import TrendingJobs from "@/components/dashboard/TrendingJobs";

const DashboardHome = () => {
  const { user } = useAuth();

  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

      <StatsCards
        totalJobs={jobs.length}
        totalApplicants={0}
        shortlisted={0}
        hired={0}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <HiringPipelineChart />
        <RecentActivity jobs={jobs} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TrendingJobs jobs={jobs} />
      </div>
    </div>
  );
};

export default DashboardHome;
