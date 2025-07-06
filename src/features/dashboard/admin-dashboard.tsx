import { Users, ClipboardList, BarChart2 } from "lucide-react";
import { BaseDashboard } from "./base-dashboard";
import { type DashboardConfig } from "./types";

export function AdminDashboard() {
  const config: DashboardConfig = {
    stats: [
      {
        title: "Total Users",
        value: 124,
        icon: <Users className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "Active Inspections",
        value: 42,
        icon: <ClipboardList className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: "New Registrations",
        value: 18,
        change: 12.5,
        icon: <BarChart2 className="h-4 w-4 text-muted-foreground" />,
      },
    ],
    showRecentActivity: true,
    showQuickActions: true,
  };

  return <BaseDashboard config={config} />;
}
