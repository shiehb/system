import { RoleBasedDashboard } from "@/features/dashboard/role-based-dashboard";

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <RoleBasedDashboard />
    </div>
  );
}
