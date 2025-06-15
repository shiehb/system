// src/components/dashboard/AdminDashboard.tsx
import { DataCards } from "@/components/dashboard/data-cards";
import { ChartPieLabel } from "@/components/dashboard/ChartPie";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export function AdminDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      {/* Admin-specific metrics */}
      <DataCards adminView={true} />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChartPieLabel />
        <ActivityFeed/>
      </div>
    </div>
  );
}