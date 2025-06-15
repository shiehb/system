// src/components/dashboard/ManagerDashboard.tsx
import { DataCards } from "@/components/dashboard/data-cards";
import { ChartPieLabel } from "@/components/dashboard/ChartPie";

export function ManagerDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      {/* Manager-specific metrics */}
      <DataCards managerView={true} />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6">
        <ChartPieLabel/>
      </div>
    </div>
  );
}