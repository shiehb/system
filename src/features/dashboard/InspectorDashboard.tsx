// src/components/dashboard/InspectorDashboard.tsx
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export function InspectorDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      {/* Inspector-specific content */}
      <div> Inspector</div>
      <ActivityFeed  />
    </div>
  );
}
