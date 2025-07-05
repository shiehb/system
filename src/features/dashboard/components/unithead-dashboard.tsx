// unithead-dashboard.tsx
import { StatsCard } from "./stats-card";
import { InspectionList } from "./inspection-list";
import { ClipboardList, AlertCircle, CheckCircle, Clock } from "lucide-react";

export function UnitHeadDashboard() {
  const stats = {
    assignedInspections: 12,
    pendingApprovals: 3,
    overdueInspections: 2,
    completedThisWeek: 7,
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Assigned Inspections"
          value={stats.assignedInspections}
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Overdue Inspections"
          value={stats.overdueInspections}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Completed This Week"
          value={stats.completedThisWeek}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4">
        <InspectionList />
      </div>
    </div>
  );
}
