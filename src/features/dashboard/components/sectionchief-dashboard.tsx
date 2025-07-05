// sectionchief-dashboard.tsx
import { StatsCard } from "./stats-card";
import { InspectionList } from "./inspection-list";
import { Users, ClipboardList, BarChart2, AlertCircle } from "lucide-react";

export function SectionChiefDashboard() {
  const stats = {
    teamMembers: 8,
    pendingApprovals: 5,
    inspectionsThisMonth: 32,
    complianceRate: "89%",
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
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

      <div className="grid gap-4">
        <InspectionList />
      </div>
    </div>
  );
}
