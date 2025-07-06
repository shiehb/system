import { ClipboardList, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { BaseDashboard } from "./base-dashboard";
import { type DashboardConfig } from "./types";

export function UnitHeadDashboard() {
  const config: DashboardConfig = {
    stats: [
      {
        title: "Assigned Inspections",
        value: 12,
        icon: <ClipboardList className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Pending Approvals",
        value: 3,
        icon: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Overdue Inspections",
        value: 2,
        icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Completed This Week",
        value: 7,
        icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      },
    ],
    showInspectionList: true,
  };

  return <BaseDashboard config={config} />;
}
