import { StatsCard } from "./stats-card";
import { Users, ClipboardList, BarChart2 } from "lucide-react";

export function ChiefDashboard() {
  const stats = {
    teamMembers: 12,
    inspectionsThisMonth: 42,
    complianceRate: "92%",
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Inspections This Month"
          value={stats.inspectionsThisMonth}
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Compliance Rate"
          value={stats.complianceRate}
          icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4"></div>
    </div>
  );
}
