import { useAuth } from "@/contexts/useAuth";
import { AdminDashboard } from "./admin-dashboard";
import ChiefDashboard from "./divisionchief-dashboard";
import { SectionChiefDashboard } from "./sectionchief-dashboard";
import { UnitHeadDashboard } from "./unithead-dashboard";
import { InspectorDashboard } from "./inspector-dashboard";

import { Skeleton } from "@/components/ui/skeleton";
import { type UserLevel } from "@/types";
import { type ReactElement } from "react";

export function RoleBasedDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) return null;

  return getDashboardComponent(user.user_level);
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
      ))}
    </div>
  );
}

function getDashboardComponent(userLevel: UserLevel): ReactElement {
  const dashboards: Record<UserLevel, ReactElement> = {
    administrator: <AdminDashboard />,
    division_chief: <ChiefDashboard />,
    eia_air_water_section_chief: <SectionChiefDashboard />,
    toxic_hazardous_section_chief: <SectionChiefDashboard />,
    solid_waste_section_chief: <SectionChiefDashboard />,
    eia_monitoring_unit_head: <UnitHeadDashboard />,
    air_quality_unit_head: <UnitHeadDashboard />,
    water_quality_unit_head: <UnitHeadDashboard />,
    eia_monitoring_personnel: <InspectorDashboard />,
    air_quality_monitoring_personnel: <InspectorDashboard />,
    water_quality_monitoring_personnel: <InspectorDashboard />,
    toxic_chemicals_monitoring_personnel: <InspectorDashboard />,
    solid_waste_monitoring_personnel: <InspectorDashboard />,
  };

  return dashboards[userLevel] || <DefaultDashboard />;
}

function DefaultDashboard() {
  return (
    <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
      <p className="text-muted-foreground text-center">
        Your dashboard is being prepared. Please check back later.
      </p>
    </div>
  );
}
