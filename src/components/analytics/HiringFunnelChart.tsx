import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

interface Props {
  stageCounts: Record<string, number>;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--warning))",
  "hsl(var(--success))",
  "hsl(var(--destructive))",
];

const HiringFunnelChart = ({ stageCounts }: Props) => {
  const data = [
    { name: "Applied", value: stageCounts.applied, fill: COLORS[0] },
    { name: "Shortlisted", value: stageCounts.shortlisted, fill: COLORS[1] },
    { name: "Interview", value: stageCounts.interview, fill: COLORS[2] },
    { name: "Hired", value: stageCounts.hired, fill: COLORS[3] },
    { name: "Rejected", value: stageCounts.rejected, fill: COLORS[4] },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Hiring Funnel</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
          No application data yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-base">Hiring Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { name: "Applied", value: stageCounts.applied, color: COLORS[0] },
            { name: "Shortlisted", value: stageCounts.shortlisted, color: COLORS[1] },
            { name: "Interview", value: stageCounts.interview, color: COLORS[2] },
            { name: "Hired", value: stageCounts.hired, color: COLORS[3] },
            { name: "Rejected", value: stageCounts.rejected, color: COLORS[4] },
          ].map((stage) => {
            const total = stageCounts.applied || 1;
            const pct = Math.round((stage.value / total) * 100);
            return (
              <div key={stage.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{stage.name}</span>
                  <span className="text-muted-foreground">{stage.value} ({pct}%)</span>
                </div>
                <div className="h-3 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HiringFunnelChart;
