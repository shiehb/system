import { StatsCard } from "./stats-card";
import { InspectionList } from "./inspection-list";
import { ClipboardList, AlertCircle, CheckCircle } from "lucide-react";

export function InspectorDashboard() {
  const stats = {
    assignedInspections: 8,
    pendingReports: 3,
    completedThisMonth: 5,
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Assigned Inspections"
          value={stats.assignedInspections}
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Pending Reports"
          value={stats.pendingReports}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Completed This Month"
          value={stats.completedThisMonth}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4">
        <InspectionList />
      </div>
    </div>
  );
}
