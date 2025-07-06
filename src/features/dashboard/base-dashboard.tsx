import { StatsCard } from "./stats-card";
import { InspectionList } from "./inspection-list";
import { RecentActivity } from "./recent-activity";
import { type DashboardConfig } from "./types";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BaseDashboardProps {
  config: DashboardConfig;
}

export function BaseDashboard({ config }: BaseDashboardProps) {
  return (
    <div className="space-y-4">
      <div className={`grid gap-4 ${getGridColsClass(config.stats.length)}`}>
        {config.stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {config.showInspectionList && (
        <div className="grid gap-4">
          <InspectionList />
        </div>
      )}

      {config.showRecentActivity && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
          {config.showQuickActions && (
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {/* Quick actions would go here */}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function getGridColsClass(count: number): string {
  switch (count) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "md:grid-cols-2";
    case 3:
      return "md:grid-cols-3";
    case 4:
      return "md:grid-cols-2 lg:grid-cols-4";
    default:
      return "md:grid-cols-2 lg:grid-cols-4";
  }
}
