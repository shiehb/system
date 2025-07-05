import { RoleBasedDashboard } from "@/features/dashboard/components/role-based-dashboard";

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your inspections today.
        </p>
      </div>
      <RoleBasedDashboard />
    </div>
  );
}
