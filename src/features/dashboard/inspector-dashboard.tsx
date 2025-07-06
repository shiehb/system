import { ClipboardList, AlertCircle, CheckCircle } from "lucide-react";
import { BaseDashboard } from "./base-dashboard";
import { type DashboardConfig } from "./types";

export function InspectorDashboard() {
  const config: DashboardConfig = {
    stats: [
      {
        title: "Assigned Inspections",
        value: 8,
        icon: <ClipboardList className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Pending Reports",
        value: 3,
        icon: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Completed This Month",
        value: 5,
        icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      },
    ],
    showInspectionList: true,
  };

  return <BaseDashboard config={config} />;
}
