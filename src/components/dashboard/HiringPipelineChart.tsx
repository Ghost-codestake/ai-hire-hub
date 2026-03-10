import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HiringPipelineChart = () => {
  const { data: applications = [] } = useQuery({
    queryKey: ["applications-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("applications").select("*");
      if (error) throw error;
      return data;
    },
  });

  const data = [
    { stage: "Applied", count: applications.filter((a) => a.stage === "applied").length },
    { stage: "Shortlisted", count: applications.filter((a) => a.stage === "shortlisted").length },
    { stage: "Interview", count: applications.filter((a) => a.stage === "interview").length },
    { stage: "Hired", count: applications.filter((a) => a.stage === "hired").length },
    { stage: "Rejected", count: applications.filter((a) => a.stage === "rejected").length },
  ];

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="font-display">Hiring Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="stage" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HiringPipelineChart;
