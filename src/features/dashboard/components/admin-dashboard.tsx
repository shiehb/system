import { StatsCard } from "./stats-card";
import { RecentActivity } from "./recent-activity";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, ClipboardList, BarChart2 } from "lucide-react";

export function AdminDashboard() {
  // In a real app, you'd fetch this data from your API
  const stats = {
    totalUsers: 124,
    activeInspections: 42,
    newRegistrations: 18,
    newRegistrationsChange: 12.5,
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Inspections"
          value={stats.activeInspections}
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="New Registrations"
          value={stats.newRegistrations}
          change={stats.newRegistrationsChange}
          icon={<BarChart2 className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Add quick action buttons here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
