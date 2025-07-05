import { useAuth } from "@/contexts/useAuth";
import { AdminDashboard } from "./admin-dashboard";
import { InspectorDashboard } from "./inspector-dashboard";
import { ChiefDashboard } from "./chief-dashboard";
import { SectionChiefDashboard } from "./sectionchief-dashboard";
import { UnitHeadDashboard } from "./unithead-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { type UserLevel } from "@/types";
import { type ReactElement } from "react";

export function RoleBasedDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!user) return null;

  // Map user levels to dashboard components
  const getDashboardComponent = (userLevel: UserLevel): ReactElement => {
    switch (userLevel) {
      case "administrator":
        return <AdminDashboard />;
      case "division_chief":
        return <ChiefDashboard />;
      case "eia_air_water_section_chief":
      case "toxic_hazardous_section_chief":
      case "solid_waste_section_chief":
        return <SectionChiefDashboard />;
      case "eia_monitoring_unit_head":
      case "air_quality_unit_head":
      case "water_quality_unit_head":
        return <UnitHeadDashboard />;
      case "eia_monitoring_personnel":
      case "air_quality_monitoring_personnel":
      case "water_quality_monitoring_personnel":
      case "toxic_chemicals_monitoring_personnel":
      case "solid_waste_monitoring_personnel":
        return <InspectorDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return getDashboardComponent(user.user_level);
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
